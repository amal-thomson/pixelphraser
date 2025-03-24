import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function fetchProductType(productType: string): Promise<string | null> {
    try {
        const apiRoot = createApiRoot();

        logger.info('⌛Fetching product type key for product type ID: ' + productType);

        const productTypeResponse = await apiRoot
            .productTypes()
            .withId({ ID: productType })
            .get()
            .execute();

        const productTypeKey = productTypeResponse.body.key ?? null;

        logger.info(`✅Product type fetched successfully: ${productTypeKey}`);

        return productTypeKey;
        
    } catch (error: any) {
        logger.error(`🚫Failed to fetch product type for ID: ${productType}`, {
            message: error.message,
        });
        return null;
    }
}
