import fs from 'node:fs/promises';
import path from 'node:path';
import type { socialMediaResult } from '@/lib/types';
import YTDlpWrap from 'yt-dlp-wrap';

const ytDlpPath = path.resolve('./yt-dlp');
const outputDir = path.resolve('./temp');

export async function ensureYtDlpBinary() {
  const ytDlpVersion = process.env.YT_DLP_VERSION || '2025.05.22';
  console.log(`Platform: ${process.platform}, yt-dlp path: ${ytDlpPath}`);
  
  const exists = await fs
      .access(ytDlpPath)
      .then(() => {
        console.log('yt-dlp binary exists');
        return true;
      })
      .catch(() => {
        console.log('yt-dlp binary does not exist');
        return false;
      });

  if (!exists) {
    console.log(`Downloading yt-dlp binary version ${ytDlpVersion}...`);
    await YTDlpWrap.downloadFromGithub(ytDlpPath, ytDlpVersion);
    try {
      await fs.chmod(ytDlpPath, 0o755);
      console.log('Set executable permissions on yt-dlp binary');
    } catch (e) {
      console.warn('Could not set executable permissions on yt-dlp binary:', e);
    }
    console.log('yt-dlp binary downloaded.');
  }
}

export async function downloadWithYtDlp(url: string) {
  console.log('Starting downloadWithYtDlp for URL:', url);
  await ensureYtDlpBinary();
  
  console.log('Creating YTDlpWrap with path:', ytDlpPath);
  const ytDlpWrap = new YTDlpWrap(ytDlpPath);
  const outputFile = path.join(outputDir, 'audio.wav');
  await fs.mkdir(outputDir, { recursive: true });
  try {
    console.log('Starting yt-dlp execution...');
    await ytDlpWrap.execPromise([url, '-x', '--audio-format', 'wav', '-o', outputFile]);
    console.log('yt-dlp execution completed successfully');
    
    const metadata = await ytDlpWrap.getVideoInfo(url);
    const buffer = await fs.readFile(outputFile);
    return { buffer, metadata };
  } finally {
    await fs.unlink(outputFile).catch(() => {});
  }
}

export async function downloadMediaWithYtDlp(url: string): Promise<socialMediaResult> {
  const { buffer, metadata } = await downloadWithYtDlp(url);
  return {
    blob: new Blob([buffer], { type: 'audio/mp3' }),
    thumbnail: metadata.thumbnail,
    description: metadata.description || 'No description found',
  };
}
