'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Paper } from '@mui/material';
import Profile from '@/Components/User/Profile';
import { ClientUser } from '@/type/User';
import { fetchProfileUserFromSession, getRecipeCount } from './action';

export default function UserProfilePage() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [recipeCount, setRecipeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchProfileUserFromSession();
        setUser(userData);

        const count = await getRecipeCount(userData.id);
        setRecipeCount(count);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <Paper sx={{ height: '100vh', m: 1 }}>  
        <Profile user={user} recipeCount={recipeCount} />
    </Paper>    
  )
}
