import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import path from 'node:path';
import * as fs from 'node:fs';

async function getPinterestVideo(pinterestURL: string): Promise<string | null> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage();
  let videoUrl = null;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.match(/\.(mp4|m3u8)(\?.*)?$/i)) {
      console.log('Network video URL:', url);
      videoUrl = url;
    }
  });

  await page.goto(pinterestURL, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  const domVideoUrl = await page.evaluate(() => {
    const video = document.querySelector('video');
    return video?.src || null;
  });

  await browser.close();

  return domVideoUrl || videoUrl;
}

async function downloadVideo(videoUrl: string, filePath: string, referer: string): Promise<void> {
  console.log('Downloading from:', videoUrl);
  const headers = {
    Referer: referer,
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  const response = await fetch(videoUrl, { headers });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const buffer = await response.buffer();
  fs.writeFileSync(filePath, buffer);
}

export async function getPinterest({ url }: { url: string }): Promise<Buffer> {
  let videoPath = '';
  const videoUrl = await getPinterestVideo(url);
  console.log('Final video URL:', videoUrl);

  if (!videoUrl) throw new Error('No video URL found');

  videoPath = path.join(process.cwd(), 'video.mp4');
  await downloadVideo(videoUrl, videoPath, url);
  return fs.readFileSync(videoPath);
}
