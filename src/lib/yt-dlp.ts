import fs from 'node:fs/promises';
import path from 'node:path';
import YTDlpWrap from 'yt-dlp-wrap';

const ytDlpPath = path.resolve('./yt-dlp');
const outputDir = path.resolve('./temp');

export async function ensureYtDlpBinary() {
  const ytDlpVersion = process.env.YT_DLP_VERSION || '2025.03.31';
  const exists = await fs
    .access(ytDlpPath)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    console.log(`Downloading yt-dlp binary version ${ytDlpVersion}...`);
    await YTDlpWrap.downloadFromGithub(ytDlpPath, ytDlpVersion);
    try {
      await fs.chmod(ytDlpPath, 0o755);
    } catch (e) {
      console.warn('Could not set executable permissions on yt-dlp binary:', e);
    }
    console.log('yt-dlp binary downloaded.');
  }
}

export async function downloadWithYtDlp(url: string, filename = 'video.mp4') {
  await ensureYtDlpBinary();
  const ytDlpWrap = new YTDlpWrap(ytDlpPath);
  const outputFile = path.join(outputDir, filename);
  await fs.mkdir(outputDir, { recursive: true });
  try {
    await ytDlpWrap.execPromise([url, '-f', 'best', '-o', outputFile]);
    const metadata = await ytDlpWrap.getVideoInfo(url);
    const buffer = await fs.readFile(outputFile);
    return { buffer, metadata };
  } finally {
    await fs.unlink(outputFile).catch(() => {});
  }
}
