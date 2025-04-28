'use server';

import { ClientUser } from '@/type/User';
import { get_recipe_count_by_user_id } from '@/controller/recipeController';
import { getClientUserBySessionId } from '@/controller/userController';
import { cookies } from 'next/headers';

export async function fetchProfileUserFromSession(): Promise<ClientUser> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session')?.value ?? '';

  const result = await getClientUserBySessionId(sessionId);

  if (result.status !== 200 || !result.payload) {
    throw new Error('Not authorized or session invalid.');
  }

  return result.payload;
}

export async function getRecipeCount(userId: string): Promise<number> {
  return await get_recipe_count_by_user_id(userId);
}


