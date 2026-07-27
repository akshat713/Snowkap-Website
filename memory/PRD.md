# Snowkap — Product Requirements Document

## Original Problem Statement
Complete end-to-end revamp of the Snowkap ESG website (snowkap.com). Snowkap = ESG intelligence company: AI-powered ESG/carbon platform + expert advisory + embedded managed support. User provided brand guide (Design Refinement Strategy), Corporate Deck, and Sales Deck, and reference sites: **cred.club (preferred)**, slice.bank.in, unitedcarriers.com, greenly.earth.

## Explicit User Requirements
- Site must primarily cover: product, services, profiles, clientele (real logos from Corporate Deck), FAQ, testimonials — then everything else.
- Team section showing chairman/CEO/director/team expertise (core team + advisory board).
- Crawl snowkap.com and embed all blogs, webinars, whitepapers, press.
- Sign In button top-right → https://login.snowkap.com (existing product login).
- CBAM Calculator is ONLY a lead magnet, not core positioning.
- Anthropic Chat Models integration → "Ask Snowkap AI" assistant using **Claude Opus 4.7 via Emergent Universal Key** (user chose this; may later supply own Anthropic key — swap key in backend/.env if provided).
- Respond to user in English.

## Brand (from Design Refinement Strategy deck)
- Black European premium feel (#050505 bg), orange accent #F05A22 ("NOW" in SNOWKAP wordmark is orange), "The Lens" circular motif, mono eyebrows, grotesque display type (Cabinet Grotesk), duotone nature imagery in circular masks.
- Narrative: "Data is messy. Sustainability's even messier." / "We are your lens for climate decisions." / "Turn climate complexity into business clarity." / "Clarity is our climate strategy." Vision: remove 1 billion tons CO₂e.

## Architecture
- React 19 + Tailwind + Framer Motion + Lenis (frontend, port 3000)
- FastAPI + Motor MongoDB (backend :8001, /api prefix), Resend email via Emergent proxy, JWT admin auth
- AI chat: emergentintegrations LlmChat, anthropic claude-opus-4-7, SSE streaming, sessions persisted in `chat_messages` collection, in-memory LlmChat dict (cap 500)

## Implemented (as of 2026-06 fork — full revamp complete, tested iteration_2: 35/35 backend, 100% frontend)
- **Home**: kinetic hero + lens + ticker, logo marquee (21 real client logos, white-processed in /assets/logos/white/), problem manifesto (5), 3 pillars sticky cards, platform showcase (6 modules w/ real product imgs /assets/product/), metrics counters, clientele by 6 sectors, 3 testimonials (JSW/Senco/Sutherland), team (6 core + 3 advisory, photos /assets/team/), orange CBAM band → /tools/cbam, FAQ accordion (8), resources preview, newsletter, final CTA.
- **Pages**: /platform (4 deep modules, outcomes, personas), /services (journey, advisory/managed/training), /about (narrative, mission band, full team, credentials), /contact (lead form + info), /tools/cbam (calculator lead magnet), /resources (+detail, external links to snowkap.com), /pricing, /customers, /admin (+login).
- **Nav**: Platform/Services/Customers/Resources/About + Sign In (login.snowkap.com, _blank) + Book a Demo modal.
- **Ask Snowkap AI**: floating widget, streaming SSE, suggestions, multi-turn session (localStorage sk_chat_session), history endpoint.
- **Resources CMS v3**: seeded 18 real items from snowkap.com (8 blogs, 4 whitepapers, 2 webinars, 3 press, 1 event) with external_url + image fields.
- Backend endpoints: auth (login/me/refresh/logout), leads, newsletter, proposals, dossier, resources CRUD (admin), cbam/calculate, chat/stream, chat/history, admin stats.

## Key Endpoints
POST /api/auth/login · GET /api/auth/me · POST /api/leads · POST /api/newsletter · POST /api/proposals · POST /api/dossier · GET /api/resources[?type=] · GET /api/resources/{slug} · POST /api/cbam/calculate · POST /api/chat/stream (SSE) · GET /api/chat/history/{sid}

## Backlog / Next
- P1: Restyle /pricing + /customers pages fully to new aesthetic (currently inherit new tokens but layout from V1).
- P1: Admin CMS fields for external_url/image on resources (backend supports; admin UI doesn't expose yet).
- P2: Split server.py (794 lines) into routers; rate-limit /api/chat/stream; chat lead capture (email ask inside widget).
- P2: Swap to user's own Anthropic API key if provided.
- P2: Case-study detail pages; careers page.

## Notes / Learnings
- extract_file_tool failed on user PDFs — use curl + pypdf/pymupdf locally instead. Client logos & team headshots were extracted from Corporate Deck PDF page 13/15 embedded images (mapping in /app/memory/snowkap_understanding.md).
- Do not assert hero text immediately — mask reveal animation ~1.5s.
- Resource seeds are versioned via db.meta {_id:"seed", resources_version:3}; bump version to force reseed.

## Testing
- iteration_1.json (V1 scaffold), iteration_2.json (revamp, all pass). Admin: see /app/memory/test_credentials.md.
