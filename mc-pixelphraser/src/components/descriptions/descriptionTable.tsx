// import { useState } from 'react';
// import { SecondaryButton, PrimaryButton } from '@commercetools-uikit/buttons';
// import DataTable from '@commercetools-uikit/data-table';
// import Text from '@commercetools-uikit/text';
// import Spacings from '@commercetools-uikit/spacings';
// import { TemporaryDescription } from '../../interfaces/temporaryDescription';
// import { formatDate } from '../../utils/formatDate';
// import { updateProductDescription } from '../../hooks/updateProductDescription';
// import { deleteTemporaryDescription } from '../../hooks/deleteTemporaryDescriptions';
// import { useAsyncDispatch } from '@commercetools-frontend/sdk';
// import { DescriptionsTableProps } from '../../interfaces/descriptionsTableProps';
// import { DescriptionModal } from './descriptionModal';

// export const DescriptionsTable = ({
//   data,
//   processing,
//   setProcessing,
//   setError,
//   showSuccessMessage,
//   onImageClick,
//   loadDescriptions
// }: DescriptionsTableProps) => {
//   const dispatch = useAsyncDispatch();
//   const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

//   const handleAccept = async (tempDesc: TemporaryDescription) => {
//     setProcessing(tempDesc.id);
//     try {
//       await updateProductDescription(
//         dispatch,
//         tempDesc.key,
//         tempDesc.value["en-US"] || '',
//         tempDesc.value["en-GB"] || '',
//         tempDesc.value["de-DE"] || ''
//       );
//       await deleteTemporaryDescription(dispatch, tempDesc.id, tempDesc.version);
//       await loadDescriptions();
//       showSuccessMessage('Description accepted and updated successfully');
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? `Error accepting description: ${error.message}`
//           : 'An unexpected error occurred while accepting the description'
//       );
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const handleReject = async (tempDesc: TemporaryDescription) => {
//     setProcessing(tempDesc.id);
//     try {
//       await deleteTemporaryDescription(dispatch, tempDesc.id, tempDesc.version);
//       await loadDescriptions();
//       showSuccessMessage('Description rejected and removed successfully');
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? `Error rejecting description: ${error.message}`
//           : 'An unexpected error occurred while rejecting the description'
//       );
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const columns = [
//     { key: 'imageUrl', label: 'Image', flexGrow: 1 },
//     { key: 'productName', label: 'Product Name', flexGrow: 2 },
//     { key: 'descriptions', label: 'Descriptions', flexGrow: 3 },
//     // { key: 'generatedAt', label: 'Generated At', flexGrow: 1 },
//     { key: 'actions', label: 'Actions', flexGrow: 1 }
//   ];

//   const getShortDescription = (text: string | null | undefined): string => {
//     if (!text) return 'N/A';
//     const cleanText = text.replace(/[*_~`#]/g, '');
//     const firstLine = cleanText.split('\n')[0];
//     return firstLine.length > 50 ? `${firstLine.substring(0, 50)}...` : firstLine;
// };
  
//   const itemRenderer = (item: any, column: any) => {
//     switch (column.key) {
//       case 'imageUrl':
//         return (
//           <img
//             src={item.imageUrl}
//             alt="Product"
//             style={{
//               width: '50px',
//               height: '50px',
//               objectFit: 'contain',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//             onClick={() => onImageClick(item.imageUrl)}
//           />
//         );
//       case 'productName':
//         return <Text.Body>{item.productName}</Text.Body>;
//       case 'descriptions':
//         return (
//           <div
//             onClick={() => {
//               const desc = {
//                 US: item["en-US"] || 'N/A',
//                 GB: item["en-GB"] || 'N/A',
//                 DE: item["de-DE"] || 'N/A'
//             };            
//               setExpandedDesc(JSON.stringify(desc));
//             }}
//             style={{
//               padding: '0.5rem',
//               borderRadius: '4px',
//               cursor: 'pointer',
//               border: '1px dashed #ccc',
//               background: '#f8f8f8'
//             }}
//           >
//             <Text.Body>
//             <strong>US:</strong> {getShortDescription(item["en-US"])} <br />
//             <strong>GB:</strong> {getShortDescription(item["en-GB"])} <br />
//             <strong>DE:</strong> {getShortDescription(item["de-DE"])}
//               <div style={{ marginTop: '0.5rem', color: '#0066cc', fontSize: '0.8rem' }}>
//                 Click to view full descriptions
//               </div>
//             </Text.Body>
//           </div>
//         );
//       case 'generatedAt':
//         return <Text.Body tone="secondary">{formatDate(item.generatedAt)}</Text.Body>;
//       case 'actions':
//         return (
//           <Spacings.Inline scale="s">
//             <PrimaryButton
//               label="Accept"
//               onClick={() => handleAccept(data.find(d => d.id === item.id)!)}
//               isDisabled={processing === item.id}
//             />
//             <SecondaryButton
//               label="Reject"
//               onClick={() => handleReject(data.find(d => d.id === item.id)!)}
//               isDisabled={processing === item.id}
//             />
//           </Spacings.Inline>
//         );
//       default:
//         return item[column.key];
//     }
//   };

//   return (
//     <>
//       <DataTable
//         columns={columns}
//         rows={data.map(desc => ({
//           imageUrl: desc.value.imageUrl,
//           productName: desc.value.productName,
//           descriptions: 'descriptions',
//           ["en-US"]: desc.value["en-US"],
//           ["en-GB"]: desc.value["en-GB"],
//           ["de-DE"]: desc.value["de-DE"],
//           // generatedAt: desc.value.generatedAt,
//           actions: 'actions',
//           id: desc.id
//         }))} 
//         itemRenderer={itemRenderer}
//       />
//       {expandedDesc && (
//         <DescriptionModal
//           description={expandedDesc}
//           onClose={() => setExpandedDesc(null)}
//         />
//       )}
//     </>
//   );
// };

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
import { fetchSelectedLanguages } from '../../hooks/fetchSelectedLanguages';

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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Load selected languages dynamically
  useState(() => {
    fetchSelectedLanguages(dispatch)
      .then((response) => {
        if (response?.value && Array.isArray(response.value)) {
          setSelectedLanguages(response.value);
        }
      })
      .catch((error) => console.error('Error fetching selected languages:', error));
  });

  const handleAccept = async (tempDesc: TemporaryDescription) => {
    setProcessing(tempDesc.id);
    try {
      // Dynamically update descriptions based on selected languages
      const updatedValues = selectedLanguages.reduce((acc, lang) => {
        acc[lang] = tempDesc.value[lang] || '';
        return acc;
      }, {} as Record<string, string>);

      // await updateProductDescription(dispatch, tempDesc.key, updatedValues);
      await deleteTemporaryDescription(dispatch, tempDesc.id, tempDesc.version);
      await loadDescriptions();
      showSuccessMessage('Description accepted and updated successfully');
    } catch (error) {
      setError(error instanceof Error ? `Error accepting description: ${error.message}` : 'An unexpected error occurred.');
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
      setError(error instanceof Error ? `Error rejecting description: ${error.message}` : 'An unexpected error occurred.');
    } finally {
      setProcessing(null);
    }
  };

  const columns = [
    { key: 'imageUrl', label: 'Image', flexGrow: 1 },
    { key: 'productName', label: 'Product Name', flexGrow: 2 },
    { key: 'descriptions', label: 'Descriptions', flexGrow: 3 },
    { key: 'actions', label: 'Actions', flexGrow: 1 }
  ];

  const getShortDescription = (text: string | null | undefined): string => {
    if (!text) return 'N/A';
    const cleanText = text.replace(/[*_~`#]/g, '');
    const firstLine = cleanText.split('\n')[0];
    return firstLine.length > 50 ? `${firstLine.substring(0, 50)}...` : firstLine;
  };

  const itemRenderer = (item: any, column: any) => {
    switch (column.key) {
      case 'imageUrl':
        return (
          <img
            src={item.imageUrl}
            alt="Product"
            style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px', cursor: 'pointer' }}
            onClick={() => onImageClick(item.imageUrl)}
          />
        );
      case 'productName':
        return <Text.Body>{item.productName}</Text.Body>;
      case 'descriptions':
        return (
          <div
            onClick={() => {
              const desc = selectedLanguages.reduce((acc, lang) => {
                acc[lang] = item[lang] || 'N/A';
                return acc;
              }, {} as Record<string, string>);

              setExpandedDesc(JSON.stringify(desc));
            }}
            style={{ padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', border: '1px dashed #ccc', background: '#f8f8f8' }}
          >
            <Text.Body>
              {selectedLanguages.map((lang) => (
                <div key={lang}>
                  <strong>{lang}:</strong> {getShortDescription(item[lang])}
                </div>
              ))}
              <div style={{ marginTop: '0.5rem', color: '#0066cc', fontSize: '0.8rem' }}>Click to view full descriptions</div>
            </Text.Body>
          </div>
        );
      case 'actions':
        return (
          <Spacings.Inline scale="s">
            <PrimaryButton
              label="Accept"
              onClick={() => handleAccept(data.find((d) => d.id === item.id)!)}
              isDisabled={processing === item.id}
            />
            <SecondaryButton
              label="Reject"
              onClick={() => handleReject(data.find((d) => d.id === item.id)!)}
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
        rows={data.map((desc) => ({
          imageUrl: desc.value.imageUrl,
          productName: desc.value.productName,
          descriptions: 'descriptions',
          ...selectedLanguages.reduce((acc, lang) => {
            acc[lang] = desc.value[lang] ?? '';
            return acc;
          }, {} as Record<string, string>),
          actions: 'actions',
          id: desc.id
        }))}
        itemRenderer={itemRenderer}
      />
      {expandedDesc && <DescriptionModal
        description={expandedDesc}
        selectedLanguages={selectedLanguages}
        onClose={() => setExpandedDesc(null)}
      />
      }
    </>
  );
};
