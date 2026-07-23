"use client";

import { useState } from "react";
import { ArrowDownToLine, Check, ChevronRight, CircleHelp, LockKeyhole, ShieldCheck, Sparkles, Zap } from "lucide-react";
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
  return <main id="top" className="mx-auto min-h-screen max-w-6xl px-5 py-6 sm:px-8 sm:py-9">
    <header className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-sage-600 text-white shadow-soft"><ArrowDownToLine className="h-5 w-5" /></span><span className="text-lg font-extrabold tracking-tight">J<span className="text-sage-600">Down</span></span></div><div className="flex items-center gap-3"><a href="#how-it-works" className="hidden text-sm font-semibold text-slate-500 transition hover:text-ink sm:block">How it works</a><span className="hidden items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-sage-700 shadow-soft md:flex"><ShieldCheck className="h-4 w-4" />No ads. No popups.</span></div></header>
    <section className="relative mx-auto mt-16 max-w-4xl text-center sm:mt-24"><div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-sage-200/40 blur-3xl" /><div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-sage-700 shadow-soft"><Sparkles className="h-3.5 w-3.5" />The clean download desk</div><h1 className="text-4xl font-extrabold tracking-[-.045em] text-ink sm:text-6xl lg:text-7xl">Download without the<br className="hidden sm:block" /> internet <span className="text-sage-600">circus.</span></h1><p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">A beautifully simple workspace for saving media you own or are authorized to download. No bait, banners, or confusing steps.</p></section>
    <section className="mx-auto mt-10 max-w-3xl rounded-[2rem] bg-white/70 p-3 shadow-float backdrop-blur-sm sm:p-5"><UrlInput value={url} onChange={(value) => { setUrl(value); clearError(); }} onSubmit={submit} loading={isPreparing} /><div className="mt-4"><QualitySelector format={format} quality={quality} onFormat={setFormat} onQuality={setQuality} /></div>{error && <p role="alert" className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}{!isPreparing && !error && url && !parseYouTubeUrl(url).valid && <p className="mt-3 px-3 text-sm text-rose-700">Enter a valid YouTube video URL to continue.</p>}<div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 px-2 pb-1 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-sage-600" />MP4, MP3 &amp; M4A</span><span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-sage-600" />Up to 1080p</span><span className="inline-flex items-center gap-1.5"><LockKeyhole className="h-3.5 w-3.5 text-sage-600" />Private by design</span></div></section>
    <section className="mx-auto mt-8 max-w-3xl">{isPreparing && <PreviewSkeleton />}{preview && !isPreparing && <VideoPreviewCard item={preview} onDownload={() => downloadItem(preview)} />}</section>
    <div className="mx-auto max-w-3xl"><BatchQueue items={queue} onDownload={downloadItem} onRemove={(index) => setQueue((items) => items.filter((_, itemIndex) => itemIndex !== index))} /></div>
    <section id="how-it-works" className="mx-auto mt-24 max-w-5xl"><div className="text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-sage-600">Built for calm</p><h2 className="mt-3 text-3xl font-extrabold tracking-tight">Everything you need. Nothing you don’t.</h2></div><div className="mt-10 grid gap-4 md:grid-cols-3"><Feature icon={<Zap />} number="01" title="Paste a link" text="Drop in a supported link and we’ll prepare it in a clean, focused workspace." /><Feature icon={<CircleHelp />} number="02" title="Choose your format" text="Pick video or audio, select a quality, then review the details before saving." /><Feature icon={<ShieldCheck />} number="03" title="Download with confidence" text="No ad overlays or surprise redirects—just your file, ready when you are." /></div></section>
    <section className="mx-auto mt-20 flex max-w-5xl flex-col items-center justify-between gap-4 rounded-3xl bg-sage-700 px-6 py-7 text-center text-white sm:flex-row sm:text-left"><div><p className="text-lg font-bold">Made for media you’re allowed to keep.</p><p className="mt-1 text-sm text-sage-100">Respect platform terms, copyright, and creators.</p></div><a href="#top" className="inline-flex items-center gap-1 text-sm font-bold text-white">Back to top <ChevronRight className="h-4 w-4" /></a></section>
    <footer className="mx-auto mt-10 max-w-5xl pb-3 text-center text-xs leading-5 text-slate-500">© {new Date().getFullYear()} JDown. A clean media workspace.</footer>
  </main>;
}

function Feature({ icon, number, title, text }: { icon: React.ReactNode; number: string; title: string; text: string }) {
  return <article className="rounded-3xl bg-white p-6 text-left shadow-soft"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-sage-100 text-sage-700">{icon}</span><span className="text-xs font-black tracking-widest text-sage-300">{number}</span></div><h3 className="mt-6 text-lg font-bold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>;
}
