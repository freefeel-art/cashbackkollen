# Cashbackkollen Project Status

## Overview

Cashbackkollen is a Swedish information site focused on cashback, affiliate marketing, online shopping, reviews, stores and campaigns.

The goal is to build a fact-based, evergreen resource before adding advanced features, comparisons and monetization.

---

## Infrastructure

Completed:

* Domain configured
* GitHub repository active
* Netlify connected
* Next.js 16 running
* Tailwind CSS configured

Development notes:

* `npm run dev` causes severe performance issues on the Debian Trixie workstation.
* `npm run build && npm run start` works correctly and is currently the recommended local workflow.

---

## Site Structure

Current routes:

* /
* /guider
* /guider/[slug]
* /butiker
* /recensioner
* /kampanjer
* /om-oss

Guide pages are now generated dynamically from markdown files.

---

## Content System

Implemented:

* Markdown content stored in `/content`
* Dynamic guide system using `/app/guider/[slug]/page.tsx`
* Shared guide utilities in `/lib/guides.ts`
* React Markdown rendering enabled

Architecture:

content/*.md
↓
lib/guides.ts
↓
app/guider/[slug]/page.tsx
↓
Static guide pages

Adding a new guide now only requires:

1. Create a new markdown file in `/content`
2. Add a link from `/guider`
3. Build and deploy

---

## Completed Content Cluster

### Cashback Basics

Published:

* vad-ar-cashback.md
* hur-fungerar-cashback.md
* ar-cashback-sakert.md
* hur-tjanar-cashback-sidor-pengar.md
* varfor-registreras-inte-min-cashback.md

Status:

* Content completed
* Dynamic rendering completed
* Routes completed

---

## Technical Milestones

Completed:

* Static route structure
* Dynamic markdown guide system
* Shared guide template
* React Markdown integration
* Production build verification
* GitHub deployment workflow

Important commit:

Implement dynamic markdown guide system

This commit replaced multiple guide page implementations with a single dynamic markdown-based system.

---

## Current Project State

Git status:

* Working tree clean
* All changes pushed to GitHub
* Main branch up to date

Current focus has shifted from infrastructure to content production.

---

## Next Content Cluster

### Affiliate Marketing

Planned cornerstone article:

* vad-ar-affiliate-marknadsforing.md

Planned supporting guides:

* Hur fungerar affiliate-länkar?
* Vad är ett affiliate-nätverk?
* Hur tjänar affiliates pengar?
* Affiliate-marknadsföring vs cashback

Reason:

Current cashback guides frequently reference affiliate marketing, but no dedicated explanation exists yet.

---

## Next Priorities

1. Create vad-ar-affiliate-marknadsforing.md
2. Build Affiliate Marketing content cluster
3. Improve guide index page
4. Build Reviews section
5. Build Stores section
6. Build Campaigns section

---

## Guiding Principles

* Focus on factual information
* Avoid hype and unsupported claims
* Prefer evergreen content
* Build topic clusters instead of isolated articles
* Keep architecture simple
* Use markdown as the primary content source
