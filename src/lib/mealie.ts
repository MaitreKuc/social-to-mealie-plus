import type { recipeInfo, recipeResult } from './types';
import { env } from '@//lib/constants';

export async function postRecipe(recipe: recipeInfo) {
  const res = await fetch(`${env.MEALIE_URL}/api/recipes/create/html-or-json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.MEALIE_API_KEY}`,
    },
    body: JSON.stringify({
      data: `The following content is a transcription from a video using whisper ai and the thumbnail is from the video on a social network which will be used as the cover for the recipe you will also receive the post description wich could contain more information about the ingredients. The transcription includes some timestamps wich they are not required for the mealie recipe.I also send the original post from the social network that has to be saved to. <transcription> ${recipe.transcription}</transcription> <thumbnail>: ${recipe.thumbnail}</thumbnail> <description>: ${recipe.description}</description><postURL>${recipe.postURL}</postURL>`,
    }),
  });
  const body = await res.json();
  return body;
}

export async function getRecipe(recipeSlug: string): Promise<recipeResult> {
  const res = await fetch(`${env.MEALIE_URL}/api/recipes/${recipeSlug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.MEALIE_API_KEY}`,
    },
  });
  const body = await res.json();

  return {
    name: body.name,
    description: body.description,
    imageUrl: `${env.MEALIE_URL}/api/media/recipes/${body.id}/images/original.webp`,
    url: `${env.MEALIE_URL}/g/home/r/${recipeSlug}`,
  };
}
