'use client'

import { ClientUser } from '@/type/User';
import React, { useState } from 'react';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { updateUserByApiKey, updateUserPasswordByApiKey } from '@/controller/userController'

type Props = {
  user: ClientUser;
  onUpdateUsernameOrEmail: (username: string, email: string) => Promise<void>;
  onUpdatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

export default function UserSettings({user, onUpdateUsernameOrEmail, onUpdatePassword}: Props) {
  const [open, setOpen] = useState(false);
  const [field, setField] = useState<'username' | 'email' | 'password' | null>(null);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

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
    </Box>
  );
}