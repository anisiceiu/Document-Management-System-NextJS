'use client';

import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { Cloud, NoAdultContentOutlined } from '@mui/icons-material';

interface File {
  id: string;
  name?: string;
  originalName: string;
}

interface IconMenuProps {
  fileId: string | null | undefined;
  files: File[];
  onRename: (id: string) => void;
  onDownload: (id: string) => void;
}

export default function IconMenu({ fileId, files, onRename, onDownload }: IconMenuProps) {
  const file = files.find(f => f.id === fileId);
  if (!file) return null;

  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
        <MenuItem onClick={() => onRename(file.id)}>
          <ListItemIcon>
            <NoAdultContentOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>Rename</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => onDownload(file.id)}>
          <ListItemIcon>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
