'use client';

import { useEffect, useState } from 'react';
import { Box, 
         IconButton,
         Typography, 
         Paper, 
         Link } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { PublicUser } from '@/type/User';

type ProfileProps = {
  user: PublicUser;
};

export default function Profile({ user }: ProfileProps) {
  const [recipeCount, setRecipeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeCount = async () => {
      try 
      {
        const res = await fetch(`/api/users/${user.id}/recipes/count`);
        if (!res.ok) 
          throw new Error('Failed to fetch recipe count');
        const data = await res.json();
        
        setRecipeCount(data.count);
      } 
      catch (error) 
      {
        console.error('Error fetching recipe count:', error);
      } 
    };

    fetchRecipeCount();
  }, [user.id]);

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

