import React, { useState } from 'react';
import { DescriptionModalProps } from '../../interfaces/descriptionModalProps';

export const DescriptionModal: React.FC<DescriptionModalProps> = ({ description, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<'US' | 'GB' | 'DE'>('US');
  
  // Parse the description object from JSON string
  const descriptionObj = JSON.parse(description);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        cursor: 'pointer'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          width: '80%',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: '1rem', textAlign: 'center', fontWeight: 'bold' }}>
          Full Description
        </h3>   
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          {['US', 'GB', 'DE'].map((locale) => (
            <button
              key={locale}
              onClick={() => setSelectedTab(locale as 'US' | 'GB' | 'DE')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderBottom: selectedTab === locale ? '3px solid #007ACC' : 'none',
                background: 'transparent',
                fontSize: '16px',
                cursor: 'pointer',
                color: selectedTab === locale ? '#007ACC' : '#555',
                marginRight: '1rem'
              }}
            >
              {locale}
            </button>
          ))}
        </div>
        <div style={{
          lineHeight: '1.6',
          fontSize: '16px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          padding: '1rem',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '1px solid #ddd',
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          {descriptionObj[selectedTab]}
        </div>
      </div>
    </div>
  );
};