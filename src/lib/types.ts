export type recipeInfo = {
  postURL: string;
  transcription: string;
  thumbnail: string;
  description: string;
};

export type envTypes = {
  OPENAI_URL: string;
  OPENAI_API_KEY: string;
  WHISPER_MODEL: string;
  MEALIE_URL: string;
  MEALIE_API_KEY: string;
};

export type recipeResult = {
  name: string;
  description: string;
  imageUrl: string;
  url: string;
}
