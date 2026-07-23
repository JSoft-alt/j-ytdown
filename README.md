# J-YTDown

A clean, ad-free media resolver UI built with Next.js, Tailwind, and a pluggable resolver API.

## Important

Only download media you own or are authorized to download. You are responsible for ensuring use of this app complies with platform terms, copyright law, and local regulation. This project deliberately does not include a hosted extraction service or bypass controls.

## Local setup

1. Copy `.env.example` to `.env.local` and set `RESOLVER_BASE_URL` to an authorized, self-hosted Cobalt-compatible resolver.
2. Run `npm install`.
3. Run `npm run dev`.

The resolver must accept a JSON `POST /` request with `url`, `downloadMode`, `audioFormat`, `audioBitrate`, `videoQuality`, and `youtubeVideoCodecPreference`, and return a Cobalt-style response containing `status`, `url`, `filename`, and optionally `audioStream`/`picker`.

## Deploy to Vercel

Import the GitHub repository in Vercel, add `RESOLVER_BASE_URL` (and optional `RESOLVER_API_TOKEN`) under Environment Variables, then deploy. The Vercel function proxies the resolver so credentials are never exposed to the browser.
