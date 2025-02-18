import type { socialMediaResult } from '@/lib/types';
import { snapsave } from 'snapsave-media-downloader';

export async function getTiktok({ url }: { url: string }): Promise<socialMediaResult> {
  const res = await snapsave(url);
  if (!res || !res.data || !res.data.media || !res.data.media[0].url || !res.data.description || !res.data.preview) {
    throw new Error('No media found in the post');
  }
  const blobUrl = res.data.media[0].url;
  const blob = await fetch(blobUrl).then((r) => r.blob());
  return {
    blob,
    thumbnail: res.data.preview,
    description: res.data.description,
  };
}
