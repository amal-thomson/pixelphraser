import { Product } from '@commercetools/platform-sdk';
import { createApiRoot } from '../../client/create.client';
import { logger } from '../../utils/logger.utils';

export async function fetchProduct(productId: string): Promise<Product> {
    try {
        const apiRoot = createApiRoot();

        logger.info('⌛Fetching product data for product ID: ' + productId);
        
        const productResponse = await apiRoot
            .products()
            .withId({ ID: productId })
            .get()
            .execute();

        const productData = productResponse.body ?? null;

        logger.info(`✅Product fetched successfully: ${productData}`);

        return productData;

    } catch (error: any) {
        logger.error(`🚫Failed to fetch product for ID: ${productId}`, {
            message: error.message,
        });
        throw error;
    }
}
