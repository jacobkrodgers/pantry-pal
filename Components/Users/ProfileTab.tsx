import React, { useState } from 'react';
import {Tabs,
        Tab,
        Box,
        Typography,
        Button,
        Link,
        useTheme, Paper} from '@mui/material';

function TabPanel({ children, value, index }: any) {
  return value === index && (
    <Box sx={{ pt: 2 }}>
      {children}
    </Box>
  );
}

export default function UserProfileTabs() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_: any, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        /username/profile (private)
      </Typography>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}
      >
        <Tab label="Profile" />
        <Tab label="Followers" />
        <Tab label="Following" />
        <Tab label="Settings" />
      </Tabs>

      {/* === Profile Tab Content === */}
      <TabPanel value={tab} index={0}>
        <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5">Username</Typography>
            <Button variant="outlined" size="small">Edit</Button>
          </Box>
          <Typography sx={{ mt: 2 }}>
            Joined on 15 August, 2022
          </Typography>
          <Link href="/recipes?user=username" underline="hover">
            View all recipes (12)
          </Link>
        </Paper>
      </TabPanel>
    </Box>
  );
}
