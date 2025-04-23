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
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h3" sx={{ fontsize: 'clamp(1.5rem, 4vw, 2.5rem)'}}>{user.username}</Typography>
    
      </Box>

      <Link
        href={`/${user.username}/recipes`}
        underline="hover"
        sx={{ display: 'inline-block', mt: 2 }}
      >
        View all recipes ({recipeCount})
      </Link>
    </>
  );
}
