import { useState, useEffect } from 'react';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import { TemporaryDescriptionsResponse } from '../../interfaces/temporaryDescriptionsResponse';
import { fetchTemporaryDescriptions } from '../../hooks/fetchTemporaryDescriptions';
import { Header } from './header';
import { DescriptionsTable } from './descriptionTable';
import { SearchBar } from './searchBar';
import { StatusMessage } from './statusMessage';
import { ImageModal } from './imageModal';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import Card from '@commercetools-uikit/card';
import Spacings from '@commercetools-uikit/spacings';
import { hasResults } from '../../utils/hasResults';
import { NoDescriptionsFound } from './noDescriptionFound';
import Text from '@commercetools-uikit/text';
import { Pagination } from '@commercetools-uikit/pagination';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import { useIntl } from 'react-intl';

const ITEMS_PER_PAGE = 5;

const Descriptions = () => {
  const dispatch = useAsyncDispatch();
  const showNotification = useShowNotification();
  const intl = useIntl();
  const [descriptionsData, setDescriptionsData] = useState<TemporaryDescriptionsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);

  const loadDescriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchTemporaryDescriptions(dispatch);
      setDescriptionsData(result);
    } catch (error) {
      setError(
        error instanceof Error 
          ? `Error: ${error.message}` 
          : 'An unexpected error occurred while fetching descriptions'
      );
      showNotification({
        kind: 'error',
        domain: 'side',
        text: intl.formatMessage({ 
          id: 'descriptions.fetch.error',
          defaultMessage: 'Failed to load descriptions'
        }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDescriptions();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const showSuccessMessage = (message: string) => {
    showNotification({
      kind: 'success',
      domain: 'side',
      text: message,
    });
  };

  const filteredData = descriptionsData?.results.filter(desc => 
    (desc.value.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (desc.value.temporaryDescription || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div style={{ padding: '1.5rem' }}>
      <Spacings.Stack scale="l">
        <Header onRefresh={loadDescriptions} isLoading={isLoading} />
        
        <div style={{ marginBottom: '1.5rem' }}>
          <Text.Body tone="secondary">
            PixelPhraser Appliaction enables you to review and manage AI-generated temporary product descriptions. You can search, view, accept or reject descriptions, and preview associated product images. Accepted descriptions will be applied to the products in the catalog. 
          </Text.Body>
        </div>
        
        <Card>
          <Spacings.Stack scale="m">
            <StatusMessage
              error={error} successMessage={null} />
            {!isLoading && hasResults(descriptionsData) && (
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            )}
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <LoadingSpinner />
              </div>
            ) : !hasResults(descriptionsData) ? (
              <NoDescriptionsFound />
            ) : filteredData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>
                  No matching descriptions or products found!!! Try Again
                </p>
              </div>
            ) : (
              <>
                <DescriptionsTable
                  data={paginatedData}
                  processing={processing}
                  setProcessing={setProcessing}
                  setError={setError}
                  showSuccessMessage={showSuccessMessage}
                  onImageClick={setSelectedImage}
                  loadDescriptions={loadDescriptions}
                />
                <Pagination
                  page={page}
                  onPageChange={setPage}
                  perPage={perPage}
                  onPerPageChange={setPerPage}
                  totalItems={filteredData.length}
                />
              </>
            )}
          </Spacings.Stack>
        </Card>
      </Spacings.Stack>
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default Descriptions;