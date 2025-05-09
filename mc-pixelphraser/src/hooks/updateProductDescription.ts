import { actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

export const updateProductDescription = async (dispatch: any, productId: string, usDescription: string, gbDescription: string, deDescription: string) => {
    try {
      const product = await dispatch(
        actions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'products',
          options: {
            id: productId,
          },
        })
      );
  
      await dispatch(
        actions.post({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'products',
          options: {
            id: productId,
          },
          payload: {
            version: product.version,
            actions: [
              {
                action: 'setDescription',
                description: { 
                  "en-us": usDescription,
                  "en-gb": gbDescription,
                  "de-de": deDescription 
                },
              },
            ],
          },
        })
      );
    } catch (error) {
      console.error('Error updating product description:', error);
      throw error;
    }
  };