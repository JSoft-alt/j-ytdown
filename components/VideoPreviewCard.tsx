"use client";

import Image from "next/image";
import { Download, ExternalLink, FileVideo } from "lucide-react";
import { MediaItem } from "@/lib/types";
import { formatDuration } from "@/lib/youtube";
export function VideoPreviewCard({ item, onDownload }: { item: MediaItem; onDownload: () => void }) {
  return <article className="overflow-hidden rounded-3xl bg-white p-3 shadow-float sm:p-5"><div className="grid gap-5 sm:grid-cols-[11rem_1fr]">
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-sage-100"><Image src={item.thumbnail} alt="" fill unoptimized sizes="(max-width: 640px) 100vw, 176px" className="object-cover" /></div>
    <div className="flex min-w-0 flex-col justify-between gap-5"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-sage-600">Ready</p><h2 className="truncate text-lg font-bold text-ink">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.channel} · {formatDuration(item.duration)}</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-700">{item.format.toUpperCase()}</span><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.quality === "best" ? "Best quality" : `${item.quality}p`}</span>{item.estimatedSize && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">~{item.estimatedSize}</span>}</div></div>
    <div className="flex gap-2"><button onClick={onDownload} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sage-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sage-700"><Download className="h-4 w-4" />Download</button><a href={item.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl bg-sage-50 p-3 text-sage-700" aria-label="Open source video"><ExternalLink className="h-5 w-5" /></a></div>
    </div></div></article>;
}

export function PreviewSkeleton() { return <div className="grid gap-5 rounded-3xl bg-white p-5 shadow-float sm:grid-cols-[11rem_1fr]"><div className="skeleton aspect-video rounded-2xl" /><div className="space-y-4 py-2"><div className="skeleton h-3 w-16 rounded" /><div className="skeleton h-6 w-3/4 rounded" /><div className="skeleton h-4 w-1/2 rounded" /><div className="skeleton h-12 w-full rounded-2xl" /></div></div>; }
