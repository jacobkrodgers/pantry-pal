import { Box, Paper } from "@mui/material";

export default async function StandardLayout({children}: Readonly<{children: React.ReactNode}>) 
{
    return (
        <Box sx={[
            {p: 3}, 
        ]}>
            <Paper style={{ height: '100vh', padding: 10 }}>
                {children}
            </Paper>
        </Box>
    );
}