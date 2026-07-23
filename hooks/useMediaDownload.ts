"use client";

import { useCallback, useState } from "react";
import { DownloadRequest, DownloadResponse, MediaItem } from "@/lib/types";

export function useMediaDownload() {
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const download = useCallback(async (request: DownloadRequest): Promise<MediaItem | null> => {
    setIsPreparing(true); setError(null);
    try {
      const response = await fetch("/api/download", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
      const body = await response.json() as DownloadResponse & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to prepare download.");
      return body.item;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to prepare download."); return null; }
    finally { setIsPreparing(false); }
  }, []);
  return { download, isPreparing, error, clearError: () => setError(null) };
}
