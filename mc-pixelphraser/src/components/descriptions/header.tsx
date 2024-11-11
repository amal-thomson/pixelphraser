import { PrimaryButton } from '@commercetools-uikit/buttons';
import Text from '@commercetools-uikit/text';
import logo from './images/pixelphraser.png';
import { HeaderProps } from '../../interfaces/headerProps';

export const Header = ({ onRefresh, isLoading }: HeaderProps) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
    <img
      src={logo}
      alt="Project Logo"
      style={{
        height: '40px',
        marginRight: '1rem'
      }}
    />
    <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text.Headline as="h1">Temporary Product Descriptions</Text.Headline>
      <PrimaryButton
        label="Refresh"
        onClick={onRefresh}
        isDisabled={isLoading}
      />
    </div>
  </div>
);