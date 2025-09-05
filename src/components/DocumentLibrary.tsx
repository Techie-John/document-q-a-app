// Updated DocumentLibrary.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useDocumentContext } from '../context/DocumentContext.js';
import FileDropzone from './FileDropzone';
import DocumentItem from './DocumentItem';
import { useDebounce } from '../hooks/useDebounce.js';
import './DocumentLibrary.css';

interface DocumentLibraryProps {
  onDocumentSelect?: () => void;
}

const DocumentLibrary: React.FC<DocumentLibraryProps> = ({ onDocumentSelect }) => {
  const { documents } = useDocumentContext();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Keyboard shortcuts for document library
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+K for document search focus (to differentiate from Q&A search)
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
    };

    window.document.addEventListener('keydown', handleKeyDown);
    return () => window.document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="document-library">
      <FileDropzone />
      <div className="document-search-container">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search documents... (Ctrl+Shift+K)"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <span className="search-results-count">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
          </span>
        )}
      </div>
      <div className="document-list">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map((doc) => (
            <DocumentItem 
              key={doc.id} 
              document={doc} 
              onSelect={onDocumentSelect}
            />
          ))
        ) : searchTerm ? (
          <p className="no-documents-message">No documents found matching "{searchTerm}"</p>
        ) : (
          <p className="no-documents-message">No documents uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentLibrary;