import { SecondaryButton } from '@commercetools-uikit/buttons';
import { GearIcon, RefreshIcon } from '@commercetools-uikit/icons';
import Text from '@commercetools-uikit/text';
import Link from '@commercetools-uikit/link';
import logo from './images/pixelphraser.png';
import { HeaderProps } from '../../interfaces/headerProps';
import { useRouteMatch } from 'react-router-dom';

export const Header = ({ onRefresh, isLoading }: HeaderProps) => {
 const match = useRouteMatch();

  return (
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
        <Text.Headline as="h1">AI Generated Product Descriptions</Text.Headline>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SecondaryButton
            label="Refresh"
            iconLeft={<RefreshIcon />}
            onClick={onRefresh}
            isDisabled={isLoading}
          />
          <Link to={`${match.url}/project-details`} >
            <SecondaryButton
              label="Settings"
              iconLeft={<GearIcon />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
