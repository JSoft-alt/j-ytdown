export type MediaFormat = "mp4" | "mp3" | "m4a";
export type Quality = "1080" | "720" | "480" | "best";

export type DownloadRequest = { url: string; format: MediaFormat; quality: Quality };
export type MediaItem = {
  id: string;
  sourceUrl: string;
  title: string;
  channel: string;
  thumbnail: string;
  duration?: number;
  filename: string;
  downloadUrl: string;
  format: MediaFormat;
  quality: Quality;
  estimatedSize?: string;
};

export type DownloadResponse = { item: MediaItem };
