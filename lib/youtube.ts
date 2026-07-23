const HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"]);

export function parseYouTubeUrl(value: string): { valid: boolean; normalized?: string; videoId?: string } {
  try {
    const url = new URL(value.trim());
    if (!HOSTS.has(url.hostname.toLowerCase())) return { valid: false };
    const id = url.hostname === "youtu.be" ? url.pathname.slice(1).split("/")[0] : url.searchParams.get("v") ?? url.pathname.match(/\/(?:shorts|embed|live)\/([^/?]+)/)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id)) return { valid: false };
    return { valid: true, videoId: id, normalized: `https://www.youtube.com/watch?v=${id}` };
  } catch { return { valid: false }; }
}

export function formatDuration(seconds?: number) {
  if (!seconds || !Number.isFinite(seconds)) return "—";
  const mins = Math.floor(seconds / 60);
  return `${Math.floor(mins / 60) ? `${Math.floor(mins / 60)}:` : ""}${String(mins % 60).padStart(2, "0")}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}
