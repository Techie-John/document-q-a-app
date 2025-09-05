import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { AppDocument, DocumentWithQA, QAResponse } from '../types/index.js';
import { toast } from 'react-toastify';

interface DocumentContextType {
  documents: DocumentWithQA[];
  selectedDocumentId: string | null;
  selectedDocument: DocumentWithQA | null;
  addDocument: (doc: AppDocument) => void;
  addQAResponse: (docId: string, qa: QAResponse) => void;
  selectDocument: (docId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'document_qa_app_state';

export const DocumentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentWithQA[]>(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : [];
  });

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Track toast notifications to prevent duplicates
  const toastShownRef = useRef(new Set<string>());

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(documents));
  }, [documents]);

  // Auto-select first document if none selected and documents exist
  useEffect(() => {
    if (!selectedDocumentId && documents.length > 0) {
      setSelectedDocumentId(documents[0].id);
    }
    // If selected document no longer exists, clear selection
    if (selectedDocumentId && !documents.find(doc => doc.id === selectedDocumentId)) {
      setSelectedDocumentId(documents.length > 0 ? documents[0].id : null);
    }
  }, [documents, selectedDocumentId]);

  const selectedDocument = selectedDocumentId 
    ? documents.find(doc => doc.id === selectedDocumentId) || null
    : null;

  const addDocument = (doc: AppDocument) => {
    setDocuments((prevDocs) => {
      // Check if document already exists (prevent duplicates)
      const exists = prevDocs.some(existingDoc => 
        existingDoc.id === doc.id || 
        (existingDoc.name === doc.name && existingDoc.size === doc.size)
      );
      
      if (exists) {
        return prevDocs; // Don't add duplicate
      }

      const newDoc: DocumentWithQA = {
        ...doc,
        qaHistory: [],
      };

      // Only show toast if we haven't already shown it for this document
      const toastKey = `${doc.name}-${doc.size}-${doc.uploadDate}`;
      if (!toastShownRef.current.has(toastKey)) {
        toast.success('Document uploaded successfully!');
        toastShownRef.current.add(toastKey);
        
        // Clean up old toast keys to prevent memory leaks
        setTimeout(() => {
          toastShownRef.current.delete(toastKey);
        }, 5000);
      }

      const updatedDocs = [...prevDocs, newDoc];
      
      // Auto-select the newly added document
      setSelectedDocumentId(newDoc.id);
      
      return updatedDocs;
    });
  };

  const addQAResponse = (docId: string, qa: QAResponse) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === docId
          ? { ...doc, qaHistory: [...doc.qaHistory, qa] }
          : doc
      )
    );
  };

  const selectDocument = (docId: string) => {
    setSelectedDocumentId(docId);
  };

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      selectedDocumentId, 
      selectedDocument,
      addDocument, 
      addQAResponse, 
      selectDocument 
    }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocumentContext = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocumentContext must be used within a DocumentProvider');
  }
  return context;
};