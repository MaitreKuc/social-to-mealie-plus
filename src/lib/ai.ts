import { env } from './constants';

export async function getTranscription(blob: Blob) {
  try {
    if (!env.WHISPER_MODEL) {
      throw new Error('WHISPER_MODEL is not set');
    }

    const formData = new FormData();
    const file = new File([blob], 'audio.wav', { type: blob.type });
    formData.append('file', file);
    formData.append('model', env.WHISPER_MODEL);

    const response = await fetch(`${env.OPENAI_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const transcription = await response.json();
    return transcription.text;
  } catch (error) {
    console.error('Error in getTranscription:', error);
    throw new Error('Failed to transcribe audio');
  }
}
