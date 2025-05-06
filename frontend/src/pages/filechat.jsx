import React, { useState } from "react";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import { AiOutlineSend } from "react-icons/ai";
import "./filechat.css";
import GeminiFormattedResponse from "../utils/GeminiFormatter";

/**
 * Component to display a file card in the files grid
 */
const FileCard = ({ file, onClick, isSelected }) => (
  <div className={`file-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
    <div className="file-header">
      <p className="file-title">{file.name}</p>
      <span className="file-icon-wrapper">
        <img 
          src={getFileIcon(file.type)} 
          className="file-icon"
          alt={`${getFileTypeLabel(file.type)} icon`}
        />
      </span>
    </div>
    <p className="file-type">{getFileTypeLabel(file.type)}</p>
  </div>
);

/**
 * Component to display a preview of the selected file
 */
const FilePreview = ({ file }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  if (!file) return null;

  const renderPreview = () => {
    switch (getFileCategory(file.type)) {
      case 'pdf':
        return (
          <div className="pdf-container">
            <iframe
              src={`${file.url}#toolbar=0`}
              title="PDF Preview"
              className="pdf-viewer"
              onError={() => setError('Failed to load PDF file')}
              onLoad={() => setLoading(false)}
            />
            {error && (
              <div className="error-container">
                <p className="error-message">{error}</p>
                <a href={file.url} download className="download-link">
                  Download PDF instead
                </a>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="text-preview">
            <pre className="text-content">{file.content || "No text content available"}</pre>
          </div>
        );

      case 'image':
        return (
          <div className="image-container">
            <img 
              src={file.url} 
              alt={file.name}
              className="image-preview"
              onError={() => setError('Failed to load image')}
              onLoad={() => setLoading(false)}
            />
          </div>
        );

      default:
        return (
          <div className="unsupported-file">
            <p className="unsupported-message">Preview not available for this file type</p>
            <a href={file.url} 
               target="_blank" 
               rel="noopener noreferrer" 
               className="download-link"
            >
              Download file
            </a>
          </div>
        );
    }
  };

  return (
    <div className="preview-section">
      <div className="preview-header">
        <div className="preview-title">
          <h3>File Preview: {file.name}</h3>
          <span className="file-type-badge">{getFileTypeLabel(file.type)}</span>
        </div>
      </div>
      <div className="file-preview-container">
        {loading && <div className="preview-loader">Loading preview...</div>}
        {renderPreview()}
      </div>
    </div>
  );
};

// Utility functions
const getFileCategory = (type) => {
  if (type === 'application/pdf') return 'pdf';
  if (type.startsWith('image/')) return 'image';
  if (type === 'text/plain' || type.includes('text')) return 'text';
  return 'other';
};

const getFileTypeLabel = (type) => {
  const typeMap = {
    'application/pdf': 'PDF Document',
    'text/plain': 'Text File',
    'text/markdown': 'Markdown',
    'image/png': 'PNG Image',
    'image/jpeg': 'JPEG Image'
  };
  return typeMap[type] || type;
};

const getFileIcon = (type) => {
  const category = getFileCategory(type);
  const iconMap = {
    pdf: '/icons/pdf-icon.svg',
    image: '/icons/image-icon.svg',
    text: '/icons/text-icon.svg',
    other: '/icons/file-icon.svg'
  };
  return iconMap[category] || '/session-icon.svg';
};

/**
 * Check if text is likely a Gemini API response needing formatting
 */
const isGeminiResponse = (text) => {
  if (!text) return false;
  
  // Check for patterns common in Gemini responses that need formatting
  const geminiPatterns = [
    /\*\*.*?\*\*/,                      // Bold text markers
    /^\s*\*\*[^*]+\*\*\s*:/m,           // Section headers
    /^\s*".*?"\s*$/m,                   // Quoted text
    /^\s*\*\s+/m,                       // Bullet points
    /^\s*\d+\.\s+/m                     // Numbered lists
  ];
  
  return geminiPatterns.some(pattern => pattern.test(text));
};

