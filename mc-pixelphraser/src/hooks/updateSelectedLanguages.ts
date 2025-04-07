import { actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

export const updateSelectedLanguages = async (dispatch: any, selectedLanguages: string[]) => {
  try {
    await dispatch(
      actions.post({
        mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
        service: 'customObjects',
        options: {
        },
        payload: {
          container: 'selectedLanguages',
          key: 'pixelphraser',   
          value: selectedLanguages,     
        },
      })
    );
  } catch (error) {
    console.error('Error updating selected languages:', error);
    throw error;
  }
};
