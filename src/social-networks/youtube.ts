import fs from 'node:fs/promises';
import path from 'node:path';
import type { socialMediaResult } from '@//lib/types';
import YTDlpWrap from 'yt-dlp-wrap';

const ytDlpPath = path.resolve('./yt-dlp');

async function ensureYtDlpBinary() {
  const ytDlpVersion = '2025.03.31';
  const exists = await fs
    .access(ytDlpPath)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    console.log(`Downloading yt-dlp binary version ${ytDlpVersion}...`);
    await YTDlpWrap.downloadFromGithub(ytDlpPath, ytDlpVersion);
    console.log('yt-dlp binary downloaded.');
  }
}
export async function getYoutube({ url }: { url: string }): Promise<socialMediaResult> {
  await ensureYtDlpBinary();

  const ytDlpWrap = new YTDlpWrap(ytDlpPath);
  const outputDir = path.resolve('./temp');
  const outputFile = path.join(outputDir, 'video.mp4');

  await fs.mkdir(outputDir, { recursive: true });

  try {
    console.log('Downloading video...');
    await ytDlpWrap.execPromise([url, '-f', 'best', '-o', outputFile]);

    console.log('Fetching metadata...');
    const metadata = await ytDlpWrap.getVideoInfo(url);

    const buffer = await fs.readFile(outputFile);

    return {
      blob: new Blob([buffer]),
      thumbnail: metadata.thumbnail,
      description: metadata.description || 'No description found',
    };
  } catch (error) {
    console.error('Error downloading YouTube video:', error);
    throw new Error('Failed to download YouTube video');
  } finally {
    await fs.unlink(outputFile).catch(() => {});
  }
}
