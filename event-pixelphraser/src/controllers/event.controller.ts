import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';
import { productAnalysis } from '../services/vision-ai/productAnalysis.service';
import { generateProductDescription } from '../services/generative-ai/descriptionGeneration.service';
import { ProductAttribute } from '../interfaces/productAttribute.interface';
import { createProductCustomObject } from '../repository/custom-object/createCustomObject.repository';
import { updateCustomObjectWithDescription } from '../repository/custom-object/updateCustomObjectWithDescription';
import { fetchProductType } from '../repository/product-type/fetchProductTypeById.repository';
import { translateProductDescription } from '../services/generative-ai/translateProductDescription.service';
import { fetchProduct } from '../repository/product/fetchProductByID.repository';

export const post = async (request: Request, response: Response) => {
    try {
        const pubSubMessage = request.body.message;
        logger.info('✅Message Received:', pubSubMessage);

        // Check if the message is empty
        const decodedData = pubSubMessage.data
            ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
            : undefined;

        if (!decodedData) {
            logger.error('🚫No data found in Pub/Sub message.');
            return response.status(200).send();
        }

        const messageData = JSON.parse(decodedData);
        logger.info('✅Decoded Data:', messageData);

        // Check if the notification type is ResourceCreated
        if (messageData.notificationType === 'ResourceCreated') {
            logger.info('✅Resource created notification received. Skipping the message.');
            return response.status(200).send();
        }

        // Check if the message type is ProductVariantAdded
        const eventType = messageData?.type;
        if (eventType === 'ProductVariantAdded') {
            logger.info(`✅Event message received, Event Type: ${eventType}`);
            logger.info('⌛Processing event message.');
        } else {
            logger.error(`🚫Invalid event type received, Event Type: ${eventType}`);
            return response.status(200).send();
        }

        // Extract product ID and image URL from message data
        const productId = messageData.resource.id;
        const imageUrl = messageData?.variant?.images?.[0]?.url;
        // const productName = messageData?.variant?.images?.[0]?.label;

        if (!imageUrl) {
            logger.error('🚫Image URL is missing or null.', { productId });
            return response.status(200).send();
        }
        logger.info(`Product Id: ${productId}, Image Url: ${imageUrl}`);

        // Fetch product data
        const productData = await fetchProduct(productId);
        // logger.info('Product Data:', productData);
        
        // Extract product type, name and id from product data
        const productName = productData.masterData.current.name["en-US"];
        const productType = productData.productType.id;
        
        logger.info(`Product Name: ${productName}, Product Type: ${productType}`);
        
        // Check if product ID, image URL, product name and product type are available
        if (productId && imageUrl && productName && productType) {
            const attributes: ProductAttribute[] = productData.masterData?.staged?.masterVariant?.attributes || [];
            // Check if attributes are available
            if (!attributes || attributes.length === 0) {
                logger.error('🚫No attributes found in the product data.');
                return response.status(200).send();
            }
            // Check if generateDescription attribute is available
            const genDescriptionAttr = attributes.find(attr => attr.name === 'generateDescription');
            if (!genDescriptionAttr) {
                logger.error('🚫The attribute "generateDescription" is missing.', { productId, imageUrl });
                return response.status(200).send();
            }
            // Check if generateDescription attribute is enabled
            const isGenerateDescriptionEnabled = Boolean(genDescriptionAttr?.value);
            if (!isGenerateDescriptionEnabled) {
                logger.info('🚫The option for automatic description generation is not enabled.', { productId, imageUrl });
                return response.status(200).send();
            }
            // Fetch product type key
            const productTypeKey = await fetchProductType(productType);
            if (!productTypeKey) {
                logger.error('🚫Failed to fetch product type key.');
                return response.status(500).send();
            }

            // Send ACK to Pub/Sub
            logger.info('⌛Sending ACK to Pub/Sub.');
            response.status(200).send();
            logger.info('✅Successfully sent ACK to Pub/Sub.');

            // Process image data
            logger.info('⌛Sending product image to Vision AI.');
            const imageData = await productAnalysis(imageUrl);
            logger.info('✅Vision AI analysis completed successfully.');

            // Generate product description
            logger.info('⌛Sending image data to Generative AI for generating descriptions.');
            const generatedDescription = await generateProductDescription(imageData, productName, productTypeKey);
            logger.info('✅ Generative AI description generated successfully.');
            
            // Translate generated description
            logger.info('⌛Sending generatedDescription to Generative AI for translation.');
            const translations = await translateProductDescription(generatedDescription);
            
            // Create custom object for product description
            logger.info('⌛Creating custom object for product description.');
            await createProductCustomObject(productId, imageUrl, productName, productTypeKey);
            logger.info(`✅ Custom object created successfully for product ID: ${productId}.`);
            
            // Update custom object with generated description
            logger.info('⌛Updating custom object with generated description.');
            const translationsTyped: { "en-US": string; "en-GB": string; "de-DE": string } = translations as {
                "en-US": string;
                "en-GB": string;
                "de-DE": string;
            };

            logger.info(`✅Fetching custom object for product ID: ${productId} to get current version.`);
            await updateCustomObjectWithDescription(productId, productName, imageUrl, translationsTyped, productTypeKey);
            logger.info(`✅Custom object updated successfully for product ID: ${productId}.`);
                        
            return;
        }

    } catch (error) {
        if (error instanceof Error) {
            logger.error('🚫Error processing request', { error: error.message });
            return;
        }
        logger.error('🚫Unexpected error', { error });
        return;
    }
};