import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from '../components/common';
import '../styles/dashboard.css';

const DocumentsPage = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      // Mock document data
      const mockDocuments = [
        {
          roomId: 'classroom-1',
          messageId: 'msg1',
          type: 'document',
          fileName: 'Algebra_Notes.pdf',
          fileUrl: '#', // Placeholder URL; in a real app, this would link to the actual file
          senderName: 'Alice',
          timestamp: new Date('2025-06-10T10:00:00').getTime()
        },
        {
          roomId: 'classroom-1',
          messageId: 'msg2',
          type: 'document',
          fileName: 'Calculus_Problems.docx',
          fileUrl: '#',
          senderName: 'Bob',
          timestamp: new Date('2025-06-11T14:30:00').getTime()
        },
        {
          roomId: 'classroom-2',
          messageId: 'msg3',
          type: 'document',
          fileName: 'Quantum_Mechanics_Slides.pptx',
          fileUrl: '#',
          senderName: 'Charlie',
          timestamp: new Date('2025-06-12T09:15:00').getTime()
        },
        {
          roomId: 'classroom-3',
          messageId: 'msg4',
          type: 'document',
          fileName: 'WWII_Timeline.pdf',
          fileUrl: '#',
          senderName: 'David',
          timestamp: new Date('2025-06-13T11:00:00').getTime()
        }
      ];

      setDocuments(mockDocuments);
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Shared Documents</h1>
        </div>
        {documents.length > 0 ? (
          <div className="file-previews">
            {documents.map(doc => (
              <div key={`${doc.roomId}-${doc.messageId}`} className="file-preview">
                <div className="file-info">
                  <span>{doc.fileName}</span>
                  <span className="card-meta">Room: {doc.roomId}</span>
                  <span className="card-meta">Shared by: {doc.senderName}</span>
                  <span className="card-meta">At: {new Date(doc.timestamp).toLocaleString()}</span>
                </div>
                <a href={doc.fileUrl} download={doc.fileName} className="download-btn">
                  Download
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No documents have been shared yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;