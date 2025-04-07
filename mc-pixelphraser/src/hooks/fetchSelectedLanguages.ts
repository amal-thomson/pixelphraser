import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
import { actions } from '@commercetools-frontend/sdk';

export const fetchSelectedLanguages = async (dispatch: any) => {
  try {
    const result = await dispatch(
      actions.get({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'customObjects',
        options: {
          container: 'selectedLanguages',
          key: 'pixelphraser',
        },
      })
    );
    return result;
  } catch (error) {
    console.error('Error fetching selected languages:', error);
    throw error;
  }
};
