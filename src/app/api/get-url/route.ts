import { NextResponse } from 'next/server';
import type { recipeInfo } from '@//lib/types';
import { getInstagram } from '@//social-networks/instagram';
import { getRecipe, postRecipe } from '@//lib/mealie';
import { getTiktok } from '@/social-networks/tiktok';

interface RequestBody {
  url: string;
}

async function processRecipe({ url }: RequestBody) {
  let data: recipeInfo;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }
  if (url.includes('instagram')) {
    data = await getInstagram({ url });
  } else if (url.includes('tiktok')) {
    data = await getTiktok({ url });
  } else {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }
  const mealieResponse = await postRecipe(data);
  const createdRecipe = await getRecipe(await mealieResponse);
  return NextResponse.json(createdRecipe);
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    return await processRecipe(body);
  } catch (error: any) {
    if (error?.message) {
      return NextResponse.json({ error: `Invalid request ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
