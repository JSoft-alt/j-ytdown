import { NextRequest, NextResponse } from "next/server";
import { requestDownload, DownloadServiceError } from "@/lib/download-service";
import { MediaFormat, Quality } from "@/lib/types";

export const runtime = "nodejs";
const formats: MediaFormat[] = ["mp4", "mp3", "m4a"];
const qualities: Quality[] = ["1080", "720", "480", "best"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: unknown; format?: unknown; quality?: unknown };
    if (typeof body.url !== "string" || !formats.includes(body.format as MediaFormat) || !qualities.includes(body.quality as Quality)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    return NextResponse.json({ item: await requestDownload({ url: body.url, format: body.format as MediaFormat, quality: body.quality as Quality }) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected download error.";
    return NextResponse.json({ error: message }, { status: error instanceof DownloadServiceError ? error.status : 500 });
  }
}
