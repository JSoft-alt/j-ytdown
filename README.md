# J-YTDown

A clean, ad-free media download UI built with Next.js and a private yt-dlp + FFmpeg service.

## Important

Only download media you own or are authorized to download. You are responsible for ensuring use of this app complies with platform terms, copyright law, and local regulation. This project deliberately does not include a hosted extraction service or bypass controls.

## Local setup

1. Deploy `services/ytdlp` to a container platform and set its public HTTPS URL as `YTDLP_SERVICE_URL`.
2. Set the same strong random value for `YTDLP_SERVICE_TOKEN` in both services.
2. Run `npm install`.
3. Run `npm run dev`.

The included service accepts validated YouTube URLs, creates short-lived signed download links, and streams yt-dlp/FFmpeg output. It does not expose arbitrary command execution or persist user data.

## Deploy to Vercel

Import the GitHub repository in Vercel, add `YTDLP_SERVICE_URL` and `YTDLP_SERVICE_TOKEN` under Environment Variables, then deploy. The Vercel API validates requests and keeps the service token off the client.
