'use client';

import { Box, IconButton, Typography, Paper, Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ClientUser } from '@/type/User';

type ProfileProps = {
  user: ClientUser;
  recipeCount: number;
};

export default function Profile({ user, recipeCount }: ProfileProps) {
  return (
    <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">{user.username}</Typography>
        <IconButton aria-label="edit profile" size="small">
          <EditIcon />
        </IconButton>
      </Box>

      <Link
        href={`/${user.username}/recipes`}
        underline="hover"
        sx={{ display: 'inline-block', mt: 2 }}
      >
        View all recipes ({recipeCount})
      </Link>
    </Paper>
  );
}
