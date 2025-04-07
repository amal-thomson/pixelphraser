import { ImageData } from '../../interfaces/imageData.interface';
import { logger } from '../../utils/logger.utils';
import { model } from '../../config/ai.config';

export async function generateProductDescription(imageData: ImageData, productName: string, productTypeKey: string, messageId: string): Promise<string> {
    try {
        logger.info(`Message ID: ${messageId} - sending prompt to Generative AI for description generation`);

        const prompt = `Generate a persuasive, SEO-optimized product description (under 150 words) for a product type : "${productTypeKey}", based on the following data:

        **Product Name:** "${productName}"

        **Image Insights:**
        - Labels: ${imageData.labels}
        - Objects: ${imageData.objects}
        - Colors: ${imageData.colors.join(', ')}
        - Detected Text: ${imageData.detectedText}
        - Web Entities: ${imageData.webEntities}

        **Requirements:**
        1. Write a compelling introduction that immediately captures attention.
        2. Clearly define the product, emphasizing material, design, and standout features.
        3. Explain functionality, benefits, and ideal use cases.
        4. Mention available variations (colors, sizes) if applicable.
        5. Ensure SEO-friendly, natural language without keyword stuffing.
        6. Avoid any inappropriate, offensive, misleading, or exaggerated claims.
        7. End with a strong, persuasive call to action (e.g., "Upgrade your experience today!").

        **Key Features:**  
        - Bullet-point summary of essential attributes.

        Return only the polished description text with a professional, engaging, and customer-friendly tone.`;

        const result = await model.generateContent(prompt);
        if (!result?.response) throw new Error('Generative AI response is null or undefined.');

        const generatedDescription = result.response.text();
        logger.info(`Message ID: ${messageId} - description generated`);
        return generatedDescription;

    } catch (error: any) {
        logger.error(`Message ID: ${messageId} - error during generating description`, { 
            message: error.message, stack: error.stack 
        });
        throw error;
    }
}
