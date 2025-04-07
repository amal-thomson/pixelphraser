import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function updateCustomObjectWithDescription(
    productId: string,
    productName: string,
    imageUrl: string,
    translations: Record<string, string>,
    productType: string,
    messageId: string
) : Promise<void> {
    try {
        logger.info(`Message ID: ${messageId} - updating custom object with ID: ${productId}.`);
        
        const apiRoot = createApiRoot();        

        const customObjectResponse = await apiRoot.customObjects().withContainerAndKey({
            container: "temporaryDescription",
            key: productId
        }).get().execute();

        const currentCustomObject = customObjectResponse?.body;

        if (!currentCustomObject) {
            throw new Error(`Message ID: ${messageId} - custom object not found with ID: ${productId}`);
        }

        const currentVersion = currentCustomObject.version;
        
        const updatedValue = {
            ...translations,
            imageUrl,
            productType,
            productName,
            generatedAt: new Date().toISOString()
        };

        await apiRoot.customObjects().post({
            body: {
                container: "temporaryDescription",
                key: productId,
                version: currentVersion, 
                value: updatedValue
            }
        }).execute();

        logger.info(`Message ID: ${messageId} - custom object updated with ID: ${productId}.`);
        return;

    } catch (error: any) {
        logger.error(`Message ID: ${messageId} - failed to update custom object with ID: ${productId}`, { 
            message: error.message 
        });
        throw error;
    }
}
