"use client";

import { MediaFormat, Quality } from "@/lib/types";
import { Music2, Video } from "lucide-react";
type Props = { format: MediaFormat; quality: Quality; onFormat: (value: MediaFormat) => void; onQuality: (value: Quality) => void };
export function QualitySelector({ format, quality, onFormat, onQuality }: Props) {
  return <div className="grid gap-3 sm:grid-cols-2">
    <label className="rounded-2xl bg-sage-50/70 p-4 text-sm font-medium text-slate-600">Format
      <span className="mt-2 flex items-center gap-2"><span className="rounded-xl bg-white p-2 text-sage-600">{format === "mp4" ? <Video className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}</span><select value={format} onChange={(e) => onFormat(e.target.value as MediaFormat)} className="w-full bg-transparent font-semibold text-ink outline-none"><option value="mp4">MP4 video</option><option value="mp3">MP3 audio</option><option value="m4a">M4A audio</option></select></span>
    </label>
    <label className="rounded-2xl bg-sage-50/70 p-4 text-sm font-medium text-slate-600">Quality
      <select value={quality} onChange={(e) => onQuality(e.target.value as Quality)} className="mt-3 w-full bg-transparent font-semibold text-ink outline-none"><option value="best">Best available</option><option value="1080">1080p</option><option value="720">720p</option><option value="480">480p</option></select>
    </label>
  </div>;
}
