// Updated App.tsx with mobile menu state management
import React, { useState, useEffect } from 'react';
import { DocumentProvider, useDocumentContext } from './context/DocumentContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import DocumentLibrary from './components/DocumentLibrary';
import QnASection from './components/QnASection';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const AppContent: React.FC = () => {
  const { selectedDocument } = useDocumentContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when document is selected
  useEffect(() => {
    if (selectedDocument && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [selectedDocument, isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="app">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
      />
      <div className="app-content">
        {/* Mobile overlay */}
        <div 
          className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        />
        
        <ErrorBoundary>
          <div 
            className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <DocumentLibrary onDocumentSelect={closeMobileMenu} />
          </div>
        </ErrorBoundary>
        
        <ErrorBoundary>
          <div className="main-content">
            {selectedDocument ? (
              <QnASection document={selectedDocument} />
            ) : (
              <div className="no-selection">
                <h2>No Document Selected</h2>
                <p>Please select a document from the library to start asking questions.</p>
                <div className="keyboard-shortcuts-hint">
                  <h3>Keyboard Shortcuts:</h3>
                  <ul>
                    <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - Search Q&A</li>
                    <li><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> - Search Documents</li>
                    <li><kbd>Ctrl</kbd> + <kbd>Enter</kbd> - Submit Question</li>
                    <li><kbd>Ctrl</kbd> + <kbd>E</kbd> - Export Q&A History</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DocumentProvider>
          <AppContent />
        </DocumentProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;