import ffmpeg from 'fluent-ffmpeg';

export function getVideoThumbnail(blob: Blob): string {
  try {
    const videoUrl = URL.createObjectURL(blob);

    ffmpeg(videoUrl)
      .screenshots({
        count: 1,
        filename: 'thumbnail.png',
        folder: '.',
      });

    URL.revokeObjectURL(videoUrl);
    return 'thumbnail.png';
  } catch (err) {
    console.error('Error generating thumbnail:', err);
    throw err;
  }
}