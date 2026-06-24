# NewsNavigator — AI-Powered News Intelligence Briefings

> Turn any news article URL into a structured executive intelligence briefing in seconds, with timeline, entities, key stats, bullish/bearish perspectives, and interactive AI-powered Q&A.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo / Screenshots](#live-demo--screenshots)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Core Features](#core-features)
- [Data Flow & Implementation Details](#data-flow--implementation-details)
  - [Article Scraping Pipeline](#1-article-scraping-pipeline)
  - [AI Briefing Generation](#2-ai-briefing-generation)
  - [Streaming Chat Q&A](#3-streaming-chat-qa)
  - [Frontend Rendering](#4-frontend-rendering)
- [Backend: Supabase Edge Functions](#backend-supabase-edge-functions)
- [Frontend Components Deep Dive](#frontend-components-deep-dive)
- [State Management & Routing](#state-management--routing)
- [Design System](#design-system)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Deployment](#deployment)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)

---

## Overview

**NewsNavigator** is a full-stack, AI-powered news intelligence tool built on **React + Vite** (frontend) and **Supabase Edge Functions** (serverless backend). It allows users to:

1. **Paste any article URL** — the app scrapes the article content using the Firecrawl API and converts it to clean markdown.
2. **Get an AI-generated intelligence briefing** — powered by Google Gemini (via Lovable's AI gateway), it returns a structured JSON briefing including executive summary, chronological timeline, key entities, important statistics, bullish/bearish perspectives, and forward-looking watchpoints.
3. **Ask follow-up questions** — an interactive chat panel streams real-time AI answers grounded strictly in the scraped article content.
4. **Browse curated trending stories** — a pre-seeded set of 6 India-focused business stories with mock briefing data for instant demo.

The app has a dark, editorial aesthetic inspired by Bloomberg Terminal / financial intelligence platforms — Playfair Display serif headings, DM Sans body text, JetBrains Mono for data labels, and a gold accent color palette.

---

## live-demo--screenshots

### Homepage

![Hero section](public/readme-screenshot-10.png)

![URL input with analyze state](public/readme-screenshot-9.png)

![Trending stories grid](public/readme-screenshot-8.png)

### Briefing Experience

![Executive summary and key numbers](public/readme-screenshot-1.png)

![Timeline](public/readme-screenshot-3.png)

![Key entities](public/readme-screenshot-4.png)

![Perspectives and watch-next](public/readme-screenshot-5.png)

### Interactive Q and A

![Question being asked](public/readme-screenshot-6.png)

![AI answer in chat panel](public/readme-screenshot-7.png)

### Timeline for Major Events

![Sample source article page](public/readme-screenshot-2.png)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (React SPA)                      │
│                                                                 │
│   Index Page              BriefingPage                          │
│  ┌────────────┐          ┌───────────────────────────────────┐  │
│  │ URL Input  │          │ ExecutiveSummary  │ KeyNumbers     │  │
│  │ Story Grid │ ──────►  │ Timeline          │ KeyEntities    │  │
│  └────────────┘          │ Perspectives                       │  │
│                          │ WatchNext                          │  │
│                          │ ChatPanel (streaming Q&A)          │  │
│                          └───────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │  Supabase JS Client / fetch()
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Supabase Edge Functions (Deno)                │
│                                                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  scrape-article  │  │generate-briefing │  │   chat-qa    │  │
│  │                  │  │                  │  │              │  │
│  │  Firecrawl API   │  │ Lovable AI Gateway│  │ Lovable AI  │  │
│  │  (web scraping)  │  │ (Gemini Flash)   │  │ (streaming) │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
               ┌────────────────────────┐
               │   External AI/APIs     │
               │  • Firecrawl API       │
               │  • Lovable AI Gateway  │
               │    └─ Google Gemini    │
               │       Flash Preview   │
               └────────────────────────┘
```

The app has **no traditional database** — Supabase is used purely as a serverless function host. Briefing data is passed through `sessionStorage` between pages, not persisted to any backend store.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | React 18 + TypeScript | UI and component logic |
| Build tool | Vite 5 + SWC | Fast dev server and production builds |
| Routing | React Router DOM v6 | Client-side routing |
| Styling | Tailwind CSS v3 | Utility-first CSS |
| UI Components | shadcn/ui + Radix UI | Accessible headless primitives |
| Animations | Framer Motion | Page and element entrance animations |
| Data fetching | TanStack Query v5 | Server state management (scaffolded) |
| Backend runtime | Supabase Edge Functions (Deno) | Serverless API handlers |
| Web scraping | Firecrawl API | Clean markdown extraction from URLs |
| AI model | Google Gemini Flash (via Lovable Gateway) | Briefing generation and chat Q&A |
| Markdown rendering | react-markdown + remark-gfm | Renders AI chat responses |
| Icons | Lucide React | SVG icon set |
| Fonts | Playfair Display, DM Sans, JetBrains Mono | Editorial typography |
| Testing | Vitest + Testing Library + Playwright | Unit and E2E tests |
| Package manager | Bun (+ npm compatibility) | Dependency management |

---

## Project Structure

```
news-intel-story-spark-main/
│
├── src/
│   ├── App.tsx                    # Root component: providers + router
│   ├── main.tsx                   # ReactDOM entry point
│   ├── index.css                  # Global styles, CSS variables, custom utilities
│   ├── vite-env.d.ts
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Home: URL input + trending story grid
│   │   ├── BriefingPage.tsx       # Full briefing view + chat panel
│   │   └── NotFound.tsx           # 404 fallback
│   │
│   ├── components/
│   │   ├── StoryCard.tsx          # Trending story card with hover animation
│   │   ├── NavLink.tsx            # Navigation link component
│   │   │
│   │   ├── briefing/              # Briefing section components
│   │   │   ├── ExecutiveSummary.tsx   # Summary + "Why It Matters"
│   │   │   ├── Timeline.tsx           # Chronological event timeline
│   │   │   ├── KeyEntities.tsx        # Company/person/org tags
│   │   │   ├── KeyNumbers.tsx         # Key stats grid (2-col)
│   │   │   ├── Perspectives.tsx       # Bullish vs Bearish split view
│   │   │   ├── WatchNext.tsx          # Numbered watchpoints list
│   │   │   └── ChatPanel.tsx          # Streaming AI Q&A chat
│   │   │
│   │   └── ui/                    # shadcn/ui primitives (35+ components)
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       ├── toast.tsx / toaster.tsx
│   │       ├── sonner.tsx
│   │       └── ... (30+ more)
│   │
│   ├── lib/
│   │   ├── api.ts                 # Frontend API layer (scrape, generate, stream chat)
│   │   ├── mockData.ts            # Type definitions + mock trending stories + sample briefing
│   │   └── utils.ts               # cn() Tailwind class merger utility
│   │
│   ├── hooks/
│   │   ├── use-toast.ts           # Toast notification hook
│   │   └── use-mobile.tsx         # Responsive breakpoint hook
│   │
│   └── integrations/
│       └── supabase/
│           ├── client.ts          # Supabase JS client initialization
│           └── types.ts           # Auto-generated Supabase DB types
│
├── supabase/
│   ├── config.toml                # Supabase local dev config
│   └── functions/
│       ├── scrape-article/
│       │   └── index.ts           # Edge function: Firecrawl web scraper
│       ├── generate-briefing/
│       │   └── index.ts           # Edge function: AI briefing generator
│       └── chat-qa/
│           └── index.ts           # Edge function: streaming chat Q&A
│
├── public/                        # Static assets + readme screenshots
├── package.json
├── tailwind.config.ts
├── vite.config.ts
├── tsconfig.app.json
├── vitest.config.ts
├── playwright.config.ts
└── .env                           # Supabase project credentials
```

---

## Core Features

### 1. URL-to-Briefing Pipeline
Paste any news article URL. The app orchestrates a two-step pipeline: first scraping the article's clean text content, then passing that text to an AI model to generate a structured JSON briefing. The entire flow runs in under 10 seconds for most articles.

### 2. Intelligence Briefing Sections

Each briefing is rendered across 7 distinct sections:

| Section | Component | What it shows |
|---|---|---|
| Executive Summary | `ExecutiveSummary.tsx` | 5-sentence summary paragraph + "Why It Matters" analysis |
| Timeline | `Timeline.tsx` | 4–6 chronological events with dot-line connector UI |
| Perspectives | `Perspectives.tsx` | Side-by-side bullish (+) and bearish (−) point lists |
| What to Watch Next | `WatchNext.tsx` | 4–5 numbered forward-looking items |
| Key Numbers | `KeyNumbers.tsx` | 2-column grid of highlighted statistics with context |
| Key Entities | `KeyEntities.tsx` | Tagged list of companies, persons, and organizations |
| Chat Q&A | `ChatPanel.tsx` | Interactive streaming AI chat grounded in the article |

### 3. Real-time Streaming Chat
The `ChatPanel` component streams AI responses token-by-token using the **Server-Sent Events (SSE)** protocol. The frontend reads from a `ReadableStream` and incrementally updates the assistant message in state, creating a live-typing effect. Suggested questions are shown before the first message.

### 4. Trending Story Demo Grid
Six pre-seeded India-focused business/financial stories (RBI rates, Reliance Jio, Tata Motors EV, UPI transactions, Infosys deal, SEBI AI regulation) provide clickable demos that load the sample briefing data without API calls.

---

## Data Flow & Implementation Details

### 1. Article Scraping Pipeline

**File:** `supabase/functions/scrape-article/index.ts`

When a user submits a URL from `Index.tsx`:

```
User submits URL
    ↓
Index.tsx: handleSubmit()
    ↓
api.ts: scrapeArticle(url)
    ↓
supabase.functions.invoke("scrape-article", { body: { url } })
    ↓
Edge Function: POST https://api.firecrawl.dev/v1/scrape
    body: { url, formats: ["markdown"], onlyMainContent: true }
    ↓
Returns: { markdown, title, source }
```

The `scrape-article` edge function:
- Validates the URL and prepends `https://` if the scheme is missing.
- Calls Firecrawl's `/v1/scrape` endpoint, requesting `markdown` format with `onlyMainContent: true` to strip navigation, ads, and boilerplate.
- Returns the clean markdown text, the page title, and the source URL from Firecrawl's metadata.
- Requires `FIRECRAWL_API_KEY` set as a Supabase secret.

### 2. AI Briefing Generation

**File:** `supabase/functions/generate-briefing/index.ts`

After scraping succeeds:

```
api.ts: generateBriefing(markdown, title, source)
    ↓
supabase.functions.invoke("generate-briefing", { body: { articleText, articleTitle, articleSource } })
    ↓
Edge Function: POST https://ai.gateway.lovable.dev/v1/chat/completions
    model: "google/gemini-3-flash-preview"
    temperature: 0.3
    system: detailed JSON schema prompt
    user: article content (truncated to 50,000 chars ≈ 12k tokens)
    ↓
Parse JSON from response (strips markdown code fences if present)
    ↓
Add metadata: source, publishedAt, id (UUID)
    ↓
Returns: BriefingData JSON object
```

The system prompt instructs the model to return **only valid JSON** matching the `BriefingData` TypeScript interface:

```typescript
interface BriefingData {
  title: string;
  summary: string;
  timeline: { date: string; event: string }[];
  entities: { name: string; type: "company" | "person" | "org"; role: string }[];
  keyNumbers: { value: string; label: string; context: string }[];
  bullish: string[];
  bearish: string[];
  watchNext: string[];
  whyItMatters: string;
  // Added server-side:
  source: string;
  publishedAt: string;
  id: string;
}
```

The generated briefing is stored in `sessionStorage` as `custom-briefing`, and the original markdown is stored as `custom-article-text` for use by the chat panel. The user is then navigated to `/briefing/custom`.

### 3. Streaming Chat Q&A

**File:** `supabase/functions/chat-qa/index.ts`

Unlike the other two functions (which use `supabase.functions.invoke`), the chat function is called directly via `fetch()` to enable streaming:

```
ChatPanel.tsx: handleSend(text)
    ↓
api.ts: streamChatQA({ messages, articleContext, storyTitle, onDelta, onDone })
    ↓
fetch(`${VITE_SUPABASE_URL}/functions/v1/chat-qa`, { method: "POST" })
    ↓
Edge Function: POST https://ai.gateway.lovable.dev/v1/chat/completions
    stream: true
    system: analyst prompt with article context (up to 30,000 chars)
    messages: full conversation history
    ↓
Response body piped directly back as text/event-stream
    ↓
Frontend reads ReadableStream, parses SSE lines
    ↓
onDelta(chunk) called for each token → incrementally updates message state
    ↓
onDone() called when stream ends
```

The SSE parser in `api.ts` handles:
- Lines starting with `data: ` — parsed as OpenAI-compatible delta chunks.
- `data: [DONE]` — signals stream completion.
- Empty lines and `:` comment lines — ignored.
- Incomplete JSON across chunk boundaries — buffered and retried.

### 4. Frontend Rendering

After briefing data is available in `BriefingPage.tsx`, the 3-column layout renders:

```
┌─────────────────────────────────┬──────────────────┐
│  Main Column (lg:col-span-2)    │  Sidebar         │
│                                 │                  │
│  ExecutiveSummary               │  KeyNumbers      │
│  Timeline                       │  KeyEntities     │
│  Perspectives                   │                  │
│  WatchNext                      │                  │
│  ChatPanel                      │                  │
└─────────────────────────────────┴──────────────────┘
```

Each section uses Framer Motion's `initial/animate` with staggered `delay` values (0.1s increments) to create a cascading entrance animation.

---

## Backend: Supabase Edge Functions

All three backend functions are Deno-based Supabase Edge Functions with identical CORS header handling:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ...",
};
```

Every function handles `OPTIONS` preflight requests and returns proper CORS headers on all responses.

**Required Supabase Secrets:**
- `FIRECRAWL_API_KEY` — used by `scrape-article`
- `LOVABLE_API_KEY` — used by `generate-briefing` and `chat-qa`

**Error handling** covers:
- `429 Too Many Requests` — rate limit exceeded message
- `402 Payment Required` — AI credits exhausted message
- Network/parse failures — generic error with logged details

---

## Frontend Components Deep Dive

### `Index.tsx` (Home Page)
- Animated hero with Framer Motion fade-in/slide-up
- URL input form with loading state (`isAnalyzing`)
- Calls `scrapeArticle()` then `generateBriefing()` sequentially
- Stores results in `sessionStorage` and navigates to `/briefing/custom`
- Renders 6 `StoryCard` components in a responsive 1/2/3-column grid

### `BriefingPage.tsx`
- Reads `id` param from URL; `"custom"` loads from `sessionStorage`, any other ID loads `sampleBriefing` from `mockData.ts`
- Sticky navbar with backdrop blur
- 3-column responsive grid layout (single column on mobile)
- Passes `articleText` to `ChatPanel` for grounded Q&A

### `ChatPanel.tsx`
- Local `messages` state array (not persisted)
- Streams AI responses using `streamChatQA` from `api.ts`
- `upsertAssistant` closure incrementally appends to the last assistant message
- Renders AI responses with `react-markdown` (supports bold, lists, code)
- Typing indicator: 3 animated gold dots (pulse animation with staggered delays)
- Suggested questions shown only when `messages.length === 0`

### `StoryCard.tsx`
- Framer Motion entrance with index-based delay (`index * 0.08s`)
- Hover effects: gold border, gold glow box-shadow, title color transition, arrow translate

### Briefing Section Components
All follow an identical pattern:
```tsx
<motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: N }}>
  {/* section content */}
</motion.section>
```

---

## State Management & Routing

The app uses a deliberately minimal state model:

- **TanStack Query** is set up as a provider but not actively used for data fetching (all API calls are direct `async/await` in event handlers).
- **React local state** (`useState`) handles all form inputs, loading flags, and chat messages.
- **sessionStorage** bridges the two-page flow: briefing data and article markdown are written on the home page and read on the briefing page. This means **refreshing the briefing page for a custom article will redirect back to home** (the data is gone).
- **React Router DOM** handles two real routes: `/` (Index) and `/briefing/:id` (BriefingPage), plus a catch-all 404.

---

## Design System

The app uses a single dark theme (no light mode toggle) with a carefully defined set of CSS custom properties:

**Color Palette:**
- Background: deep navy-charcoal (`hsl(220, 20%, 6%)`)
- Card surfaces: slightly lighter navy (`hsl(220, 18%, 10%)`)
- Primary / Gold: `hsl(38, 90%, 56%)` — used for accents, borders, headings
- Gold Dim: `hsl(38, 60%, 40%)` — subdued gold for secondary accents
- Gold Glow: `hsl(38, 100%, 65%)` — gradient highlight
- Success (green): `hsl(152, 60%, 45%)` — bullish indicators
- Destructive (red): `hsl(0, 72%, 51%)` — bearish indicators

**Typography:**
- Display / Headings: `Playfair Display` (serif) — editorial, premium feel
- Body: `DM Sans` (sans-serif) — clean readability
- Monospace / Labels: `JetBrains Mono` — data labels, timestamps, category tags

**Custom Tailwind Utilities:**
- `.text-gold`, `.text-gold-dim`, `.text-dim` — semantic color helpers
- `.gradient-gold` — linear gradient from gold to gold-glow
- `.glow-gold` — gold box-shadow for card hover effect
- `.border-gold-dim` — semi-transparent gold border

---

## Environment Variables

Create a `.env` file at the project root (already committed with project credentials — **rotate these before deploying**):

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_URL=https://your_project_id.supabase.co
```

**Supabase Edge Function Secrets** (set via Supabase Dashboard → Settings → Secrets):
```
FIRECRAWL_API_KEY=your_firecrawl_key
LOVABLE_API_KEY=your_lovable_ai_gateway_key
```

> ⚠️ **Security Note:** The `.env` file is committed to the repository with real credentials. These should be rotated immediately if this repository is made public.

---

## Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.0+
- A Supabase account and project
- A Firecrawl API key (https://firecrawl.dev)
- A Lovable AI Gateway key (https://lovable.dev)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd news-intel-story-spark-main

# Install dependencies
npm install
# or with bun:
bun install
```

### Development

```bash
npm run dev
# App runs at http://localhost:8080
```

### Production Build

```bash
npm run build
# Output in dist/
```

### Deploying Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Login and link your project
supabase login
supabase link --project-ref your_project_id

# Deploy all edge functions
supabase functions deploy scrape-article
supabase functions deploy generate-briefing
supabase functions deploy chat-qa

# Set secrets
supabase secrets set FIRECRAWL_API_KEY=your_key
supabase secrets set LOVABLE_API_KEY=your_key
```

---

## Testing

The project includes both unit and end-to-end test infrastructure.

**Unit tests (Vitest + Testing Library):**
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
```

Config: `vitest.config.ts` — uses jsdom environment, `src/test/setup.ts` imports `@testing-library/jest-dom` matchers.

**End-to-end tests (Playwright):**
```bash
npx playwright test
```

Config: `playwright.config.ts` — points to `http://localhost:8080`.

> Note: The test suite is scaffolded with a single passing placeholder test (`src/test/example.test.ts`). Real test coverage is not yet implemented.

---

## Deployment

The frontend is a standard Vite SPA — deploy the `dist/` folder to any static host:
- **Lovable** (native — this project was built with Lovable)
- Vercel, Netlify, Cloudflare Pages, or GitHub Pages

Edge functions are deployed directly to Supabase and are globally distributed by default.

---

## Known Limitations & Future Improvements

**Current Limitations:**
- **No persistence** — briefings are only stored in `sessionStorage`. Refreshing the custom briefing page redirects home.
- **Single sample briefing** — all pre-seeded trending stories (except the Reliance Jio one) redirect to the same hardcoded `sampleBriefing` data.
- **No authentication** — anyone with the Supabase anon key can call the edge functions.
- **Credentials in repo** — `.env` is committed with live Supabase credentials (should be gitignored).
- **Article truncation** — articles longer than ~50,000 characters (~12k tokens) are silently truncated before AI processing.
- **No rate limiting on frontend** — users can spam the analyze button.

**Suggested Improvements:**
- Persist briefings to Supabase database with user accounts (Supabase Auth)
- Add real briefing data for each of the 6 trending stories
- Implement request debouncing and per-user rate limiting
- Add a "share briefing" feature (generate a shareable URL with stored data)
- Support PDF/document uploads in addition to URLs
- Add category/topic filtering on the home page
- Cache scraped articles to avoid redundant Firecrawl API calls
- Implement dark/light mode toggle
- Expand test coverage with meaningful unit and integration tests

---

## License

Private project. All rights reserved.

---
