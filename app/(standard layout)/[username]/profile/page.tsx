'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Profile from '@/Components/Users/Profile';
import { PublicUser } from '@/type/User';

export default function UserProfilePage() {
  const { username } = useParams(); 
  const [user, setUser] = useState<PublicUser | null>(null);
  const [recipeCount, setRecipeCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserAndRecipes = async () => {
      try {
        const userRes = await fetch(`/api/users/username/${username}`); // Adjust if needed
        const userData = await userRes.json();
        setUser(userData);

        const countRes = await fetch(`/api/users/${userData.id}/recipeCount`);
        const countData = await countRes.json();
        setRecipeCount(countData.count);
      } catch (error) {
        console.error('Error loading user or recipe count:', error);
      }
    };

    if (username) fetchUserAndRecipes();
  }, [username]);

  if (!user) return <p>Loading user profile...</p>;

  return <Profile user={user} recipeCount={recipeCount} />;
}
