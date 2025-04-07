import Text from '@commercetools-uikit/text';
import { StatusMessageProps } from '../../interfaces/statusMessageProps';

export const StatusMessage = ({ error, successMessage }: StatusMessageProps) => (
  <>
    {successMessage && (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#e6f4ea', 
        borderRadius: '4px',
        border: '1px solid #34a853'
      }}>
        <Text.Body>{successMessage}</Text.Body>
      </div>
    )}

    {error && (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#fce8e6', 
        borderRadius: '4px',
        border: '1px solid #ea4335'
      }}>
        <Text.Body tone="critical">{error}</Text.Body>
      </div>
    )}
  </>
);
