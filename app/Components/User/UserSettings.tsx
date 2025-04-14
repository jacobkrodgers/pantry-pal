'use client'

import { ServerUser } from '@/type/User';
import React, { useState } from 'react';
import { Box, Typography, useTheme, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

export default function UserSettings({ user }: { user: ServerUser }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<'username' | 'email' | 'password' | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleEdit = (type: 'username' | 'email' | 'password') => {
    setField(type);
    switch (type) {
        case 'username':
          setInputValue(user.username);
          break;
        case 'email':
          setInputValue(user.email);
          break;
        case 'password':
          setInputValue('');
          break;
      }
    setOpen(true); // Open modal
  };

  const handleClose = () => {
    setOpen(false); // Close modal
    setField(null); // Reset field
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        /[username]/settings (private)
      </Typography>
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        {/* Username */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5">
            Username: {user.username}
          </Typography>
          <Tooltip title="Edit Username">
            <IconButton size="small" onClick={() => handleEdit('username')}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Password */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5">
            Password
          </Typography>
          <Tooltip title="Edit Password">
            <IconButton size="small" onClick={() => handleEdit('password')}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Email */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">
            Email: {user.email}
          </Typography>
          <Tooltip title="Edit Email">
            <IconButton size="small" onClick={() => handleEdit('email')}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit {field}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type={field === 'password' ? 'password' : 'text'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            label={`New ${field}`}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              // Here you can integrate backend API to update the value
              console.log(`Updated ${field} to:`, inputValue);
              handleClose(); // Close modal after save
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
