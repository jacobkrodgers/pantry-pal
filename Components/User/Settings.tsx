'use client'

import { ClientUser, UserControllerResponse } from '@/type/User';
import React, { useState } from 'react';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

type Props = {
  user: ClientUser;
  onUpdateUsernameOrEmail: (username: string, email: string) => Promise<void>;
  onUpdatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  onDeleteUser: (username: string, password: string) => Promise<void>;
};

export default function UserSettings({user, onUpdateUsernameOrEmail, onUpdatePassword, onDeleteUser}: Props) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<'username' | 'email' | 'password' | null>(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const handleEdit = (type: 'username' | 'email' | 'password') => {
    setField(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false); // Close modal
    setField(null); // Reset field
    setOldPassword('');
    setPassword('');
  };

  const handleSave = async () => {
    if (field === 'username' || field === 'email') {
      await onUpdateUsernameOrEmail(username, email);
    } else if (field === 'password') {
      await onUpdatePassword(oldPassword, password);
    }
    handleClose();
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteUsername('');
    setDeletePassword('');
  };

  const handleDeleteSubmit = async () => {
    await onDeleteUser(deleteUsername, deletePassword);
    handleDeleteClose();
  };

  return (    
    <Box sx={{ width: '100%' }}>
      {/* Top Section with Delete Button */}
      <Button variant='outlined' color='error' onClick={() => setDeleteOpen(true)}>
        Delete Account
      </Button>
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
            {field === 'password' ? (
                <>
                  <TextField 
                    fullWidth
                    type="password"
                    label="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                </>
            ) : (
                <TextField
                  fullWidth
                  type="text"
                  label={`New ${field}`}
                  value={field === 'username' ? username : email}
                  onChange={(e) =>
                    field === 'username' ? setUsername(e.target.value) : setEmail(e.target.value)
                  }
                  sx={{ mt: 2 }}
                />
            )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant = "contained"
            disabled = {
                (field === 'username' && !username.trim()) ||
                (field === 'email' && !email.trim()) ||
                (field === 'password' && (!oldPassword || !password))
            }
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={handleClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            Please confirm your credentials to delete your account.
          </Typography>
          <TextField 
            fullWidth
            label="Username"
            value={deleteUsername}
            onChange={(e) => setDeleteUsername(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField 
            fullWidth
            type='password'
            label='Password'
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            color='error'
            variant='contained'
            onClick={handleDeleteSubmit}
            disabled={!deleteUsername || !deletePassword}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}