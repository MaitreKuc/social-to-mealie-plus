import { error } from 'elysia';
import { getRecipe, postRecipe } from './mealie';
import { getInstagram } from './social-networks/instagram';
import { getTiktok } from './social-networks/tiktok';
import type { envTypes, recipeInfo } from './types';
import { envElysia } from './types';
import { removeMedia } from './utils';

export default async function processRecipe({ body, env }: { body: { url: string }; env: envTypes }) {
  try {
    removeMedia();
    let data: recipeInfo;
    if (body.url.includes('instagram')) {
      data = await getInstagram({ env, url: body.url });
    } else if (body.url.includes('tiktok')) {
      data = await getTiktok({ env, url: body.url });
    } else {
      return error(400, JSON.stringify({ error: 'Invalid URL' }));
    }
    removeMedia();
    const mealieResponse = await postRecipe(data, env);
    const createdRecipe = await getRecipe(await mealieResponse, env);
    return createdRecipe;
  } catch (e: any) {
    return error('Internal Server Error', JSON.stringify({ error: e.message }));
  }
}
