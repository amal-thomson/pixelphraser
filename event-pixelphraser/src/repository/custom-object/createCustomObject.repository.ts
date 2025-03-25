import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function createProductCustomObject(productId: string, imageUrl: string, productName: string, productType: string) {
    try {
        const apiRoot = createApiRoot();
        
        const customObject = await apiRoot.customObjects().post({
            body: {
                container: "temporaryDescription",
                key: productId,
                value: {
                    usDescription: null,
                    gbDescription: null,
                    deDescription: null,
                    imageUrl: imageUrl,
                    productType,
                    productName: productName
                }
            }
        }).execute();

        return customObject;

    } catch (error: any) {
        logger.error(`❌ Failed to create custom object for product ID: ${productId}`, { message: error.message });
        throw error;
    }
}
