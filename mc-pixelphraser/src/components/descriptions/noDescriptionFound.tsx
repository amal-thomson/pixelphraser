import React from 'react';
import Text from '@commercetools-uikit/text';
import noDescription from './images/no-descriptions.png';

export const NoDescriptionsFound: React.FC = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    textAlign: 'center'
  }}>
    <img
      src={noDescription}
      alt="No descriptions found"
      style={{
        maxWidth: '300px',
        marginBottom: '1.5rem'
      }}
    />
    <Text.Headline as="h3">OOPS! DESCRIPTION NOT FOUND!!!</Text.Headline>
    <Text.Body tone="secondary">
      Descriptions will be available once new products are added. Please check back shortly for the latest updates.
    </Text.Body>
  </div>
);