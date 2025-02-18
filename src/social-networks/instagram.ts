import puppeteer from 'puppeteer';
import { snapsave } from 'snapsave-media-downloader';
import type { recipeInfo } from '@//lib/types';
import { getTranscription } from '@//lib/ai';

async function get_description({ url }: { url: string }): Promise<string> {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'], defaultViewport: null });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
    );
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('meta[property="og:description"]', { timeout: 5000 });

    const description = await page.$eval('meta[property="og:description"]', (el) => el.getAttribute('content'));
    return description ? description : 'No description found';
  } catch (error) {
    console.error('Error:', error);
    return 'No description found';
  } finally {
    await browser.close();
  }
}

export async function getInstagram({ url }: { url: string }): Promise<recipeInfo> {
  const description = await get_description({ url });
  const res = await snapsave(url);
  if (
    !res ||
    !res.data ||
    !res.data.media ||
    res.data.media.length === 0 ||
    !res.data.media[0].url ||
    !res.data.media[0].thumbnail
  ) {
    throw new Error('No media found in the post');
  }
  const blobUrl = res.data.media[0].url;
  const blob = await fetch(blobUrl).then((r) => r.blob());
  return {
    transcription: await getTranscription(blob),
    thumbnail: res.data.media[0].thumbnail,
    description,
    postURL: url,
  };
}
