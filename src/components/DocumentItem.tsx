// Updated DocumentItem.tsx
import React from 'react';
import type { DocumentWithQA } from '../types/index.js';
import { useDocumentContext } from '../context/DocumentContext.js';
import './DocumentItem.css';

interface DocumentItemProps {
  document: DocumentWithQA;
  onSelect?: () => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onSelect }) => {
  const { selectedDocumentId, selectDocument } = useDocumentContext();
  const isSelected = selectedDocumentId === document.id;

  const handleClick = () => {
    selectDocument(document.id);
    // Call the mobile callback to close the sidebar
    if (onSelect) {
      onSelect();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div 
      className={`document-item ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <h4>{document.name}</h4>
      <p className="document-meta">
        Size: {(document.size / 1024).toFixed(2)} KB
      </p>
      <p className="document-meta">
        Uploaded: {formatDate(document.uploadDate)}
      </p>
      <span className="qa-count">
        Q&A Count: {document.qaHistory.length}
      </span>
    </div>
  );
};

export default DocumentItem;