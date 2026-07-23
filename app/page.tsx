"use client";

import { useState } from "react";
import { ArrowDownToLine, ShieldCheck, Sparkles } from "lucide-react";
import { BatchQueue } from "@/components/BatchQueue";
import { QualitySelector } from "@/components/QualitySelector";
import { PreviewSkeleton, VideoPreviewCard } from "@/components/VideoPreviewCard";
import { UrlInput } from "@/components/UrlInput";
import { useMediaDownload } from "@/hooks/useMediaDownload";
import { MediaFormat, MediaItem, Quality } from "@/lib/types";
import { parseYouTubeUrl } from "@/lib/youtube";

export default function Home() {
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<MediaFormat>("mp4");
  const [quality, setQuality] = useState<Quality>("best");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [queue, setQueue] = useState<MediaItem[]>([]);
  const { download, isPreparing, error, clearError } = useMediaDownload();
  async function submit() {
    const parsed = parseYouTubeUrl(url);
    if (!parsed.valid) { clearError(); setPreview(null); return; }
    const item = await download({ url, format, quality });
    if (item) { setPreview(item); setQueue((current) => [...current, item]); }
  }
  function downloadItem(item: MediaItem) { window.open(item.downloadUrl, "_blank", "noopener,noreferrer"); }
  return <main className="mx-auto min-h-screen max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
    <header className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage-600 text-white shadow-soft"><ArrowDownToLine className="h-5 w-5" /></span><span className="text-lg font-extrabold tracking-tight">J-YTDown</span></div><span className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-sage-700 shadow-soft sm:flex"><ShieldCheck className="h-4 w-4" />No ads. No popups.</span></header>
    <section className="mx-auto mt-20 max-w-3xl text-center sm:mt-28"><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-sage-100 px-4 py-2 text-xs font-bold text-sage-700"><Sparkles className="h-3.5 w-3.5" />Clean media, on your terms</div><h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-6xl">A calmer way to save your media.</h1><p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">Paste a link, choose your format, and download content you own or are authorized to save.</p></section>
    <section className="mx-auto mt-10 max-w-3xl"><UrlInput value={url} onChange={(value) => { setUrl(value); clearError(); }} onSubmit={submit} loading={isPreparing} /><div className="mt-4"><QualitySelector format={format} quality={quality} onFormat={setFormat} onQuality={setQuality} /></div>{error && <p role="alert" className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}{!isPreparing && !error && url && !parseYouTubeUrl(url).valid && <p className="mt-3 px-3 text-sm text-rose-700">Enter a valid YouTube video URL to continue.</p>}</section>
    <section className="mx-auto mt-8 max-w-3xl">{isPreparing && <PreviewSkeleton />}{preview && !isPreparing && <VideoPreviewCard item={preview} onDownload={() => downloadItem(preview)} />}</section>
    <div className="mx-auto max-w-3xl"><BatchQueue items={queue} onDownload={downloadItem} onRemove={(index) => setQueue((items) => items.filter((_, itemIndex) => itemIndex !== index))} /></div>
    <footer className="mx-auto mt-20 max-w-3xl text-center text-xs leading-5 text-slate-500">Use only for media you own or have permission to download. Respect platform terms and local copyright law.</footer>
  </main>;
}
