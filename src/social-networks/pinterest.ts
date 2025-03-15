import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import path from "path";
import fs from "fs/promises";
import { socialMediaResult } from "@/lib/types";


const tempVideo = path.resolve("temp.mp4");
const tempAudio = path.resolve("temp.mp3");

async function getPinterestMedia(pinterestURL: string): Promise<{ videoUrl: string | null; audioUrl: string | null; description: string, thumbnail: string | null }> {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  let videoUrl: string | null = null;
  let audioUrl: string | null = null;
  let description: string = "";
  let thumbnail: string | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("_audio.m3u8")) {
      audioUrl = url;
    } else if (url.includes("_720w.m3u8")) {
      videoUrl = url;
    } else if (!videoUrl && url.match(/\.(mp4|m3u8)(\?.*)?$/i)) {
      videoUrl = url;
    }
  });

  await page.goto(pinterestURL, { waitUntil: "networkidle2", timeout: 60000 });

  description = await page.evaluate(() => document.title || "No title found");

  thumbnail = await page.evaluate(() => {
    const metaTag = document.querySelector("meta[property='og:image']");
    return metaTag ? metaTag.getAttribute("content") : null;
  });

  await browser.close();
  return { videoUrl, audioUrl, description, thumbnail };
}



async function convertM3U8ToMP3Blob(m3u8Url: string, video: boolean): Promise<Buffer> {
  return new Promise((resolve, reject) => {

    const ffmpegProcess = ffmpeg(m3u8Url)
      .audioCodec("libmp3lame")
      .format(video ? "mp4" : "wav")
      .on("end", async () => {
        try {
          const mediaBuffer = await fs.readFile(video ? tempVideo : tempAudio);
          resolve(mediaBuffer);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      });

    ffmpegProcess.save(video ? tempVideo : tempAudio);
  });
}

async function extractThumbnail(videoPath: string, thumbnailPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        folder: path.dirname(thumbnailPath),
        filename: path.basename(thumbnailPath),
        size: "1080x1920",
      })
      .on("end", () => {
        console.log("Thumbnail extracted successfully.");
        resolve();
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      });
  });
}

export async function getPinterest({ url }: { url: string }): Promise<socialMediaResult> {
  const { videoUrl, audioUrl, description, thumbnail } = await getPinterestMedia(url);

  let audioBlob: Blob | null = null;

  if (audioUrl) {
    audioBlob = new Blob([await convertM3U8ToMP3Blob(audioUrl, false)], { type: "audio/mp3" });
    await fs.unlink(tempAudio);
  } else {
    throw new Error("No audio found");
  }

  if (!thumbnail) console.error("No thumbnail found");
  return {
    blob: audioBlob,
    thumbnail: thumbnail || "Error getting image",
    description: description,
  };
}
