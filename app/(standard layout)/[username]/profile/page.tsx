'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, Paper } from '@mui/material';
import Profile from '@/Components/Users/Profile';
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
    <Paper sx={{ height: '100vh', m: 3 }}>  
        <Card sx={{ maxWidth: 600,
                    mx: 'auto',
                    m:4, p:2,
                    borderRadius: 3,
                    backgroundColor:theme => theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100'}}>
            <CardContent>
                <Profile user={user} recipeCount={recipeCount} />
            </CardContent>
        </Card>
    </Paper>    
  )
}
