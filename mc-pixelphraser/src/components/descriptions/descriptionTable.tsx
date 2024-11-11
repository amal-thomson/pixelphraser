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
        tempDesc.value.temporaryDescription || ''
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
    { key: 'description', label: 'Description', flexGrow: 2 },
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
        return (
          <div style={{ padding: '0.5rem' }}>
            <Text.Body>{item.productName}</Text.Body>
          </div>
        );
      case 'description':
        return (
          <div
            onClick={() => setExpandedDesc(item.description)}
            style={{
              maxHeight: '4rem',
              overflowY: 'auto',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            <Text.Body>{item.description}</Text.Body>
          </div>
        );
      case 'generatedAt':
        return (
          <div style={{ padding: '0.5rem' }}>
            <Text.Body tone="secondary">{formatDate(item.generatedAt)}</Text.Body>
          </div>
        );
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
          description: desc.value.temporaryDescription,
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
