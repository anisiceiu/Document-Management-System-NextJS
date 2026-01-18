import axios from 'axios';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/constants';
import { useLayout } from '../../providers/LayoutProvider';

export default function UploadPage({ folderId: initialFolderId }) {
  const [file, setFile] = useState(null);
  const [folderId, setFolderId] = useState('');
  const [message, setMessage] = useState('');
  const { layoutState, setBreadcrumbs, setFiles } = useLayout();

  const reloadCurrentFolder = () => {

    const currentFolder = layoutState.breadcrumbs?.slice(-1)[0]; // last breadcrumb
    if (!currentFolder?.id) return;
  
    axios.get(`${API_BASE_URL}/folders/${currentFolder.id}/contents`)
      .then(res => {
        const items = [
          ...res.data.folders.map(f => ({ ...f, itemType: 'folder' })),
          ...res.data.files.map(f => ({ ...f, itemType: 'file' }))
        ];
        setFiles(items);
      })
      .catch(err => console.log(err));
  };

  // Initialize state from prop, even if null
  useEffect(() => {
    setFolderId(initialFolderId ?? ''); // use empty string if null/undefined
  }, [initialFolderId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId); // always send, even if empty

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log(response.data);
      setMessage(`File uploaded: ${response.data.originalName}`);
      reloadCurrentFolder();
    } catch (error) {
      console.error(error);
      setMessage('Upload failed');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <input className='form-input' type="file" onChange={handleFileChange} />
      <input
        type="hidden"
        placeholder="Folder Id (optional)"
        value={folderId} // controlled input
        onChange={(e) => setFolderId(e.target.value)}
        style={{ marginLeft: 10 }}
      />
      <button className='btn btn-primary' onClick={handleUpload} style={{ marginLeft: 10 }}>
        Upload
      </button>
{/*       {message && <p>{message}</p>} */}
    </div>
  );
}
