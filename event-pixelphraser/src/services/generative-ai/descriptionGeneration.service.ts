// import { ImageData } from '../../interfaces/imageData.interface';
// import { logger } from '../../utils/logger.utils';
// import { model } from '../../config/ai.config';

// export async function generateProductDescription(imageData: ImageData, productName: string, productTypeKey: string): Promise<string> {
//     try {
//         const prompt = `You are an expert e-commerce copywriter. Write a compelling, SEO-optimized product description for a ${productTypeKey} based on the following image analysis:

//         **Product Name**: ${productName}

//         **Image Analysis Data**:
//         - Labels: ${imageData.labels}
//         - Objects detected: ${imageData.objects}
//         - Dominant colors: ${imageData.colors.join(', ')}
//         - Text detected: ${imageData.detectedText}
//         - Web entities: ${imageData.webEntities}

//         **Description Guidelines**:
//         1. Use details from the product name to enhance the description.
//         2. Clearly define the product type and its key attributes.
//         3. Highlight essential features such as material, functionality, design, and unique selling points.
//         4. Describe its intended use, target audience, and benefits.
//         5. If applicable, mention color variations, sizes, or specifications.
//         6. Suggest potential use cases or ideal settings for the product.
//         7. Incorporate natural SEO-friendly language without keyword stuffing.
//         8. Ensure readability with concise yet engaging language.
//         9. Include a persuasive call to action (e.g., "Order now to experience quality and style").
//         10. Keep the description under 150 words.

//         **Key Features Section**:
//         - Summarize the most important attributes concisely.
//         - Use keyword-rich yet natural descriptions.

//         Ensure the text flows naturally, maintains professional tone, and is optimized for both customers and search engines.`;

//         const result = await model.generateContent(prompt);
//         if (!result?.response) throw new Error('❌ Generative AI response is null or undefined.');

//         const generatedDescription = result.response.text();
//         logger.info('✅ Generative AI description generated successfully.');
//         return generatedDescription;
//     } catch (error: any) {
//         logger.error('❌ Error during description generation:', { message: error.message, stack: error.stack });
//         throw error;
//     }
// }

import { ImageData } from '../../interfaces/imageData.interface';
import { logger } from '../../utils/logger.utils';
import { model } from '../../config/ai.config';

export async function generateProductDescription(imageData: ImageData, productName: string, productTypeKey: string): Promise<string> {
    try {
        let prompt = '';

        switch (productTypeKey) {

            case 'clothing':
                prompt = `You are a professional e-commerce product copywriter. Write a compelling, SEO-optimized product description for an apparel item based on the following image analysis:

                Product Name: ${productName}

                Image Analysis Data:
                - Labels: ${imageData.labels}
                - Objects detected: ${imageData.objects}
                - Dominant colors: ${imageData.colors.join(', ')}
                - Text detected: ${imageData.detectedText}
                - Web entities: ${imageData.webEntities}

                Description Guidelines:
                1. Use details from the product name to enhance the description.
                2. Specify the target category (e.g., men's, women's, kids').
                3. Highlight key features such as style, fit, and comfort.
                4. Describe the fabric’s feel confidently.
                5. Suggest occasions for wearing the item.
                6. Mention styling options and care instructions.
                7. Include sizing or fit information.
                8. Ensure the description is SEO-optimized with natural keyword usage.
                9. Avoid keyword stuffing.
                10. Keep the description under 150 words.

                Key Features Section:
                - Summarize fabric, fit, and versatility.
                - Use engaging, keyword-rich language.`;
                break;

            case 'furniture-and-decor':
                prompt = `You are an expert furniture and home decor copywriter. Write a captivating, SEO-optimized product description for a furniture or decor item based on the following image analysis:

                Product Name: ${productName}

                Image Analysis Data:
                - Labels: ${imageData.labels}
                - Objects detected: ${imageData.objects}
                - Dominant colors: ${imageData.colors.join(', ')}
                - Text detected: ${imageData.detectedText}
                - Web entities: ${imageData.webEntities}

                Description Guidelines:
                1. Use details from the product name to enhance the description.
                2. Clearly define the product type (e.g., sofa, lamp, wall art).
                3. Highlight materials, craftsmanship, and durability.
                4. Describe design elements and how they enhance home aesthetics.
                5. Suggest placement ideas for different room settings.
                6. Mention comfort, practicality, and maintenance tips.
                7. Optimize for SEO with relevant keywords and natural readability.
                8. Avoid keyword stuffing.
                9. Keep the description under 150 words.

                Key Features Section:
                - Summarize materials, design, and functionality.
                - Use keyword-rich yet engaging descriptions.`;
                break;

            case 'books':
                prompt = `You are a professional book description writer. Write an engaging, SEO-optimized book description based on the following image analysis:

                Product Name: ${productName}

                Image Analysis Data:
                - Labels: ${imageData.labels}
                - Objects detected: ${imageData.objects}
                - Dominant colors: ${imageData.colors.join(', ')}
                - Text detected: ${imageData.detectedText}
                - Web entities: ${imageData.webEntities}

                Description Guidelines:
                1. Use details from the product name to enhance the description.
                2. Clearly state the book’s title, genre, and author (if detected).
                3. Provide a brief, compelling synopsis without spoilers.
                4. Highlight the book’s unique appeal (e.g., themes, writing style).
                5. Mention target audience (e.g., fiction lovers, self-help readers).
                6. Suggest ideal reading situations (e.g., casual reading, study material).
                7. Include SEO-friendly language while maintaining natural readability.
                8. Avoid keyword stuffing.
                9. Keep the description under 150 words.

                Key Features Section:
                - Summarize genre, themes, and appeal.
                - Use engaging, keyword-rich language.`;
                break;

            default:
                throw new Error('Unsupported product type. Please provide a valid product category.');
        }

        const result = await model.generateContent(prompt);
        if (!result?.response) throw new Error('❌ Generative AI response is null or undefined.');

        const generatedDescription = result.response.text();
        logger.info('✅ Generative AI description generated successfully.');
        return generatedDescription;
    } catch (error: any) {
        logger.error('❌ Error during description generation:', { message: error.message, stack: error.stack });
        throw error;
    }
}
