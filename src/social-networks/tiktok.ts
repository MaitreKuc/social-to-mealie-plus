import type { socialMediaResult } from '@/lib/types';
import { downloadWithYtDlp } from '@/lib/yt-dlp';

export async function getTiktok({ url }: { url: string }): Promise<socialMediaResult> {
  const { buffer, metadata } = await downloadWithYtDlp(url, 'tiktok-video.mp4');
  return {
    blob: new Blob([buffer]),
    thumbnail: metadata.thumbnail,
    description: metadata.description || 'No description found',
  };
}
