import { useState, useEffect } from 'react';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import Constraints from '@commercetools-uikit/constraints';
import { PrimaryButton, SecondaryButton } from '@commercetools-uikit/buttons';
import { CheckBoldIcon, CloseBoldIcon, CloseIcon, HomeIcon, InfoIcon, ReviewIcon, WorldIcon } from '@commercetools-uikit/icons';
import Tooltip from '@commercetools-uikit/tooltip';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import { updateSelectedLanguages } from '../../hooks/updateSelectedLanguages';
import { fetchSelectedLanguages } from '../../hooks/fetchSelectedLanguages';
import { StatusMessage } from '../common/statusMessage';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useHistory } from 'react-router-dom'; 

type LocalesConfiguredProps = {
  languages?: string[];
  // showSuccessMessage: (message: string) => void;
};

const LanguagesConfigured = ({ languages = [] }: LocalesConfiguredProps) => {
  const dispatch = useAsyncDispatch();
  const history = useHistory();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [savedLanguages, setSavedLanguages] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const showNotification = useShowNotification();

  const showSuccessMessage = (message: string) => {
    showNotification({
      kind: 'success',
      domain: 'side',
      text: message,
    });
  };

  useEffect(() => {
    const loadSavedLanguages = async () => {
      setLoading(true);
      try {
        const response = await fetchSelectedLanguages(dispatch);
        console.log('Response Value:', response.value);
        if (response?.value) {
          if (Array.isArray(response.value)) {
            console.log('Fetched Selected Languages:', response.value);
            setSavedLanguages(response.value);
          } else {
            console.warn('Unexpected data format for selected languages:', response.value);
          }
        }
      } catch (error) {
        console.error('Error fetching saved languages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedLanguages();
  }, [dispatch]);

  const handleToggleLanguage = (lang: string) => {
    setSelectedLanguages((prevSelected) =>
      prevSelected.includes(lang)
        ? prevSelected.filter((item) => item !== lang)
        : [...prevSelected, lang]
    );
  };

  const handleSelectAll = () => {
    setSelectedLanguages([...languages]);
  };

  const handleDeselectAll = () => {
    setSelectedLanguages([]);
  };

  const handleSaveSelection = async () => {
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      await updateSelectedLanguages(dispatch, selectedLanguages);
      showSuccessMessage('Languages saved successfully!');
      setSavedLanguages(selectedLanguages);
      setIsSelectionMode(false);
      setSelectedLanguages([]);
  
    } catch (error) {
      setErrorMessage('Failed to save languages. Please try again.');
      console.error('Failed to save languages:', error);
    }
  };

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Inline justifyContent="flex-end" scale="s">
        <SecondaryButton label="Home" iconLeft={<HomeIcon />} onClick={() => history.goBack()} />
        {languages.length > 0 && (
          <SecondaryButton
            label={isSelectionMode ? 'Cancel Selection' : 'Select Languages'}
            iconLeft={isSelectionMode ? <CloseBoldIcon /> : <ReviewIcon />}
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              setSelectedLanguages([]);
            }}
          />
        )}
      </Spacings.Inline>
      
      <Card theme="light" insetScale="l">
        <Spacings.Stack scale="l">
          <Spacings.Inline alignItems="center" justifyContent="space-between">
            <Spacings.Inline alignItems="center" scale="s">
              <WorldIcon size="big" color="primary" />
              <Text.Headline as="h2">Store Languages</Text.Headline>
            </Spacings.Inline>
            <Tooltip title="Configure store languages in settings">
              <InfoIcon size="medium" color="neutral60" />
            </Tooltip>
          </Spacings.Inline>

          <StatusMessage error={errorMessage} successMessage={successMessage} />

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-neutral-95)',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {loading ? (
              <Text.Body tone="secondary">Loading languages...</Text.Body>
            ) : languages.length > 0 ? (
              <Spacings.Stack scale="m">
                <Spacings.Inline justifyContent="space-between" alignItems="center">
                  <Text.Subheadline as="h4">
                    <span>{languages.length}</span>{' '}
                    {languages.length === 1 ? 'language' : 'languages'} configured in store
                  </Text.Subheadline>

                  {isSelectionMode && (
                    <Spacings.Inline scale="s">
                      <Text.Detail tone="secondary">
                        {selectedLanguages.length} selected 
                      </Text.Detail>
                      <SecondaryButton label="Select All" iconLeft={<CheckBoldIcon   />} size="small" onClick={handleSelectAll} />
                      <SecondaryButton label="Clear" iconLeft={<CloseIcon />} size="small" onClick={handleDeselectAll} />
                    </Spacings.Inline>
                  )}
                </Spacings.Inline>

                <Constraints.Horizontal max={8}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: selectedLanguages.includes(lang) ? 'lightgray' : 'white',
                          color: selectedLanguages.includes(lang) ? 'black' : 'black',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s, transform 0.2s',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        }}
                        onClick={() => handleToggleLanguage(lang)}
                      >
                        <Text.Body>{lang.toUpperCase()}</Text.Body>
                      </div>
                    ))}
                  </div>
                </Constraints.Horizontal>

                {isSelectionMode && selectedLanguages.length > 0 && (
                  <Spacings.Inline justifyContent="flex-end">
                    <PrimaryButton label="Save Selection" onClick={handleSaveSelection} />
                  </Spacings.Inline>
                )}
              </Spacings.Stack>
            ) : (
              <Text.Body tone="secondary">No languages configured yet.</Text.Body>
            )}
          </div>
        </Spacings.Stack>
      </Card>

      <Card theme="light" insetScale="l">
        <Spacings.Stack scale="l">
          <Spacings.Inline alignItems="center" justifyContent="space-between">
            <Spacings.Inline alignItems="center" scale="s">
              <WorldIcon size="big" color="primary" />
              <Text.Headline as="h2">Languages Selected for Translation</Text.Headline>
            </Spacings.Inline>
          </Spacings.Inline>

          <div
            style={{
              padding: '16px',
              backgroundColor: 'var(--color-neutral-95)',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            {savedLanguages.length > 0 ? (
              <Spacings.Stack scale="m">
                <Spacings.Inline justifyContent="space-between" alignItems="center">
                  <Text.Subheadline as="h4">
                    <span>{savedLanguages.length}</span>{' '}
                    {savedLanguages.length === 1 ? 'language' : 'languages'} selected for translation
                  </Text.Subheadline>
                </Spacings.Inline>

                <Constraints.Horizontal max={8}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {savedLanguages.map((lang) => (
                      <div
                        key={lang}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          backgroundColor: 'lightgray',
                          color: 'black',
                          cursor: 'default',
                          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Text.Body>{lang.toUpperCase()}</Text.Body>
                      </div>
                    ))}
                  </div>
                </Constraints.Horizontal>
              </Spacings.Stack>
            ) : (
              <Text.Body tone="secondary">No languages selected for translation yet.</Text.Body>
            )}
          </div>
        </Spacings.Stack>
      </Card>
    </Spacings.Stack>
  );
};

export default LanguagesConfigured;
