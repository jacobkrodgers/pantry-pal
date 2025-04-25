"use client";

import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import ProfileComponent from "@/Components/Profile/ProfileComponent";
import SettingsComponent from "@/Components/Settings/SettingsComponent";

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
                centered
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label="Profile" />
                <Tab label="Settings" />
            </Tabs>

            <Box sx={{ mt: 2 }}>
                {tab === 0 && <ProfileComponent />}
                {tab === 1 && <SettingsComponent />}
            </Box>
        </Box>
    );
}
