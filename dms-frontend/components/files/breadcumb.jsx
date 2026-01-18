import { useLayout } from '../../providers/LayoutProvider';
import { useEffect, useState } from "react";
import axios from "axios";
import {API_BASE_URL } from '../../utils/constants';

export default function BootBreadcrumbs() {
    const { layoutState, setBreadcrumbs,setFiles } = useLayout();
    const { headerTitle, breadcrumbs } = layoutState;
    const [folders, setFolders] = useState([].concat(breadcrumbs));

    

    useEffect(() => {
        console.log('Breadcrumbs changed:', layoutState.breadcrumbs);
        setFolders(layoutState.breadcrumbs);
    }, [layoutState.breadcrumbs]);

      const onFolderClick = (file) => {
  
                axios.get(`${API_BASE_URL}/folders/${file.id}/contents`)//https://your-backend.com/api/files
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
                    }
    
                    )
                    .catch(err => console.log(err));
    
                axios.get(`${API_BASE_URL}/folders/${file.id}/breadcrumb`).then(res => {
    
                    //res.data.map(c=>c.name)
                    setBreadcrumbs(res.data);
    
                });
         
        }
    

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                {folders.map((f, index) =>
                    <li onClick={()=>onFolderClick(f)} key={index} className="breadcrumb-item"><a href="#">{f.name}</a></li>
                )}

            </ol>
        </nav>
    );
}