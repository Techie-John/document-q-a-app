import React, { useState, useEffect, useRef } from 'react';
import type { DocumentWithQA, QAResponse } from '../types/index.js';
import { useDocumentContext } from '../context/DocumentContext.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import './QnASection.css';

interface QnASectionProps {
  document: DocumentWithQA;
}

const mockResponses = [
  "This is a **mock answer** with *emphasis*. The key information can be found in `section 2.1` of the document.\n\nFor a real application, this would be a detailed response from an AI system.",
  "I'm sorry, I cannot find the answer to that question in the document. You might want to try:\n\n• Rephrasing your question\n• Being more specific\n• Checking if the information exists in the document",
  "**Important finding:** The key point related to your question is mentioned on page 5, section 2.1.\n\nThe document states that `this is a crucial detail` that directly addresses your inquiry.",
  "That's an **excellent question**! Based on the document analysis:\n\n• *First point*: Important detail here\n• *Second point*: Another relevant fact\n• *Third point*: Final consideration\n\nWould you like me to elaborate on any of these points?"
];

const QnASection: React.FC<QnASectionProps> = ({ document }) => {
  const { addQAResponse } = useDocumentContext();
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<{ question?: string }>({});
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const MAX_QUESTION_LENGTH = 500;
  const MIN_QUESTION_LENGTH = 3;

  // Export functionality
  const exportQAHistory = () => {
    const exportData = {
      documentName: document.name,
      documentId: document.id,
      exportDate: new Date().toISOString(),
      totalQuestions: document.qaHistory.length,
      qaHistory: document.qaHistory.map(qa => ({
        question: qa.question,
        answer: qa.answer,
        timestamp: qa.timestamp,
        date: new Date(qa.timestamp).toLocaleDateString(),
        time: new Date(qa.timestamp).toLocaleTimeString()
      }))
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `qa-history-${document.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    toast.success('Q&A history exported successfully!');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K for search focus
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Ctrl+Enter to submit (when textarea is focused)
      if (e.ctrlKey && e.key === 'Enter' && window.document.activeElement === textareaRef.current) {
        e.preventDefault();
        handleSubmit(e as any);
        return;
      }

      // Ctrl+E for export (when document has Q&A history)
      if (e.ctrlKey && e.key === 'e' && document.qaHistory.length > 0) {
        e.preventDefault();
        exportQAHistory();
        return;
      }
    };

    window.document.addEventListener('keydown', handleKeyDown);
    return () => window.document.removeEventListener('keydown', handleKeyDown);
  }, [question, document.qaHistory.length]);

  // Filter Q&A based on search term
  const filteredQAHistory = document.qaHistory.filter((qa) => {
    if (!debouncedSearchTerm) return true;
    const searchLower = debouncedSearchTerm.toLowerCase();
    return (
      qa.question.toLowerCase().includes(searchLower) ||
      qa.answer.toLowerCase().includes(searchLower)
    );
  });

  // Form validation
  const validateQuestion = (questionText: string) => {
    const newErrors: { question?: string } = {};
    
    if (!questionText.trim()) {
      newErrors.question = 'Question cannot be empty';
    } else if (questionText.trim().length < MIN_QUESTION_LENGTH) {
      newErrors.question = `Question must be at least ${MIN_QUESTION_LENGTH} characters long`;
    } else if (questionText.length > MAX_QUESTION_LENGTH) {
      newErrors.question = `Question must be less than ${MAX_QUESTION_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuestion(value);
    
    // Clear errors when user starts typing
    if (errors.question && value.trim()) {
      setErrors({});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateQuestion(question) || isLoading) {
      return;
    }

    setIsLoading(true);
    const mockAnswer = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    setTimeout(() => {
      const newResponse: QAResponse = {
        id: uuidv4(),
        question: question.trim(),
        answer: mockAnswer,
        timestamp: new Date().toISOString(),
      };
      addQAResponse(document.id, newResponse);
      setQuestion('');
      setErrors({});
      setIsLoading(false);
    }, 1500); // Simulate a network delay
  };

  const renderMarkdown = (text: string, searchTerm?: string) => {
    // Simple markdown parsing
    let html = text
      // Bold **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code `text`
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Bullet points
      .replace(/^• (.+)/gm, '<li>$1</li>')
      // Line breaks
      .replace(/\n/g, '<br>');

    // Wrap list items in ul tags
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    // Highlight search terms if provided
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      html = html.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    return html;
  };

  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) {
      return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(text) }} />;
    }
    
    return <span dangerouslySetInnerHTML={{ __html: renderMarkdown(text, searchTerm) }} />;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="qna-section">
      <div className="qna-history">
        <div className="qna-header">
          <h2>Q&A for "{document.name}"</h2>
          <div className="qna-header-actions">
            <div className="search-container">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Q&A... (Ctrl+K)"
                className="qa-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <span className="search-results-count">
                  {filteredQAHistory.length} result{filteredQAHistory.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
            {document.qaHistory.length > 0 && (
              <button 
                onClick={exportQAHistory}
                className="export-button"
                title="Export Q&A History as JSON (Ctrl+E)"
              >
                📥 Export
              </button>
            )}
          </div>
        </div>

        <div className="qa-history-content">
          {filteredQAHistory.length > 0 ? (
            filteredQAHistory.map((qa) => (
              <div key={qa.id} className="qa-item">
                <div className="qa-header-info">
                  <span className="qa-timestamp">{formatDate(qa.timestamp)}</span>
                </div>
                <p className="qa-question">
                  <strong>Q:</strong> {highlightSearchTerm(qa.question, debouncedSearchTerm)}
                </p>
                <p className="qa-answer">
                  <strong>A:</strong> {highlightSearchTerm(qa.answer, debouncedSearchTerm)}
                </p>
              </div>
            ))
          ) : searchTerm ? (
            <p className="no-results-message">No Q&A found matching "{searchTerm}"</p>
          ) : (
            <p className="no-history-message">No questions asked yet.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="qna-form">
        <div className="textarea-container">
          <textarea
            ref={textareaRef}
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask a question about the document... (Ctrl+Enter to submit)"
            disabled={isLoading}
            className={errors.question ? 'error' : ''}
            maxLength={MAX_QUESTION_LENGTH}
          />
          {errors.question && (
            <div className="error-message">{errors.question}</div>
          )}
        </div>
        
        <div className="form-footer">
          <div className="form-footer-left">
            <span className={`char-count ${question.length > MAX_QUESTION_LENGTH * 0.8 ? 'warning' : ''}`}>
              {question.length} / {MAX_QUESTION_LENGTH}
            </span>
            <div className="keyboard-hints">
              <span className="keyboard-hint">Ctrl+Enter to submit,</span>
              {document.qaHistory.length > 0 && (
                <span className="keyboard-hint"> Ctrl+E to export</span>
              )}
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading || !question.trim() || !!errors.question}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? 'Loading...' : 'Ask'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QnASection;