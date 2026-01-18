// utils/download.js
import axios from 'axios';

export const downloadFile = async (url, filename) => {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'blob', // Important for file downloads
    });

    // Create a blob from the response
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/octet-stream' 
    });
    
    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};