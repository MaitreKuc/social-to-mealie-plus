import { getRecipe, postRecipe } from '@//lib/mealie';
import type { progressType, recipeInfo, socialMediaResult } from '@//lib/types';
import { getInstagram } from '@//social-networks/instagram';
import { getTranscription } from '@/lib/ai';
import { getTiktok } from '@/social-networks/tiktok';
import { NextResponse } from 'next/server';

interface RequestBody {
  url: string;
}

let progress: progressType = {
  videoDownloaded: null,
  audioTranscribed: null,
  recipeCreated: null,
};

async function processRecipe({ url }: RequestBody) {
  try {
    let socialMediaResult: socialMediaResult;
    progress = {
      videoDownloaded: null,
      audioTranscribed: null,
      recipeCreated: null,
    };

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    if (url.includes('instagram')) {
      socialMediaResult = await getInstagram({ url });
      progress.videoDownloaded = true;
    } else if (url.includes('tiktok')) {
      socialMediaResult = await getTiktok({ url });
      progress.videoDownloaded = true;
    } else {
      progress.videoDownloaded = false;
      return NextResponse.json({ error: 'Error downloading video', progress }, { status: 400 });
    }
    const transcription = await getTranscription(socialMediaResult.blob);
    progress.audioTranscribed = true;
    const data: recipeInfo = {
      postURL: url,
      description: socialMediaResult.description,
      transcription,
      thumbnail: socialMediaResult.thumbnail,
    };
    const mealieResponse = await postRecipe(data);
    const createdRecipe = await getRecipe(await mealieResponse);
    progress.recipeCreated = true;
    return NextResponse.json(createdRecipe);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, progress }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json();
  return await processRecipe(body);
}
