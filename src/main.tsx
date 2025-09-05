import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { DocumentProvider } from './context/DocumentContext';
import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DocumentProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </DocumentProvider>
  </React.StrictMode>
);