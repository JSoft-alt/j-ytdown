"use client";

import { CheckCircle2, Download, Trash2 } from "lucide-react";
import { MediaItem } from "@/lib/types";
export function BatchQueue({ items, onDownload, onRemove }: { items: MediaItem[]; onDownload: (item: MediaItem) => void; onRemove: (index: number) => void }) {
  if (!items.length) return null;
  return <section className="mt-10"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold">Download queue</h2><span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-bold text-sage-700">{items.length} item{items.length > 1 ? "s" : ""}</span></div><div className="space-y-3">{items.map((item, index) => <div key={`${item.id}-${index}`} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft"><CheckCircle2 className="h-5 w-5 shrink-0 text-sage-500" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-slate-500">{item.format.toUpperCase()} · {item.quality === "best" ? "Best" : `${item.quality}p`}</p></div><button onClick={() => onDownload(item)} className="rounded-xl bg-sage-50 p-2.5 text-sage-700" aria-label={`Download ${item.title}`}><Download className="h-4 w-4" /></button><button onClick={() => onRemove(index)} className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-50" aria-label={`Remove ${item.title}`}><Trash2 className="h-4 w-4" /></button></div>)}</div></section>;
}
