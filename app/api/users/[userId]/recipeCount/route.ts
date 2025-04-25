import { NextRequest, NextResponse } from 'next/server';
import { get_recipe_count_by_user_id } from '@/controller/recipeController';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const count = await get_recipe_count_by_user_id(userId);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching recipe count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
