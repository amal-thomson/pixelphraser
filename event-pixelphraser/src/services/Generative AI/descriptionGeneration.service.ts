import { ImageData } from '../../interfaces/imageData.interface';
import { logger } from '../../utils/logger.utils';
import { model } from '../../config/ai.config';

export async function generateProductDescription(imageData: ImageData): Promise<string> {
    try {

        const prompt = `You are a professional e-commerce product copywriter. Write a compelling, SEO-optimized product description for an apparel item based on the following image analysis:

            Image Analysis Data:
            - Labels: ${imageData.labels}
            - Objects detected: ${imageData.objects}
            - Dominant colors: ${imageData.colors.join(', ')}
            - Text detected: ${imageData.detectedText}
            - Web entities: ${imageData.webEntities}

            Description Guidelines:
            1. The description should be professional, concise, and engaging (150-200 words).
            2. Clearly specify the target category (e.g., men's, women's, kids').
            3. Highlight key features such as style, fit, and comfort relevant to the target category.
            4. Confidently describe the fabric’s feel (e.g., soft, breathable) without using uncertain language like "while not specified."
            5. If colors are unclear, use appealing general terms (e.g., 'a light, fresh tone' or 'a subtle neutral shade'). Focus on other features if color detection is poor.
            6. Suggest occasions to wear the item (e.g., casual, formal, activewear) and describe how it fits the target category's lifestyle.
            7. Mention styling options, like pairing with accessories or layering possibilities.
            8. If applicable, include care instructions (e.g., machine washable).
            9. Add sizing or fit information if relevant (e.g., slim fit, true to size).
            10. Ensure the description is strictly Search Engine Optimised (SEO) by:
                - Incorporating primary keywords naturally and strategically throughout the description.
                - Using secondary keywords, synonyms, or related phrases to broaden search visibility.
                - Addressing common search intents (e.g., specific use cases, events, or occasions).
                - Structuring the description for scannability with clear, concise sentences and bullet points.
                - Including a persuasive call to action (e.g., "Shop now," "Add to your collection today").
            11. Avoid keyword stuffing and ensure all text reads naturally for a human audience while still appealing to search engines.

            Key Features Section:
            - Include 3-5 key bullet points that summarize the product's main attributes, focusing on fabric, fit, versatility, and relevant SEO keywords.
            - Use keyword-rich language while ensuring readability and engagement.

            Ensure no text styling (e.g., bold, italics) is applied in either section.`;


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
