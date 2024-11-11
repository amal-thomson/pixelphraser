import React from 'react';
import { ImageModalProps } from '../../interfaces/imageModelProps';

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      cursor: 'pointer'
    }}
    onClick={onClose}
  >
    <img
      src={imageUrl}
      alt="Enlarged product"
      style={{
        maxWidth: '90%',
        maxHeight: '90vh',
        objectFit: 'contain',
        borderRadius: '8px'
      }}
    />
  </div>
);