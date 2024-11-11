import React from 'react';
import { DescriptionModalProps } from '../../interfaces/descriptionModalProps';

export const DescriptionModal: React.FC<DescriptionModalProps> = ({ description, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent background for the modal overlay
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      cursor: 'pointer' // Pointer cursor when hovering over the overlay
    }}
    onClick={onClose}  // Close the modal when clicking outside of it
  >
    <div
      style={{
        backgroundColor: '#fff',  // White background for the modal content
        padding: '1.5rem',
        borderRadius: '8px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        cursor: 'default'  // Default cursor inside the modal
      }}
      onClick={(e) => e.stopPropagation()}  // Prevent click events inside the modal from propagating
    >
      <h3 style={{ margin: 0, marginBottom: '1rem' }}>Full Description</h3>
      <p style={{ lineHeight: '1.6', fontSize: '16px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        {description}
      </p>
    </div>
  </div>
);
