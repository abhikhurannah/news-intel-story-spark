# ⚡ NewsNavigator — Interactive Intelligence Briefing

Turn any news article into a structured, interactive intelligence briefing — complete with executive summary, timeline, key entities, perspectives, and AI-powered Q&A.

🔗 **Live Demo**: [news-intel-story-spark.lovable.app](https://news-intel-story-spark.lovable.app)

---

## 📸 Screenshots

### Homepage — Paste any article URL
![Hero](public/screenshots/hero.png)

### Executive Summary & Key Numbers
![Briefing](public/screenshots/briefing.png)

### Timeline of Events
![Timeline](public/screenshots/timeline.png)

### Key Entities
![Entities](public/screenshots/entities.png)

### Perspectives — Bullish vs Bearish & What to Watch Next
![Perspectives](public/screenshots/perspectives.png)

### Interactive Q&A Chat
![Chat](public/screenshots/chat.png)

---

## 🚀 What It Does

1. **Paste any article URL** — or pick a trending story from the homepage
2. **AI scrapes & analyzes** the article using Firecrawl + Gemini
3. **Generates a structured briefing** with:
   - 📝 Executive Summary & "Why It Matters"
   - 🕐 Event Timeline
   - 👥 Key Entities (people, companies, organizations)
   - 🔢 Key Numbers with context
   - 📊 Bullish vs Bearish perspectives
   - 👁 What to Watch Next
4. **Ask follow-up questions** — AI answers grounded in the article context via streaming chat

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Lovable Cloud (Supabase Edge Functions) |
| **AI** | Google Gemini 2.5 Flash (via Lovable AI Gateway) |
| **Scraping** | Firecrawl API |
| **Fonts** | Playfair Display + DM Sans |

---

## 📂 Project Structure

```
src/
├── pages/
│   ├── Index.tsx           # Homepage with URL input & trending stories
│   └── BriefingPage.tsx    # Full intelligence briefing view
├── components/
│   ├── briefing/
│   │   ├── ExecutiveSummary.tsx
│   │   ├── Timeline.tsx
│   │   ├── KeyEntities.tsx
│   │   ├── KeyNumbers.tsx
│   │   ├── Perspectives.tsx
│   │   ├── WatchNext.tsx
│   │   └── ChatPanel.tsx   # Streaming AI Q&A
│   └── StoryCard.tsx
├── lib/
│   ├── api.ts              # Backend API calls & SSE streaming
│   └── mockData.ts         # Sample trending stories
supabase/
└── functions/
    ├── scrape-article/     # Firecrawl integration
    ├── generate-briefing/  # AI briefing generation
    └── chat-qa/            # Streaming Q&A endpoint
```

---

## 🛠 How to Run

This project is built with [Lovable](https://lovable.dev). To run locally:

```bash
npm install
npm run dev
```

Backend functions are deployed automatically via Lovable Cloud.

---

## 📋 Roadmap

- [x] Article scraping via URL
- [x] AI-generated structured briefings
- [x] Interactive streaming Q&A
- [x] Trending stories homepage
- [ ] Persist briefings to database
- [ ] Regional language support (Hindi, Tamil, Telugu, Bengali)
- [ ] Related stories & cross-referencing
- [ ] User accounts & saved briefings
- [ ] RSS feed auto-ingestion

---

## 📄 License

Built for hackathon demonstration purposes.
