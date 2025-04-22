'use client'

import { ClientUser, UserControllerResponse } from '@/type/User';
import React, { useState } from 'react';
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormInput from "@/Components/Inputs/FormInput";
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
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}>
      {/* Delete Account Button */}
      <Button
        variant="outlined"
        color="error"
        onClick={() => setDeleteOpen(true)}
        sx={{ mb: 2 }}
      >
        Delete Account
      </Button>

      {/* Main Settings Form */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        noValidate
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <FormInput
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError('');
          }}
          errorMessage={usernameError}
          helperText={usernameError || '(Letters and numbers only)'}
        />

        <FormInput
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError('');
          }}
          errorMessage={emailError}
          helperText={emailError || '(Use a valid email address)'}
        />

        <Button
          variant="outlined"
          onClick={() => handleEdit('password')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Change Password
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={!username.trim() || !email.trim()}
          sx={{
            backgroundColor: 'black',
            color: 'white',
            ':hover': { backgroundColor: '#333' },
          }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Edit Password Modal */}
      <Dialog open={open && field === 'password'} onClose={handleClose}>
        <DialogTitle>Edit Password</DialogTitle>
        <DialogContent>
          <FormInput
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setOldPasswordError('');
            }}
            errorMessage={oldPasswordError}
            helperText={
              oldPasswordError ||
              '(At least 8 characters, include a special character and a number)'
            }
            sx={{ mt: 2 }}
          />

          <FormInput
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
            }}
            errorMessage={passwordError}
            helperText={
              passwordError ||
              '(At least 8 characters, include a special character and a number)'
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!oldPassword || !password}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteOpen} onClose={handleDeleteClose}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            Please confirm your credentials to delete your account.
          </Typography>

          <FormInput
            label="Username"
            value={deleteUsername}
            onChange={(e) => {
              setDeleteUsername(e.target.value);
              setDeleteUsernameError('');
            }}
            errorMessage={deleteUsernameError}
            helperText={
              deleteUsernameError || 'Enter current username (Letters and numbers only)'
            }
            sx={{ mt: 2 }}
          />

          <FormInput
            label="Password"
            type="password"
            value={deletePassword}
            onChange={(e) => {
              setDeletePassword(e.target.value);
              setDeletePasswordError('');
            }}
            errorMessage={deletePasswordError}
            helperText={
              deletePasswordError ||
              'Enter current password (At least 8 characters, include a special character and a number)'
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClose}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
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