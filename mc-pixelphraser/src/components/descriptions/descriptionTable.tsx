import { useState } from 'react';
import { SecondaryButton, PrimaryButton } from '@commercetools-uikit/buttons';
import DataTable from '@commercetools-uikit/data-table';
import Text from '@commercetools-uikit/text';
import Spacings from '@commercetools-uikit/spacings';
import { TemporaryDescription } from '../../interfaces/temporaryDescription';
import { formatDate } from '../../utils/formatDate';
import { updateProductDescription } from '../../hooks/updateProductDescription';
import { deleteTemporaryDescription } from '../../hooks/deleteTemporaryDescriptions';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import { DescriptionsTableProps } from '../../interfaces/descriptionsTableProps';
import { DescriptionModal } from './descriptionModal';

export const DescriptionsTable = ({
  data,
  processing,
  setProcessing,
  setError,
  showSuccessMessage,
  onImageClick,
  loadDescriptions
}: DescriptionsTableProps) => {
  const dispatch = useAsyncDispatch();
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  const handleAccept = async (tempDesc: TemporaryDescription) => {
    setProcessing(tempDesc.id);
    try {
      await updateProductDescription(
        dispatch,
        tempDesc.key,
        tempDesc.value.usDescription || '',
        tempDesc.value.gbDescription || '',
        tempDesc.value.deDescription || ''
      );
      await deleteTemporaryDescription(dispatch, tempDesc.id, tempDesc.version);
      await loadDescriptions();
      showSuccessMessage('Description accepted and updated successfully');
    } catch (error) {
      setError(
        error instanceof Error
          ? `Error accepting description: ${error.message}`
          : 'An unexpected error occurred while accepting the description'
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (tempDesc: TemporaryDescription) => {
    setProcessing(tempDesc.id);
    try {
      await deleteTemporaryDescription(dispatch, tempDesc.id, tempDesc.version);
      await loadDescriptions();
      showSuccessMessage('Description rejected and removed successfully');
    } catch (error) {
      setError(
        error instanceof Error
          ? `Error rejecting description: ${error.message}`
          : 'An unexpected error occurred while rejecting the description'
      );
    } finally {
      setProcessing(null);
    }
  };

  const columns = [
    { key: 'imageUrl', label: 'Image', flexGrow: 1 },
    { key: 'productName', label: 'Product Name', flexGrow: 2 },
    { key: 'descriptions', label: 'Descriptions', flexGrow: 3 },
    { key: 'generatedAt', label: 'Generated At', flexGrow: 1 },
    { key: 'actions', label: 'Actions', flexGrow: 1 }
  ];
  
  const itemRenderer = (item: any, column: any) => {
    switch (column.key) {
      case 'imageUrl':
        return (
          <img
            src={item.imageUrl}
            alt="Product"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
            onClick={() => onImageClick(item.imageUrl)}
          />
        );
      case 'productName':
        return <Text.Body>{item.productName}</Text.Body>;
      case 'descriptions':
        return (
          <div
            onClick={() => setExpandedDesc(
              `US: ${item.usDescription || 'N/A'}\nGB: ${item.gbDescription || 'N/A'}\nDE: ${item.deDescription || 'N/A'}`
            )}
            style={{
              maxHeight: '4rem',
              overflowY: 'auto',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              whiteSpace: 'pre-wrap'
            }}
          >
            <Text.Body>
              <strong>US:</strong> {item.usDescription || 'N/A'} <br />
              <strong>GB:</strong> {item.gbDescription || 'N/A'} <br />
              <strong>DE:</strong> {item.deDescription || 'N/A'}
            </Text.Body>
          </div>
        );
      case 'generatedAt':
        return <Text.Body tone="secondary">{formatDate(item.generatedAt)}</Text.Body>;
      case 'actions':
        return (
          <Spacings.Inline scale="s">
            <PrimaryButton
              label="Accept"
              onClick={() => handleAccept(data.find(d => d.id === item.id)!)}
              isDisabled={processing === item.id}
            />
            <SecondaryButton
              label="Reject"
              onClick={() => handleReject(data.find(d => d.id === item.id)!)}
              isDisabled={processing === item.id}
            />
          </Spacings.Inline>
        );
      default:
        return item[column.key];
    }
  };
  
  return (
    <>
      <DataTable
        columns={columns}
        rows={data.map(desc => ({
          imageUrl: desc.value.imageUrl,
          productName: desc.value.productName,
          descriptions: 'descriptions',
          usDescription: desc.value.usDescription,
          gbDescription: desc.value.gbDescription,
          deDescription: desc.value.deDescription,
          generatedAt: desc.value.generatedAt,
          actions: 'actions',
          id: desc.id
        }))} 
        itemRenderer={itemRenderer}
      />
      {expandedDesc && (
        <DescriptionModal
          description={expandedDesc}
          onClose={() => setExpandedDesc(null)}
        />
      )}
    </>
  );
  
};
