'use client'

import { ClientUser, UserControllerResponse } from '@/type/User';
import React, { useState } from 'react';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { userUpdateSchema, loginValidationSchema } from '@/validation/userValidation';

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

  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [oldPasswordError, setOldPasswordError] = useState('');
  const [deleteUsernameError, setDeleteUsernameError] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState('');

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
    // Reset any existing error messages
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setOldPasswordError('');

    // Prepare the payload depending on what field we're editing
    const input = {
      username: field === 'username' ? username : undefined,
      email: field === 'email' ? email : undefined,
      oldPassword: field === 'password' ? oldPassword : undefined,
      newPassword: field === 'password' ? password : undefined,
    };

    const { error } = userUpdateSchema.validate(input, { abortEarly: false });

    if (error) {
      error.details.forEach(({ path, message }) => {
        const key = path[0];

        switch (key) {
          case 'username':
            setUsernameError(message);
            break;
          case 'email':
            setEmailError(message);
            break;
          case 'oldPassword':
            setOldPasswordError(message);
            break;
          case 'newPassword':
            setPasswordError(message);
            break;
        }
      });

      return; // Prevent modal from closing
    }

    // If validation passes, call update function
    try {
      if (field === 'username' || field === 'email') {
        await onUpdateUsernameOrEmail(username, email);
      } else if (field === 'password') {
        await onUpdatePassword(oldPassword, password);
      }

      handleClose(); // Only close if all good
    } catch (err: any) {
      const msg = err.message || 'Something went wrong';

      if (field === 'username') setUsernameError(msg);
      else if (field === 'email') setEmailError(msg);
      else if (field === 'password') {
        if (msg.toLowerCase().includes('old')) setOldPasswordError(msg);
        else setPasswordError(msg);
      }
    }
  };
  

  const handleDeleteClose = () => {
    setDeleteOpen(false);
    setDeleteUsername('');
    setDeletePassword('');
  };

  const handleDeleteSubmit = async () => {
    setDeleteUsernameError('');
    setDeletePasswordError('');

    // Joi validation
    const { error } = loginValidationSchema.validate(
      {
        username: deleteUsername,
        password: deletePassword,
      },
      { abortEarly: false }
    );
  
    if (error) {
      error.details.forEach(({ path, message }) => {
        if (path[0] === 'username') setDeleteUsernameError(message);
        if (path[0] === 'password') setDeletePasswordError(message);
      });
      return;
    }

    if(deleteUsername !== username) {
      setDeleteUsernameError('Not current username.');
      return;
    }else if(deletePassword !== password) {
      setDeletePasswordError('Not current password.');
      return;
    }
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
                    onChange={(e) => {
                      setOldPassword(e.target.value);
                      setOldPasswordError('');
                    }}
                    error={!!oldPasswordError}
                    helperText={oldPasswordError ||
                      "(At least 8 characters, include a special character and a number)"}
                    sx={{ mt: 2 }}
                  />

                  <TextField
                    fullWidth
                    type="password"
                    label="New Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    error={!!passwordError}
                    helperText={passwordError ||
                      "(At least 8 characters, include a special character and a number)"}
                    sx={{ mt: 2 }}
                  />

                </>
            ) : (
              <TextField
                fullWidth
                type="text"
                label={`New ${field}`}
                value={field === 'username' ? username : email}
                onChange={(e) => {
                  if (field === 'username') {
                    setUsername(e.target.value);
                    setUsernameError('');
                  } else {
                    setEmail(e.target.value);
                    setEmailError('');
                  }
                }}
                error={!!(field === 'username' ? usernameError : emailError)}
                helperText={field === 'username' ? usernameError || "(Letters and numbers only)" : emailError || "(Use a valid email address)"}
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
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant='body2' color='error' sx={{ mb: 2 }}>
            Please confirm your credentials to delete your account.
          </Typography>
          <TextField 
            fullWidth
            label="Username"
            value={deleteUsername}
            onChange={(e) => {
              setDeleteUsername(e.target.value)
              setDeleteUsernameError('')
            }}
            error={!!deleteUsernameError}
            helperText={deleteUsernameError || 'Enter current username (Letters and numbers only)'}
            sx={{ mt: 2 }}
          />
          <TextField 
            fullWidth
            type='password'
            label='Password'
            value={deletePassword}
            onChange={(e) => {
              setDeletePassword(e.target.value)
              setDeletePasswordError('')
            }}
            error={!!deletePasswordError}
            helperText={deletePasswordError || 'Enter current password (At least 8 characters, include a special character and a number)'}
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