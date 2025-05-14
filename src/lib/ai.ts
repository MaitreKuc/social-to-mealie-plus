import OpenAI from 'openai';
import { env } from './constants';

export async function getTranscription(blob: Blob) {
  try {
    if (!process.env.WHISPER_MODEL) {
      throw new Error('WHISPER_MODEL is not set');
    }
    const ai = new OpenAI({
      baseURL: env.OPENAI_URL,
      apiKey: env.OPENAI_API_KEY,
    });
    const file = new File([blob], 'audio.wav', { type: blob.type });
    const transcription = await ai.audio.transcriptions.create({
      file,
      model: process.env.WHISPER_MODEL,
    });
    return transcription.text;
  } catch (error) {
    console.error('Error in getTranscription:', error);
    throw new Error('Failed to transcribe audio');
  }
}
