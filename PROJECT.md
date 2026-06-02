# Cashbackkollen Project Status

## Overview

Cashbackkollen is a Swedish cashback information site focused on guides, reviews, stores and campaigns.

The goal is to build a fact-based resource before adding advanced features, comparisons and monetization.

## Current Status

### Infrastructure

- Domain configured
- GitHub repository active
- Netlify connected
- Next.js project running

### Site Structure

Routes currently available:

- /
- /guider
- /guider/vad-ar-cashback
- /butiker
- /recensioner
- /kampanjer
- /om-oss

### Content

Created:

- content/vad-ar-cashback.md
- content/hur-fungerar-cashback.md

Planned:

- content/ar-cashback-sakert.md
- content/hur-tjanar-cashback-sidor-pengar.md
- content/varfor-registreras-inte-min-cashback.md

## Technical Notes

Development mode:

- npm run dev causes severe performance issues on this Debian Trixie workstation.
- npm run build && npm run start works normally.
- Issue appears environment-specific and not related to Cashbackkollen application code.

Production mode:

- npm run build
- npm run start

Production mode works correctly and is currently recommended for testing.

## Decisions

- Focus on factual and evergreen cashback content first.
- Build the guide cluster before reviews and comparisons.
- Avoid hype, speculation and unsupported claims.
- Use production mode for local testing until the development-mode issue is resolved.

## Next Priorities

1. Review site from user perspective
2. Improve navigation and user flow
3. Decide how content should be connected to pages
4. Continue building guide cluster
5. Build review and store sections

