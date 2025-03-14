import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import path from "path";
import fs from "fs/promises";
import { socialMediaResult } from "@/lib/types";

async function getPinterestMedia(pinterestURL: string): Promise<{ videoUrl: string | null; audioUrl: string | null }> {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();

  let videoUrl: string | null = null;
  let audioUrl: string | null = null;

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("_audio.m3u8")) {
      console.log("Audio URL found:", url);
      audioUrl = url;
    } else if (url.includes("_720w.m3u8")) {
      console.log("High-quality Video URL found:", url);
      videoUrl = url;
    } else if (!videoUrl && url.match(/\.(mp4|m3u8)(\?.*)?$/i)) {
      console.log("Fallback Video URL:", url);
      videoUrl = url;
    }
  });

  await page.goto(pinterestURL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.evaluate(() => {
    const video = document.querySelector("video");
    return video?.src || null;
  });

  await browser.close();
  return { videoUrl, audioUrl };
}

async function convertM3U8ToMP3Blob(m3u8Url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const tempFilePath = path.resolve("temp_audio.mp3");

    const ffmpegProcess = ffmpeg(m3u8Url)
      .audioCodec("libmp3lame")
      .format("wav")
      .on("end", async () => {
        try {
          const audioBuffer = await fs.readFile(tempFilePath);
          await fs.unlink(tempFilePath);
          resolve(audioBuffer);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err);
        reject(err);
      });

    ffmpegProcess.save(tempFilePath);
  });
}

export async function getPinterest({ url }: { url: string }): Promise<socialMediaResult> {
  const { videoUrl, audioUrl } = await getPinterestMedia(url);

  let audioBlob: Blob | null = null;
  if (audioUrl) {
    audioBlob = new Blob([await convertM3U8ToMP3Blob(audioUrl)], { type: "audio/wav" });
  }
  if (!audioBlob) throw new Error("No audio found");
  return {
    blob: audioBlob,
    thumbnail: "",
    description: "",
  };
}