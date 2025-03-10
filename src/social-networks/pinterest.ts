import puppeteer from 'puppeteer';
import fetch from 'node-fetch';
import m3u8Parser from 'm3u8-parser';
import fs from 'fs';
import path from 'path';

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

async function getM3U8Urls(videoUrl: string, referer: string): Promise<string[]> {
  console.log('Fetching m3u8 from:', videoUrl);
  const headers = {
    Referer: referer,
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  };

  const response = await fetch(videoUrl, { headers });
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  const m3u8Text = await response.text();
  const parser = new m3u8Parser.Parser();
  parser.push(m3u8Text);
  parser.end();

  const segments = parser.manifest.segments;
  const urls = segments.map(segment => new URL(segment.uri, videoUrl).toString());

  return urls;
}

async function convertM3U8ToBlob(urls: string[]): Promise<Blob> {
  const responses = await Promise.all(urls.map(url => fetch(url)));
  const buffers = await Promise.all(responses.map(response => response.arrayBuffer()));
  const blob = new Blob(buffers, { type: 'video/mp4' });
  return blob;
}

async function saveBlobAsMP4(blob: Blob, filename: string): Promise<void> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Saved video as ${filePath}`);
}

export async function getPinterest({ url }: { url: string }): Promise<string[]> {
  const videoUrl = await getPinterestVideo(url);
  console.log('Final video URL:', videoUrl);

  if (!videoUrl) throw new Error('No video URL found');

  try {
    const m3u8Urls = await getM3U8Urls(videoUrl, url);
    const blob = await convertM3U8ToBlob(m3u8Urls);
    console.log('Converted to blob:', blob);
    await saveBlobAsMP4(blob, 'video.mp4');
    return ['video.mp4'];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
