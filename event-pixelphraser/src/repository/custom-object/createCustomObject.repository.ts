import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function createProductCustomObject(
    productId: string, 
    imageUrl: string, 
    productName: string, 
    productType: string, 
    languagesForTranslation: string[],
    messageId: string
) : Promise<void> {
    try {
        const apiRoot = createApiRoot();

        logger.info(`Message ID: ${messageId} - creating custom object with ID: ${productId}`);

        const descriptions = languagesForTranslation.reduce((acc, lang) => {
            acc[lang] = null; 
            return acc;
        }, {} as Record<string, string | null>);

        await apiRoot.customObjects().post({
            body: {
                container: "temporaryDescription",
                key: productId,
                value: {
                    ...descriptions,
                    imageUrl,
                    productType,
                    productName
                }
            }
        }).execute();

        logger.info(`Message ID: ${messageId} - custom object created with ID: ${productId}.`);

    } catch (error: any) {
        logger.error(`Message ID: ${messageId} - failed to create custom object with ID: ${productId}`, { 
            message: error.message 
        });
        throw error;
    }
}
