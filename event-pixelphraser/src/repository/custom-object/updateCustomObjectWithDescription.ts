import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function updateCustomObjectWithDescription(
    productId: string,
    productName: string,
    imageUrl: string,
    translations: {
        "en-US": string;
        "en-GB": string;
        "de-DE": string;
    },
    productType: string
) {
    try {
        const apiRoot = createApiRoot();
        
        const customObjectResponse = await apiRoot.customObjects().withContainerAndKey({
            container: "temporaryDescription",
            key: productId
        }).get().execute();

        const currentCustomObject = customObjectResponse?.body;

        if (!currentCustomObject) {
            throw new Error(`❌ Custom object not found for product ID: ${productId}`);
        }

        const currentVersion = currentCustomObject.version;
        
        const updateResponse = await apiRoot.customObjects().post({
            body: {
                container: "temporaryDescription",
                key: productId,
                version: currentVersion, 
                value: {
                    usDescription: translations["en-US"],
                    gbDescription: translations["en-GB"],
                    deDescription: translations["de-DE"],
                    imageUrl: imageUrl,
                    productType: productType,
                    productName: productName,
                    generatedAt: new Date().toISOString()
                }
            }
        }).execute();

        return updateResponse;

    } catch (error: any) {
        logger.error(`❌ Failed to update custom object for product ID: ${productId}`, { message: error.message });
        throw error;
    }
}
