'use client';

import { useEffect, useState } from 'react';
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

  return <Profile user={user} recipeCount={recipeCount} />;
}
