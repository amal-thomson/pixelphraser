import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { actions } from '@commercetools-frontend/sdk';

export const deleteTemporaryDescription = async (dispatch: any, id: string, version: number) => {
    try {
      await dispatch(
        actions.del({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
          options: {
            id,
            version,
          },
        })
      );
    } catch (error) {
      console.error('Error deleting temporary description:', error);
      throw error;
    }
  };