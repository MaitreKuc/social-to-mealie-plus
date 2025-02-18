import type { envTypes } from '@//lib/types';

export const env: envTypes = {
  OPENAI_URL: process.env.OPENAI_URL?.trim().replace(/\/+$/, '') as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim() as string,
  WHISPER_MODEL: process.env.WHISPER_MODEL?.trim() as string,
  MEALIE_URL: process.env.MEALIE_URL?.trim().replace(/\/+$/, '') as string,
  MEALIE_API_KEY: process.env.MEALIE_API_KEY?.trim().replace(/\n/g, '') as string,
};
