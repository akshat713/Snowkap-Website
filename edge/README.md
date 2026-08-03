# Ask Snowkap AI — chat endpoint

A ~250-line Cloudflare Worker whose entire job is to hold the Anthropic API key
and forward one stream.

## Why it exists

The site is static. GitHub Actions builds it and GitHub Pages serves it, so there
is nowhere in it to keep a key — anything in the bundle is readable with View
Source, and an Anthropic key is a payment credential. The repo does have a FastAPI
backend that implements the same endpoint, but that one also owns leads, dossiers,
the admin dashboard and the resource library, and it needs MongoDB. That is a lot
of infrastructure to stand up when the only thing missing is somewhere to keep one
secret.

Use this worker if you want the assistant working with the least moving parts. Use
`backend/server.py` instead if you want chat transcripts and chat-sourced leads in
Mongo alongside everything else — both read the same prompt from
`shared/chat-system-prompt.md`, so they answer identically.

## Deploy

From `edge/`:

```bash
npm install
npx wrangler login                      # opens a browser once
npm run secret                           # paste the key at the prompt
npm run deploy
```

`npm run secret` runs `wrangler secret put ANTHROPIC_API_KEY`. Secrets are
encrypted at rest and are never written to `wrangler.toml`, which is committed.
**Do not put the key in `[vars]`** — that section is plaintext.

Deploy prints a URL like `https://snowkap-chat.<subdomain>.workers.dev`. Check it:

```bash
curl https://snowkap-chat.<subdomain>.workers.dev/api
# {"service":"snowkap-chat","ok":true}
```

## Point the site at it

In `frontend/.env`:

```
REACT_APP_BACKEND_URL=https://snowkap-chat.<subdomain>.workers.dev
```

That is the only frontend change. `ChatWidget` already prefers the backend when it
is reachable and falls back to the knowledge base compiled into the bundle when it
is not, so nothing else needs touching.

Note that `frontend/.env` is committed — it holds only `REACT_APP_*` values, all
of which reach the browser anyway. Never put a secret in it.

If you serve the site from a domain other than `akshat713.github.io`, add it to
`CORS_ORIGINS` in `wrangler.toml` and redeploy. The widget's requests are
preflighted, so a missing origin means the browser blocks the answer before it is
read.

## What it costs

Haiku 4.5 at $1 / $5 per million tokens. The system prompt is ~2,300 tokens and
carries a cache breakpoint, so repeat calls within the cache window read it at a
tenth of the input price rather than paying full freight each time. A typical
answer is 100–200 output tokens. At a hundred conversations a day of five messages
each you are in low single-digit dollars a month.

The hard ceiling on spend is the credit balance on the Anthropic account, which is
where it belongs. The worker's own rate limits — 8 messages a minute and 60 an
hour per session — are per-isolate and therefore best-effort; Cloudflare may run
several isolates, so a determined caller gets a multiple of those allowances. If
the endpoint ever attracts real abuse, move the counter into a Durable Object or
KV. For a marketing widget that would be premature.

## Endpoints

| Method | Path | Returns |
|---|---|---|
| `POST` | `/api/chat/stream` | SSE — `data: {"delta":"…"}` frames, then `data: [DONE]` |
| `GET` | `/api/chat/history/:sid` | `[]` — the widget asks on open; a stateless worker has no transcript |
| `GET` | `/api` | `{"service":"snowkap-chat","ok":true}` |

`POST` body: `{session_id, message, context}`. `context` carries the visitor's
sector, region, stage, selected package, added services, current path and
language, all of it from the dossier and the programme tray. It is client-supplied
and treated as untrusted: every field is length-capped and rendered into a block
the model is told to read as data, never as instruction.

On failure the worker sends `{"error":"unavailable"}` and the widget answers from
the bundled knowledge base instead. Upstream error text is logged, never returned
— an Anthropic error can name the model, the account or the billing state, and
none of that belongs in a browser.

## Debugging

```bash
npm run tail        # live logs, including any upstream error body
```

`Your credit balance is too low` in the tail means the Anthropic account needs
credits — the key is fine, there is just nothing to spend. Add them under Plans &
Billing in the Anthropic console.
