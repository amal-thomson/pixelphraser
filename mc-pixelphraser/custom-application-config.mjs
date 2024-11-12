import { PERMISSIONS, entryPointUriPath } from './src/constants';

const config = {
  name: 'PixelPhraser',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'PROJECT_ID',
    },
    production: {
      applicationId: 'APPLICATION_ID',
      url: 'https://your_app_hostname.com',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/screen.svg}',
  mainMenuLink: {
    defaultLabel: 'PixelPhraser',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
};

export default config;