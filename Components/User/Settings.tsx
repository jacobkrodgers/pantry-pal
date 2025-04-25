'use client'

import { ClientUser } from '@/type/User';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormGroup,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import FormInput from "@/Components/Inputs/FormInput";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { passwordValidationSchema, usernameValidationSchema, emailValidationSchema } from '@/validation/userValidation';
import { useRouter } from 'next/navigation';
import { ActionResponse } from '@/type/Generic';

interface SettingsProps
{
    user: ClientUser;
    onUpdateUsername: (username: string) => Promise<ActionResponse<ClientUser>>;
    onUpdateEmail: (email: string) => Promise<ActionResponse<ClientUser>>;
    onUpdatePassword: (oldPassword: string, newPassword: string) => Promise<ActionResponse<ClientUser>>;
    onDeleteUser: (username: string, password: string) => Promise<ActionResponse<ClientUser>>;
};

export default function Settings({user, onUpdateUsername, onUpdateEmail, onUpdatePassword, onDeleteUser}: SettingsProps)
{
    const router = useRouter();
    const [usernameField, setUsernameField] = useState(user.username);
    const [emailField, setEmailField] = useState(user.email);
    const [toggleUsernameEdit, setToggleUsernameEdit] = useState(false);
    const [toggleEmailEdit, setToggleEmailEdit] = useState(false);
    const [enableSaveUsername, setEnableSaveUsername] = useState(false);
    const [enableSaveEmail, setEnableSaveEmail] = useState(false);
    const [oldPasswordField, setOldPasswordField] = useState('');
    const [newPasswordField, setNewPasswordField] = useState('');
    const [enableSavePassword, setEnableSavePassword] = useState(false);
    const [enableDeleteAccount, setEnableDeleteAccount] = useState(false);
    const [deleteUsernameField, setDeleteUsernameField] = useState('');
    const [deletePasswordField, setDeletePasswordField] = useState('');

    const [usernameFieldError, setUsernameFieldError] = useState('');
    const [emailFieldError, setEmailFieldError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [deleteUsernameError, setDeleteUsernameError] = useState('');
    const [deletePasswordError, setDeletePasswordError] = useState('');

    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [showDeletePassword, setShowDeletePassword] = useState(false);

    const handleUsernameFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setUsernameField(value);
    
        const { error: usernameValidationError } = usernameValidationSchema.validate(value);
        if (usernameValidationError) {
            setUsernameFieldError(usernameValidationError.message);
        } else if (value === user.username) {
            setUsernameFieldError("Username cannot match your current username.");
        } else {
            setUsernameFieldError('');
        }
    }
    
    const handleEmailFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setEmailField(value);
    
        const { error: emailValidationError } = emailValidationSchema.validate(value);
        if (emailValidationError) {
            setEmailFieldError(emailValidationError.message);
        } else if (value === user.email) {
            setEmailFieldError("Email cannot match your current email.");
        } else {
            setEmailFieldError('');
        }
    }

    const handleOldPasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setOldPasswordField(value);
    
        const { error: oldPasswordValidationError } = passwordValidationSchema.validate(value);
        if (oldPasswordValidationError) {
            setOldPasswordError(oldPasswordValidationError.message);
        } 
        else 
        {
            setOldPasswordError('');
        }
    }
    
    const handleNewPasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setNewPasswordField(value);
    
        const { error: newPasswordValidationError } = passwordValidationSchema.validate(value);
        if (newPasswordValidationError) {
            setNewPasswordError(newPasswordValidationError.message);
        } else {
            setNewPasswordError('');
        }
    }

    const handleDeleteUsernameFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDeleteUsernameField(value); // Update state

        // Use the current 'value' for comparison, not the potentially stale state value
        if (value.toLowerCase() !== user.username.toLowerCase()) {
            setDeleteUsernameError('Incorrect Username');
        } else {
            setDeleteUsernameError('');
        }
    }
    
    const handleDeletePasswordFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setDeletePasswordField(value);
    
        const { error: deletePasswordValidationError } = passwordValidationSchema.validate(value);
        if (deletePasswordValidationError) {
            setDeletePasswordError(deletePasswordValidationError.message);
        } else {
            setDeletePasswordError('');
        }
    }

    const handleSaveUsername = async () =>
    {
        const res = await onUpdateUsername(usernameField);
        if (res === undefined || res.status != 200)
        {
            setUsernameFieldError('Internal Server Error')
            return;
        }

        router.replace(`/${res.payload!.username}/settings`)
    }

    const handleSaveEmail = async () =>
    {
        const res = await onUpdateEmail(emailField);
        if (res!.status != 200)
        {
            setEmailFieldError('Internal Server Error')
            return;
        }

        setEnableSaveEmail(false);
        setToggleEmailEdit(false);
    }

    const handleUpdatePassword = async () =>
    {
        const res = await onUpdatePassword(oldPasswordField, newPasswordField);
        if (res!.status != 200)
        {
            setOldPasswordError('Internal Server Error');
            setNewPasswordError('Internal Server Error');
            return;
        }

        setOldPasswordField('');
        setNewPasswordField('');
        setOldPasswordError('');
        setNewPasswordError('');
        setOpenPasswordModal(false);
    }

    const handleDeleteUser = async () =>
    {
        const res = await onDeleteUser(deleteUsernameField, deletePasswordField);
        if (res!.status != 200)
        {
            setDeletePasswordError('Internal Server Error');
            setDeleteUsernameError('Internal Server Error');
        }
    }

    // Function to handle closing and clearing the password modal
    const handleClosePasswordModal = () => {
        setOldPasswordField('');
        setNewPasswordField('');
        setOldPasswordError('');
        setNewPasswordError('');
        setShowOldPassword(false); // Also reset visibility state
        setShowNewPassword(false);
        setOpenPasswordModal(false); // Close the modal
    };

    // Function to handle closing and clearing the delete modal
    const handleCloseDeleteModal = () => {
        setDeleteUsernameField('');
        setDeletePasswordField('');
        setDeleteUsernameError('');
        setDeletePasswordError('');
        setShowDeletePassword(false); // Reset visibility if you add this toggle later
        setOpenDeleteModal(false); // Close the modal
    };

    useEffect(() => {
        // Enable save only if there's no error AND the value is actually different from the original
        setEnableSaveUsername(!usernameFieldError && usernameField !== user.username);
        setEnableSaveEmail(!emailFieldError && emailField !== user.email);

        // Enable password save only if no errors and both fields are filled
        setEnableSavePassword(!oldPasswordError && !newPasswordError && oldPasswordField !== '' && newPasswordField !== '');

        // Enable delete only if no errors and both fields are filled (and username matches)
        const isUsernameCorrect = deleteUsernameField.toLowerCase() === user.username.toLowerCase();
        setEnableDeleteAccount(
            isUsernameCorrect && // Explicitly check username match again here for clarity/safety
            !deleteUsernameError && // Check the derived error state
            !deletePasswordError &&
            deleteUsernameField !== '' &&
            deletePasswordField !== ''
        );

    }, [
        // List ALL state variables and props that the effect reads
        usernameField,
        emailField,
        oldPasswordField,
        newPasswordField,
        deleteUsernameField,
        deletePasswordField,
        usernameFieldError,
        emailFieldError,
        oldPasswordError,
        newPasswordError,
        deleteUsernameError,
        deletePasswordError,
        user.username, // Include props used in comparisons
        user.email
    ]);
    
    return (
        <Box sx={{ maxWidth: 500, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Settings
            </Typography>
            <Box 
                component="form" 
                noValidate 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 
                    'column', gap: 5 
                    }}
            >
                <TextField
                    label="Username"
                    value={usernameField}
                    onChange={handleUsernameFieldChange}
                    error={Boolean(usernameFieldError)}
                    helperText={usernameFieldError}
                    disabled={!toggleUsernameEdit}
                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                color="primary"
                                onClick={() => setToggleUsernameEdit(true)}
                            >
                                <EditIcon />
                            </IconButton>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />
                {toggleUsernameEdit && (
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleSaveUsername}
                            disabled={!enableSaveUsername}
                        >
                            Save
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                setUsernameField(user.username)
                                setUsernameFieldError('');
                                setToggleUsernameEdit(false)
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                )}

                <FormGroup>
                    <TextField
                        label="Email"
                        value={emailField}
                        onChange={handleEmailFieldChange}
                        error={Boolean(emailFieldError)}
                        helperText={emailFieldError}
                        disabled={!toggleEmailEdit}
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    color="primary"
                                    onClick={() => setToggleEmailEdit(true)}
                                >
                                    <EditIcon />
                                </IconButton>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />
                    {toggleEmailEdit && (
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleSaveEmail}
                                disabled={!enableSaveEmail}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setEmailField(user.email);
                                    setEmailFieldError('');
                                    setToggleEmailEdit(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    )}
                </FormGroup>


                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2 }}>
                    <Button
                        variant="outlined"
                        size='small'
                        onClick={() => setOpenPasswordModal(true)}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Change Password
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size='small'
                        onClick={() => setOpenDeleteModal(true)}
                        sx={{ alignSelf: 'flex-start' }}
                    >
                        Delete Account
                    </Button>
                </Box>
                

                <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}>
                    <DialogTitle>Edit Password</DialogTitle>
                        <DialogContent>
                            <FormInput
                                label="Old Password"
                                type={showOldPassword ? 'text' : 'password'} // Toggle between text and password type
                                value={oldPasswordField}
                                onChange={(e) => {
                                    handleOldPasswordFieldChange(e)
                                }}
                                errorMessage={oldPasswordError}
                                helperText={
                                    oldPasswordError ||
                                    '(At least 8 characters, include a special character and a number)' // Helper text for password requirements
                                }
                                sx={{ mt: 2 }}
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                                            {showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                            />

                            <FormInput
                                label="New Password"
                                type={showNewPassword ? 'text' : 'password'} // Toggle between text and password type
                                value={newPasswordField}
                                onChange={(e) => {
                                    handleNewPasswordFieldChange(e);
                                }}
                                errorMessage={newPasswordError}
                                helperText={
                                    newPasswordError ||
                                    '(At least 8 characters, include a special character and a number)' // Helper text for password requirements
                                }
                                sx={{ mt: 2 }}
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                                            {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                    ),
                                }}
                            />
                        </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClosePasswordModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdatePassword}
                            variant="contained"
                            disabled={!enableSavePassword}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDeleteModal} onClose={handleCloseDeleteModal}>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                        Please confirm your credentials to delete your account.
                        </Typography>
                        <FormInput
                            label="Username"
                            value={deleteUsernameField}
                            onChange={(e) => {
                                handleDeleteUsernameFieldChange(e)
                            }}
                            errorMessage={deleteUsernameError}
                            helperText={
                                deleteUsernameError || 'Enter current username (Letters and numbers only)'
                            }
                            sx={{ mt: 2 }}
                        />
                
                        <FormInput
                            label="Password"
                            type={showDeletePassword ? 'text' : 'password'}
                            value={deletePasswordField}
                            onChange={(e) => {
                                handleDeletePasswordFieldChange(e);
                            }}
                            errorMessage={deletePasswordError}
                            helperText={
                                deletePasswordError ||
                                '(At least 8 characters, include a special character and a number)'
                            }
                            sx={{ mt: 2 }}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowDeletePassword(!showDeletePassword)} edge="end">
                                        {showDeletePassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                ),
                            }}
                        />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="error"
                                variant="contained"
                                onClick={handleDeleteUser}
                                // Invert the logic: disable when NOT enabled
                                disabled={!enableDeleteAccount}
                            >
                                Delete Account
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    )
}