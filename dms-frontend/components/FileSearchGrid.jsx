'use client';

import { useEffect, useState } from 'react';
import { useLayout } from '@/providers/LayoutProvider';
import { API_BASE_URL } from '../utils/constants';
import { api } from '../lib/api';

export default function FileSearchGrid() {
  const [search, setSearch] = useState('');
  const [typing, setTyping] = useState(false);

  const { layoutState, setFiles } = useLayout();
  const currentFolder = layoutState.breadcrumbs?.slice(-1)[0];

  /* -----------------------------
     Debounced search
  ------------------------------ */
  useEffect(() => {
    if (!typing) return;

    const timeout = setTimeout(async () => {
      try {
        // If search box empty → reload current folder
        if (!search.trim()) {
          if (!currentFolder?.id) return;

          const res = await api.get(
            `${API_BASE_URL}/folders/${currentFolder.id}/contents`
          );

          const items = [
            ...res.data.folders.map(f => ({ ...f, type: 'folder' })),
            ...res.data.files.map(f => ({ ...f, type: 'file' })),
          ];

          setFiles(items);
          return;
        }

        // Search API
        const res = await api.get(`${API_BASE_URL}/search`, {
          params: {
            q: search,
            folderId: currentFolder?.id,
          },
        });

        setFiles(res.data);
      } catch (err) {
        console.error('Search failed', err);
      }
    }, 400); // ⏱ debounce delay

    return () => clearTimeout(timeout);
  }, [search, typing]);

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <div className="d-flex align-items-center mb-4 gap-3">
      <h5 className="mb-0">Search</h5>

      <input
        type="text"
        className="form-control w-50"
        placeholder="Search files & folders..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setTyping(true);
        }}
      />
    </div>
  );
}
