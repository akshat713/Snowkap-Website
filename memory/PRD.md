# Snowkap — Product Requirements Document

## Original Problem Statement
"I want to create a website for my product and services, with top notch animation and workflow. I have built this prototype (Snowkap ESG intelligence), use the same as reference for redevelopment, and enhance the same." — plus: award-worthy Awwwards-level motion, framer-motion + lenis, kinetic hero, marquee, parallax.

## What Snowkap Is
An ESG Intelligence platform for global supply chains: Advisory + AI-powered ESG platform + globally embedded managed-support team. Turns hard-to-reach suppliers into verified, audit-ready data across CBAM, CSRD, BRSR, SGX, ISSB, GRI, IFRS, EUDR.

## User Choices (from requirements gathering)
- Lead forms: save to DB + email notifications (Resend) + admin dashboard.
- Resources: full CMS (admin CRUD).
- Design: full redesign (award-worthy, dark, kinetic).
- Dossier + programme selections: saved to backend.
- New features requested: CBAM calculator (lead magnet), "Power of Now" newsletter with role-based (CFO/COO/Sustainability) targeting.

## Architecture
- Frontend: React 19, react-router-dom, framer-motion, lenis (smooth scroll), @number-flow/react (counters), tailwind, shadcn primitives, sonner toasts.
- Backend: FastAPI, Motor/MongoDB, JWT (Bearer, localStorage), bcrypt, Emergent managed Resend email proxy.
- Design system: dark #060608, signal green #00E599, Cabinet Grotesk / Manrope / JetBrains Mono.

## Personas
- CFO/Finance — cost/exposure (CBAM calculator, ROI).
- COO/Operations — supply-chain data & activation.
- Head of Sustainability — frameworks, ratings, roadmap.
- Admin — manages leads, subscribers, proposals, content.

## Implemented (2026-07-27)
- Award-worthy home page: kinetic masked hero + SVG supply-chain globe with parallax, ticker marquee, dossier questionnaire, regulatory reality bento, three pillars, sector explorer, CBAM calculator, animated proof counters, programme builder + slide-out tray, testimonials, standards, Power of Now newsletter, final CTA.
- CBAM Exposure Calculator (lead magnet): sector factors, live compute, email-report capture -> saves lead + emails user & internal.
- "Power of Now" newsletter with role selection -> saved + welcome email.
- Dossier: 4-step questionnaire -> recommends package, saved to backend.
- Programme builder: packages + line-item add-ons -> tray -> scoped proposal request (saved + emails).
- Lead-capture modals (advisor, whitepaper, event, webinar) -> saved + emails.
- Resources CMS: seeded 14 items (blog/whitepaper/press/event/webinar); public pages + admin CRUD.
- Pages: /, /pricing, /customers, /resources, /resources/:slug, /admin/login, /admin.
- Admin dashboard: overview stats, leads, proposals, subscribers, content CRUD (JWT-protected).
- Verified: 28/28 backend pytest, all frontend flows 100%, emails deliver (202).

## Backlog / Next
- P1: Multi-language DE/EN toggle (prototype had EN/DE); live CBAM certificate price feed; whitepaper PDF gated downloads (actual files via object storage).
- P1: Admin edit (PUT) UI for resources (delete + create exist; edit endpoint exists, UI pending).
- P2: Dossier-driven personalization across sections; shareable proposal link; lead status workflow in admin.
- P2: Impressum/legal page; cookie consent; SEO meta per page.

## Credentials
- Admin: admin@snowkap.com / Snowkap@2026 (see /app/memory/test_credentials.md)
