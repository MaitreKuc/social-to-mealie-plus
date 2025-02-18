import OpenAI from 'openai';
import { env } from './constants';

export async function getTranscription(blob: Blob) {
  const ai = new OpenAI({
    baseURL: env.OPENAI_URL,
    apiKey: env.OPENAI_API_KEY,
  });
  const file = new File([blob], 'audio.wav', { type: blob.type });
  const transcription = await ai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });
  return transcription.text;
}
