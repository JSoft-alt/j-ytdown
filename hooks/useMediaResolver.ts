"use client";

import { useCallback, useState } from "react";
import { MediaItem, ResolveRequest, ResolveResponse } from "@/lib/types";

export function useMediaResolver() {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolve = useCallback(async (request: ResolveRequest): Promise<MediaItem | null> => {
    setIsResolving(true); setError(null);
    try {
      const response = await fetch("/api/resolve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
      const body = await response.json() as ResolveResponse & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Unable to resolve media.");
      return body.item;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to resolve media."); return null; }
    finally { setIsResolving(false); }
  }, []);
  return { resolve, isResolving, error, clearError: () => setError(null) };
}