const FileChat = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFileDetails, setShowFileDetails] = useState(false);
  const [conversations, setConversations] = useState({});

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://127.0.0.1:8080/api/files/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      
      // Create a URL for local preview while keeping the server URL for API calls
      const previewUrl = URL.createObjectURL(file);
      
      const newFile = {
        id: data.id || Date.now(),
        name: file.name,
        type: file.type,
        url: previewUrl, // Use local URL for preview
        serverUrl: data.url, // Keep server URL for API calls
        content: data.content
      };

      setFiles(prev => [...prev, newFile]);
      setSelectedFile(newFile); // Set the selected file
      setShowFileDetails(false); // Don't show details yet until clicked
      setMessages([]); // Clear any previous messages
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const handleCardClick = async (file) => {
    setSelectedFile(file);
    setShowFileDetails(true);
    setIsLoading(true);

    try {
      // Check if we already have a conversation for this file
      if (conversations[file.id]) {
        setMessages(conversations[file.id].messages);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/chat/file-context/init/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file_id: file.id })
      });

      const data = await response.json();
      if (response.ok) {
        const initialMessages = [{ text: data.initial_response, sender: "ai", isGemini: isGeminiResponse(data.initial_response) }];
        setMessages(initialMessages);
        setConversations(prev => ({
          ...prev,
          [file.id]: {
            conversationId: data.conversation_id,
            messages: initialMessages
          }
        }));
      }
    } catch (error) {
      console.error('Error initializing file chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedFile) return;

    const userMessage = { text: currentMessage, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const conversation = conversations[selectedFile.id];
      
      // Make sure we have a conversation ID
      if (!conversation || !conversation.conversationId) {
        throw new Error("No active conversation for this file");
      }

      // Log the request details for debugging
      console.log("Sending message to:", 'http://localhost:8080/api/chat/file-context/init/');
      console.log("Request payload:", {
        conversation_id: conversation.conversationId,
        message: currentMessage
      });

      const response = await fetch('http://localhost:8080/api/chat/file-context/init/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: conversation.conversationId,
          message: currentMessage
        })
      });

      // Check for non-404 errors first
      if (response.status === 404) {
        throw new Error("API endpoint not found. Please check server configuration.");
      }
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Check if the response has Gemini API characteristics
      const isGeminiText = isGeminiResponse(data.response);
      
      const newMessages = [...updatedMessages, { 
        text: data.response, 
        sender: "ai",
        isGemini: isGeminiText
      }];
      
      setMessages(newMessages);
      setConversations(prev => ({
        ...prev,
        [selectedFile.id]: {
          ...prev[selectedFile.id],
          messages: newMessages
        }
      }));
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        text: `Sorry, I couldn't process your request: ${error.message}`, 
        sender: "ai" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the message based on whether it's a Gemini API response or not
  const renderMessage = (msg) => {
    if (msg.sender === "user") {
      return <div className="message-text">{msg.text}</div>;
    }
    
    // For AI responses, check if it needs Gemini formatting
    return msg.isGemini ? 
      <GeminiFormattedResponse rawText={msg.text} /> : 
      <div className="message-text">{msg.text}</div>;
  };

  return (
    <div className="MainContainer">
      <Header />
      <div className="nav-body">
        <Sidebar />
        <div className="main-content-wrapper">
          <div className="upload-section">
            <button 
              className="upload-btn"
              onClick={() => document.getElementById('file-upload').click()}
            >
              Upload File
            </button>
            <input
              type="file"
              id="file-upload"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
            />
          </div>

          <div className="content-area">
            {/* Files Section */}
            <div className="files-section">
              <h2>Your Files</h2>
              <div className="files-grid">
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onClick={() => handleCardClick(file)}
                    isSelected={selectedFile?.id === file.id && showFileDetails}
                  />
                ))}
                {files.length === 0 && (
                  <p className="no-files-message">No files uploaded yet. Click the "Upload File" button to get started.</p>
                )}
              </div>
            </div>

            {/* Chat and Preview Section - Only shown when a file is selected AND showFileDetails is true */}
            {selectedFile && showFileDetails && (
              <div className="interaction-section">
                <div className="preview-pane">
                  <FilePreview file={selectedFile} />
                </div>
                <div className="chat-pane">
                  <div className="chat-section">
                    <h3>Chat with AI about this file</h3>
                    <div className="messages-container">
                      {messages.map((msg, index) => (
                        <div 
                          key={index}
                          className={`message ${msg.sender}-message`}
                        >
                          {renderMessage(msg)}
                        </div>
                      ))}
                      {messages.length === 0 && (
                        <p className="no-messages">Ask a question about this file to start a conversation.</p>
                      )}
                    </div>
                    <div className="chat-input">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Ask about this file..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isLoading}
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={isLoading}
                        className="send-button"
                      >
                        <AiOutlineSend />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileChat;