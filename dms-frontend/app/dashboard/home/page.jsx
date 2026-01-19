'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import { useLayout } from '../../../providers/LayoutProvider';
import {API_BASE_URL } from '../../../utils/constants';

export default function Home() {
   const { layoutState, setBreadcrumbs,setFiles } = useLayout();
   const { headerTitle, breadcrumbs,files } = layoutState;

  useEffect(() => {
    // Fetch files from backend API
    axios.get(`${API_BASE_URL}/GetRootFolder`).then(res => {
      let folder = res.data;
      axios.get(`${API_BASE_URL}/folders/${folder.id}/contents`)//https://your-backend.com/api/files
        .then(res => {

          const items = [
            ...res.data.folders.map(f => ({
              ...f,
              itemType: 'folder'
            })),
            ...res.data.files.map(f => ({
              ...f,
              itemType: 'file'
            }))
          ];
          setFiles(items);
          setBreadcrumbs([folder]);
        }

        )
        .catch(err => console.log(err));
    });

  }, []);

  return (
    <>
    </>
  )
}
