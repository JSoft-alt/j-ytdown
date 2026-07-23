import { DownloadRequest, MediaItem } from "./types";
import { parseYouTubeUrl } from "./youtube";

type ServiceResponse = { id: string; title: string; channel: string; thumbnail: string; duration?: number; filename: string; downloadUrl: string; estimatedSize?: string };

export class DownloadServiceError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export async function requestDownload(input: DownloadRequest): Promise<MediaItem> {
  const parsed = parseYouTubeUrl(input.url);
  if (!parsed.valid || !parsed.normalized || !parsed.videoId) throw new DownloadServiceError("Enter a valid YouTube video URL.", 400);
  const serviceUrl = process.env.YTDLP_SERVICE_URL?.replace(/\/$/, "");
  const serviceToken = process.env.YTDLP_SERVICE_TOKEN;
  if (!serviceUrl?.startsWith("https://") || !serviceToken) throw new DownloadServiceError("Downloads are not configured yet. Add yt-dlp service variables in Vercel.", 503);
  const response = await fetch(`${serviceUrl}/downloads`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceToken}` },
      body: JSON.stringify({ url: parsed.normalized, format: input.format, quality: input.quality }),
      cache: "no-store", signal: AbortSignal.timeout(25_000),
  });
  if (response.status === 429) throw new DownloadServiceError("The download service is busy. Please try again shortly.", 429);
  if (!response.ok) throw new DownloadServiceError("Could not prepare this download. Try again or choose another item.", 502);
  const data = await response.json() as ServiceResponse;
  if (!data.downloadUrl) throw new DownloadServiceError("The download service did not return a file.", 422);
  return { ...data, sourceUrl: parsed.normalized, format: input.format, quality: input.quality };
}
