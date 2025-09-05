import React, { useState, useRef } from 'react';
import { useDocumentContext } from '../context/DocumentContext.js';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import './FileDropzone.css';

const FileDropzone: React.FC = () => {
  const { addDocument } = useDocumentContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const isUploadingRef = useRef(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;

    if (files.length > 0 && !isUploadingRef.current) {
      const file = files[0];
      isUploadingRef.current = true;
      setUploadProgress(10);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            const newDoc = {
              id: uuidv4(),
              name: file.name,
              size: file.size,
              uploadDate: new Date().toISOString(),
            };
            addDocument(newDoc);
            setUploadProgress(0);
            isUploadingRef.current = false;
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    } else if (files.length === 0) {
      toast.error('No files were dropped.');
    }
  };

  return (
    <div
      className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <p>Drag & Drop a document here</p>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="upload-progress">
          <div
            className="progress-bar"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;