import base64, hashlib, hmac, json, os, re, subprocess, time
from urllib.parse import urlparse
from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import yt_dlp

app = FastAPI(docs_url=None, redoc_url=None)
SECRET = os.environ.get("YTDLP_SERVICE_TOKEN", "")
PUBLIC_URL = os.environ.get("PUBLIC_URL", "").rstrip("/")
HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com", "youtu.be"}

class DownloadRequest(BaseModel):
    url: str
    format: str
    quality: str

def valid_url(value: str) -> bool:
    try:
        url = urlparse(value)
        return url.scheme == "https" and url.hostname in HOSTS
    except ValueError:
        return False

def require_auth(authorization: str | None):
    if not SECRET or not hmac.compare_digest(authorization or "", f"Bearer {SECRET}"):
        raise HTTPException(401, "Unauthorized")

def encode(payload: dict) -> str:
    raw = base64.urlsafe_b64encode(json.dumps(payload, separators=(",", ":")).encode()).decode().rstrip("=")
    signature = hmac.new(SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
    return f"{raw}.{signature}"

def decode(token: str) -> dict:
    try:
        raw, signature = token.split(".", 1)
        expected = hmac.new(SECRET.encode(), raw.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected): raise ValueError
        payload = json.loads(base64.urlsafe_b64decode(raw + "=" * (-len(raw) % 4)))
        if payload["exp"] < time.time() or not valid_url(payload["url"]): raise ValueError
        return payload
    except Exception as error:
        raise HTTPException(403, "Invalid or expired download link") from error

@app.post("/downloads")
def prepare_download(request: DownloadRequest, authorization: str | None = Header(default=None)):
    require_auth(authorization)
    if not PUBLIC_URL.startswith("https://"):
        raise HTTPException(503, "Download service public URL is not configured")
    if not valid_url(request.url) or request.format not in {"mp4", "mp3", "m4a"} or request.quality not in {"best", "1080", "720", "480"}:
        raise HTTPException(400, "Invalid download request")
    try:
        with yt_dlp.YoutubeDL({"quiet": True, "no_warnings": True, "noplaylist": True, "socket_timeout": 15}) as ydl:
            info = ydl.extract_info(request.url, download=False)
    except Exception as error:
        raise HTTPException(422, "Unable to read this media") from error
    token = encode({"url": request.url, "format": request.format, "quality": request.quality, "exp": int(time.time()) + 300})
    video_id = str(info.get("id", "media"))
    return {"id": video_id, "title": info.get("title", "Ready to download"), "channel": info.get("channel") or info.get("uploader") or "YouTube", "thumbnail": info.get("thumbnail") or "", "duration": info.get("duration"), "filename": f"{video_id}.{request.format}", "downloadUrl": f"{PUBLIC_URL}/downloads/stream?token={token}", "estimatedSize": None}

@app.get("/downloads/stream")
def stream_download(token: str):
    item = decode(token)
    quality = "best" if item["quality"] == "best" else item["quality"]
    if item["format"] == "mp4":
        selector = "bv*+ba/b" if quality == "best" else f"bv*[height<={quality}]+ba/b[height<={quality}]"
        command = ["yt-dlp", "--no-playlist", "--quiet", "--no-warnings", "-f", selector, "--merge-output-format", "mp4", "-o", "-", item["url"]]
        media_type = "video/mp4"
    else:
        command = ["yt-dlp", "--no-playlist", "--quiet", "--no-warnings", "-f", "bestaudio/best", "-x", "--audio-format", item["format"], "-o", "-", item["url"]]
        media_type = "audio/mpeg" if item["format"] == "mp3" else "audio/mp4"
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    def output():
        try:
            while chunk := process.stdout.read(64 * 1024): yield chunk
        finally:
            if process.poll() is None: process.kill()
    return StreamingResponse(output(), media_type=media_type, headers={"Content-Disposition": f'attachment; filename="download.{item["format"]}"', "Cache-Control": "no-store"})
