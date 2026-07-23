"use client";

import { ClipboardPaste, LoaderCircle, Search } from "lucide-react";
import { useState } from "react";

type Props = { value: string; onChange: (value: string) => void; onSubmit: () => void; loading: boolean };
export function UrlInput({ value, onChange, onSubmit, loading }: Props) {
  const [pasteError, setPasteError] = useState("");
  async function paste() {
    try { onChange(await navigator.clipboard.readText()); setPasteError(""); }
    catch { setPasteError("Paste permission is unavailable—paste your link manually."); }
  }
  return <div>
    <div className="flex items-center gap-2 rounded-3xl bg-white p-2 pl-5 shadow-float">
      <Search aria-hidden className="h-5 w-5 shrink-0 text-sage-500" />
      <input value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSubmit()} placeholder="Paste a YouTube link" aria-label="YouTube video URL" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 sm:text-base" />
      <button onClick={paste} type="button" className="hidden rounded-2xl p-3 text-sage-600 transition hover:bg-sage-50 sm:block" aria-label="Paste from clipboard"><ClipboardPaste className="h-5 w-5" /></button>
      <button onClick={onSubmit} disabled={loading || !value.trim()} className="inline-flex items-center gap-2 rounded-2xl bg-sage-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50">
        {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Get media"}
      </button>
    </div>
    {pasteError && <p className="mt-2 pl-4 text-xs text-slate-500">{pasteError}</p>}
  </div>;
}
