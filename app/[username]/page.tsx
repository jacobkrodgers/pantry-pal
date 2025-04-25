"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import ProfileComponent from "@/Components/User/Profile";
import SettingsComponent from "@/Components/User/Settings";

export default function ProfilePage() {
    const [tab, setTab] = useState(0);
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <Box sx={{ width: "100%", mt: 4 }}>
            <Tabs
                value={tab}
                onChange={handleChange}
                sx={{
                    justifyContent: "flex-start",
                    borderBottom: (theme) => `2px solid ${theme.palette.divider}`,
                }}
                TabIndicatorProps={{
                    sx: {
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: (theme) => theme.palette.primary.main,
                    },
                }}
                textColor="primary"
            >
                <Tab
                    icon={<PersonOutlineIcon />}
                    iconPosition="start"
                    label="Profile"
                    sx={{
                        textTransform: "none",
                        fontWeight: (theme) => theme.typography.fontWeightMedium,
                        fontSize: "1rem",
                        px: 2,
                    }}
                />
                <Tab
                    icon={<SettingsOutlinedIcon />}
                    iconPosition="start"
                    label="Settings"
                    sx={{
                        textTransform: "none",
                        fontWeight: (theme) => theme.typography.fontWeightMedium,
                        fontSize: "1rem",
                        px: 2,
                    }}
                />
            </Tabs>

            <Box sx={{ mt: 2 }}>
                {tab === 0 && <ProfileComponent />}
                {tab === 1 && <SettingsComponent />}
            </Box>
        </Box>
    );
}
