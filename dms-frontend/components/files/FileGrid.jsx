'use client';

import { FaFolder, FaFileAlt, FaFilePdf, FaFileImage } from 'react-icons/fa';
import React, { useState, useRef } from "react";
import IconMenu from '../context-menu/iconMenu';
import axios from 'axios';
import { useLayout } from '../../providers/LayoutProvider';
import { API_BASE_URL } from '../../utils/constants';
import { downloadFile } from '../../utils/download';
import UploadPage from '../../components/files/upload';

export default function FileGrid() {
  const menuRef = useRef(null);
  const { layoutState, setBreadcrumbs, setFiles } = useLayout();
  const files = Array.isArray(layoutState.files) ? layoutState.files : [];

  const [menu, setMenu] = useState({ show: false, x: 0, y: 0, fileId: null });
  const [editingFileId, setEditingFileId] = useState(null);
  const [editingValue, setEditingValue] = useState('');


  const currentFolder = layoutState.breadcrumbs?.slice(-1)[0]; // last breadcrumb

  // ----------------------
  // Context menu handlers
  // ----------------------
  const handleContextMenu = (e, file) => {
    e.preventDefault();
    setMenu({ show: true, x: e.pageX, y: e.pageY, fileId: file.id });
  };

  const onClickKebabMenu = (e, file) => {
    e.stopPropagation();
    setMenu({ show: true, x: e.pageX, y: e.pageY, fileId: file.id });
  };

  const handleClickOutside = () => setMenu((m) => ({ ...m, show: false }));

  // ----------------------
  // Folder navigation
  // ----------------------
  const onFileClick = (file) => {
    if (file.type === 'folder') {
      axios.get(`${API_BASE_URL}/folders/${file.id}/contents`)
        .then(res => {
          const items = [
            ...res.data.folders.map(f => ({ ...f, itemType: 'folder' })),
            ...res.data.files.map(f => ({ ...f, itemType: 'file' }))
          ];
          setFiles(items);
        })
        .catch(console.log);

      axios.get(`${API_BASE_URL}/folders/${file.id}/breadcrumb`)
        .then(res => setBreadcrumbs(res.data));
    }
  };


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

  // ----------------------
  // Inline rename
  // ----------------------
  const startRename = (file) => {
    setEditingFileId(file.id);
    setEditingValue(file.name || file.originalName);
    setMenu((m) => ({ ...m, show: false }));
  };

  const saveRename = (fileId) => {
    if (!editingValue.trim()) return;

    setFiles(prevFiles =>
      (Array.isArray(prevFiles) ? prevFiles : []).map(f =>
        f.id === fileId ? { ...f, name: editingValue } : f
      )
    );

    setEditingFileId(null);
    setEditingValue('');

    // Optional: call API to persist rename
    let file = files.find(f=> f.id==fileId);
    if (file.type != 'folder') {
      axios.put(`${API_BASE_URL}/files/${fileId}/rename?newName=${encodeURIComponent(editingValue)}`)
        .then(res => {
          console.log("Renamed successfully")
          reloadCurrentFolder();
        })
        .catch(err => console.error(err.response?.data || err));
    }
    else {
      axios.put(`${API_BASE_URL}/folders/${fileId}/rename?newName=${encodeURIComponent(editingValue)}`)
        .then(res => {
          reloadCurrentFolder();
          console.log("Renamed successfully")
        })
        .catch(err => console.error(err.response?.data || err));
    }

    

  };

  const cancelRename = () => {
    setEditingFileId(null);
    setEditingValue('');
  };

  // ----------------------
  // Download
  // ----------------------
  const onDownloadClick = async (file) => {
    try {
      await downloadFile(`${API_BASE_URL}/${file.id}/download`, file.originalName);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  // ----------------------
  // Context menu outside click
  // ----------------------
  React.useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu((m) => ({ ...m, show: false }));
      }
    };
    if (menu.show) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menu.show]);

  // ----------------------
  // Render
  // ----------------------
  return (
    <>
    <UploadPage folderId={currentFolder?.id}/>
     <div className="row g-3" onClick={handleClickOutside}>
      {files.map(f => (
        <div key={f.id || f.originalName} className="col-md-3">
          <div
            onClick={() => onFileClick(f)}
            onContextMenu={(e) => handleContextMenu(e, f)}
            className="border rounded p-3 text-center file-card"
          >
            <div className="kebab-menu" onClick={(e) => onClickKebabMenu(e, f)}></div>

            {/* Icons */}
            {f.type === 'folder' && <FaFolder size={50} className="text-primary mb-2" />}
            {f.type === 'file' && <FaFileAlt size={50} className="text-primary mb-2" />}
            {f.ext === 'pdf' && <FaFilePdf size={50} className="text-danger mb-2" />}
            {f.ext === 'image' && <FaFileImage size={50} className="text-success mb-2" />}

            {/* Inline rename */}
            {editingFileId === f.id ? (
              <input
                type="text"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onBlur={() => saveRename(f.id)}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') saveRename(f.id);
                  if (e.key === 'Escape') cancelRename();
                }}
                autoFocus
                className="form-control"
              />
            ) : (
              <h6 onDoubleClick={() => startRename(f)}>
                {f.name || f.originalName}
              </h6>
            )}
          </div>
        </div>
      ))}

      {/* Context menu */}
      {menu.show && (
        <div
          ref={menuRef}
          className="list-group position-absolute"
          style={{ top: menu.y, left: menu.x, zIndex: 1000 }}
        >
          <IconMenu
            fileId={menu.fileId}
            files={files}
            onRename={(id) => {
              const f = files.find(f => f.id === id);
              if (f) startRename(f);
            }}
            onDownload={(id) => {
              const f = files.find(f => f.id === id);
              if (f) onDownloadClick(f);
            }}
          />
        </div>
      )}

      
    </div>
    </>
   
  );
}
