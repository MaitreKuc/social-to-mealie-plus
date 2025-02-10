import { t } from 'elysia';

export type recipeInfo = {
  postURL: string;
  transcription: string;
  thumbnail: string;
  description: string;
};

export const envElysia = {
  OPENAI_URL: t.String(),
  OPENAI_API_KEY: t.String(),
  WHISPER_MODEL: t.String(),
  MEALIE_URL: t.String(),
  MEALIE_API_KEY: t.String(),
};

export type envTypes = {
  OPENAI_URL: string;
  OPENAI_API_KEY: string;
  WHISPER_MODEL: string;
  MEALIE_URL: string;
  MEALIE_API_KEY: string;
};
