import { useState } from 'react';
import "./schedule.css";

export function Schedule() {
  const [files, setFiles] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
  };

  const handleGenerateSchedule = async () => {
    const formData = new FormData();
    formData.append('action', 'generate_schedule');

    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('authToken');
    console.log(token)
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message || 'Schedule generated successfully!');
      } else {
        setResponseMessage(data.error || 'Failed to generate schedule.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Generate Schedule</h1>
      <input type="file" multiple onChange={handleFileUpload} />
      <button onClick={handleGenerateSchedule} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Schedule'}
      </button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}
