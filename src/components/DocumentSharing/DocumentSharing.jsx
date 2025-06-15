import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import '../../styles/dashboard.css';

export const DocumentSharing = ({ roomId, onDocumentShared, addDocument }) => {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => 
      ['application/pdf', 'image/png', 'image/jpeg', 'text/plain'].includes(file.type)
    );
    
    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const document = {
            fileName: file.name,
            fileType: file.type,
            fileData: e.target.result,
            sender: { id: user.id, name: user.name }
          };
          // Add to chat messages
          addDocument(document);
          // Notify parent for notifications
          if (onDocumentShared) {
            onDocumentShared(document);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  return (
    <div 
      className={`document-sharing ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="upload-area">
        <input 
          type="file" 
          id="file-upload" 
          multiple 
          onChange={handleFileInput}
          accept=".pdf,.png,.jpg,.jpeg,.txt"
        />
        <label htmlFor="file-upload">
          {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </label>
      </div>
      
      <div className="file-previews">
        {files.map((file, index) => (
          <div key={index} className="file-preview">
            <div className="file-info">
              <span>{file.name}</span>
              <span>{Math.round(file.size / 1024)} KB</span>
            </div>
            <button onClick={() => removeFile(index)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};
