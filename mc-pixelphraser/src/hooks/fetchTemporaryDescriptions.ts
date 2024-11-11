import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { TemporaryDescriptionsResponse } from '../interfaces/temporaryDescriptionsResponse';
import { actions } from '@commercetools-frontend/sdk';

export const fetchTemporaryDescriptions = async (dispatch: any) => {
    try {
      const result = await dispatch(
        actions.get({
          mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
          service: 'customObjects',
          options: {
            id: 'temporaryDescription',
          },
        })
      ) as TemporaryDescriptionsResponse;
      return result;
    } catch (error) {
      console.error('Error fetching temporary descriptions:', error);
      throw error;
    }
  };