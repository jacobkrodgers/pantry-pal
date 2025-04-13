'use client'

import {ClientUser} from '@/type/User'
import React, { useState } from 'react';
import {Box,
        Typography,
        useTheme, Paper} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


export default function UserSettings({user}: {user: ClientUser}) {
    const theme = useTheme();

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                /[username]/profile (private)
            </Typography>
            <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5">
                        Username: {user.username}
                    </Typography>
                    <EditIcon /> Edit
                    <Typography variant='h5'>
                        Password
                    </Typography>
                    <EditIcon /> Edit
                    <Typography variant='h5'>
                        Email: {user.email}
                    </Typography>
                    <EditIcon /> Edit
                </Box>
            </Paper>
        </Box>
    )
}