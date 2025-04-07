import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function fetchProductType(productType: string, messageId: string): Promise<string> {
    try {
        const apiRoot = createApiRoot();

        logger.info(`Message ID: ${messageId} - fetching product type with ID: ${productType}`);

        const productTypeResponse = await apiRoot
            .productTypes()
            .withId({ ID: productType })
            .get()
            .execute();

        const productTypeKey = productTypeResponse.body.key ?? '';

        logger.info(`Message ID: ${messageId} - product type fetched, Product Type: ${productTypeKey}`);

        return productTypeKey;
        
    } catch (error: any) {
        logger.error(`Message ID: ${messageId} - failed to fetch product type with ID: ${productType}`, {
            message: error.message,
        });
        throw error;
    }
}
