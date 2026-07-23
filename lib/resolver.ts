import { MediaItem, ResolveRequest } from "./types";
import { parseYouTubeUrl } from "./youtube";

type CobaltResponse = { status?: string; url?: string; filename?: string; audioStream?: { url?: string }; picker?: Array<{ url?: string; type?: string }> };

export class ResolverError extends Error {
  constructor(message: string, public status = 502) { super(message); }
}

export async function resolveMedia(input: ResolveRequest): Promise<MediaItem> {
  const parsed = parseYouTubeUrl(input.url);
  if (!parsed.valid || !parsed.normalized || !parsed.videoId) throw new ResolverError("Enter a valid YouTube video URL.", 400);
  const baseUrl = process.env.RESOLVER_BASE_URL?.replace(/\/$/, "");
  if (!baseUrl) throw new ResolverError("Media resolver is not configured. Add RESOLVER_BASE_URL in Vercel.", 503);

  const [response, metadataResponse] = await Promise.all([
    fetch(`${baseUrl}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(process.env.RESOLVER_API_TOKEN ? { Authorization: `Bearer ${process.env.RESOLVER_API_TOKEN}` } : {}) },
    body: JSON.stringify({
      url: parsed.normalized,
      downloadMode: input.format === "mp4" ? "auto" : "audio",
      audioFormat: input.format === "mp3" ? "mp3" : "m4a",
      audioBitrate: "320",
      videoQuality: input.quality === "best" ? "max" : input.quality,
      youtubeVideoCodecPreference: "h264",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(25_000),
    }),
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(parsed.normalized)}&format=json`, { cache: "no-store", signal: AbortSignal.timeout(8_000) }),
  ]);
  if (response.status === 429) throw new ResolverError("The media resolver is busy. Please try again shortly.", 429);
  if (!response.ok) throw new ResolverError("Could not resolve this media. Try again or choose another item.", 502);
  const data = await response.json() as CobaltResponse;
  const metadata = metadataResponse.ok ? await metadataResponse.json() as { title?: string; author_name?: string; thumbnail_url?: string } : undefined;
  const url = data.url ?? data.audioStream?.url ?? data.picker?.find((stream) => stream.type === "video")?.url;
  if (!url || data.status === "error") throw new ResolverError("No downloadable stream was returned for this item.", 422);
  return {
    id: parsed.videoId, sourceUrl: parsed.normalized, title: metadata?.title ?? "Ready to download", channel: metadata?.author_name ?? "YouTube", thumbnail: metadata?.thumbnail_url ?? `https://i.ytimg.com/vi/${parsed.videoId}/hqdefault.jpg`,
    filename: data.filename ?? `youtube-${parsed.videoId}.${input.format}`, downloadUrl: url, format: input.format, quality: input.quality,
  };
}
