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
import { fetchselectedLanguages } from '../repository/custom-object/fetchSelectedLanguages';

export const post = async (request: Request, response: Response): Promise<void> => {
    try {
        // Extract and validate Pub/Sub message
        const pubSubMessage = request.body?.message;
        if (!pubSubMessage) {
            logger.error('Missing Pub/Sub message');
            response.status(200).send();
            return;
        }
        // logger.info('Message Received:', pubSubMessage);

        // Decode Pub/Sub message data
        const decodedData = pubSubMessage.data
            ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
            : undefined;

        if (!decodedData) {
            logger.error('No data found in Pub/Sub message');
            response.status(200).send();
            return;
        }
        // logger.info(`Decoded Data: ${decodedData}`);

        // Parse the decoded data
        const messageData = JSON.parse(decodedData);

        // Get message ID & notification type
        const messageId = messageData?.id;
        const notificationType = messageData?.notificationType;

        // Check if the notification type is ResourceCreated or Message
        if (notificationType === 'Message') {
            logger.info(`Message ID: ${messageId} - message received is ${notificationType}. processing message`);
        } else if (notificationType === 'ResourceCreated') {
            logger.info(`Message ID: ${messageId} - message received is ${notificationType}. skipping message`);
            response.status(200).send();
            return;
        } else {
            logger.info(`Message ID: ${messageId} - message received is ${notificationType}. skipping message`);
            response.status(200).send();
            return;
        }

        // Check if the resource type is valid
        const eventType = messageData?.type;
        logger.info(`Message ID: ${messageId} - event received: ${eventType}`);
        const validEventTypes = ['ProductVariantAdded', 'ProductImageAdded', 'ProductCreated'];
        if (!validEventTypes.includes(eventType)) {
            logger.error(`Message ID: ${messageId} - invalid event type: ${eventType}`);
            response.status(200).send();
            return;
        }

        // Check if the product ID is present in the message
        const productId = messageData.resource?.id;
        if (!productId) {
            logger.error(`Message ID: ${messageId} - product ID not found in message`);
            response.status(200).send();
            return;
        }

        // Fetch product data from commercetools
        const productData = await fetchProduct(productId, messageId);

        // Extract product type, name and image URL from product data
        const productType = productData?.productType?.id;
        const imageUrl = productData?.masterData?.current?.masterVariant?.images?.[0]?.url;
        const nameMap = productData?.masterData?.current?.name || {};
        const productName = nameMap['en'] || nameMap['en-US'] || Object.values(nameMap)[0];
        logger.info(`Message ID: ${messageId} - product name: ${productName}`);

        // Check if product type, name and image URL are present
        if (!productType || !productName || !imageUrl) {
            logger.error(`Message ID: ${messageId} - missing data (Product Type: ${productType}, Product Name: ${productName}, Image Url: ${imageUrl})`);
            response.status(200).send();
            return;
        }

        // Extract and validate product attributes
        const attributes: ProductAttribute[] = productData?.masterData?.staged?.masterVariant?.attributes || [];
        if (!attributes.length) {
            logger.error(`Message ID: ${messageId} - no product attributes found`);
            response.status(200).send();
            return;
        }

        // Check if automatic description generation is enabled
        const genDescriptionAttr = attributes.find(attr => attr.name === 'generateDescription');
        if (!genDescriptionAttr || !Boolean(genDescriptionAttr?.value)) {
            logger.info(`Message ID: ${messageId} - automatic description generation not enabled`);
            response.status(200).send();
            return;
        }

        // Sending acknowledgment to Pub/Sub
        response.status(200).send();
        logger.info(`Message ID: ${messageId} - acknowledgment sent to Pub/Sub`);

        // Fetch product type key from commercetools
        const productTypeKey = await fetchProductType(productType, messageId);

        // Analyze product image
        const imageData = await productAnalysis(imageUrl, messageId);

        // Generate product description
        const generatedDescription = await generateProductDescription(imageData, productName, productTypeKey, messageId);

        // Fetch selected languages for translation
        const languagesForTranslation = await fetchselectedLanguages(messageId);

        // Translate description to multiple languages
        const translations = await translateProductDescription(generatedDescription, languagesForTranslation, messageId);

        // Create custom object to store product descriptions
        await createProductCustomObject(productId, imageUrl, productName, productTypeKey, languagesForTranslation, messageId);

        // Update the custom object with the generated description
        await updateCustomObjectWithDescription(productId, productName, imageUrl, translations as Record<string, string>, productTypeKey, messageId);

        logger.info(`Message ID: ${messageId} - processing completed`);

    } catch (error) {
        logger.error('Error processing request', {
            error: error instanceof Error ? error.message : error
        });
        response.status(500).send();
    }
};