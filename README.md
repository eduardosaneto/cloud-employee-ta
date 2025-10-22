# The AI Qualifier

**The AI Qualifier** is a production-ready prototype built for a technical assignment. This full-stack application allows a user to generate an Ideal Customer Profile (ICP) for their company by analyzing their domain. It then allows them to qualify a list of prospect domains against that ICP, providing a score and reasoning for each.

**[Link to Live Hosted Application](https://your-project-url.vercel.app/)**

**[Link to Video Walkthrough (Loom)](https://www.loom.com/...)**

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Backend:** Node.js (via Next.js Server Actions)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Cookie-based SSR)
- **AI:** OpenAI API (GPT-4-Turbo & GPT-3.5-Turbo)
- **UI:** HeroUI (on top of Tailwind CSS)
- **Schema:** Supabase Migrations
- **Scraping:** `cheerio` (server-side)
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions (Code Quality) & Vercel (Deployment)
- **Formatting:** Prettier

---

## Features

- **Secure Authentication:** Full auth flow (Sign up, Sign in, Sign out) with email/password.
- **Protected Routes:** Middleware protects all app routes and handles onboarding logic.
- **AI-Powered Onboarding:**
  - User submits their company domain.
  - The app scrapes the domain, summarizes its content (via GPT-3.5), and generates a detailed ICP (via GPT-4-Turbo JSON Mode).
  - All data is saved in a normalized PostgreSQL database.
- **Prospect Qualification:**
  - Users can submit a comma-separated list of prospect domains.
  - The app uses an asynchronous "fire-and-forget" pattern to process each domain in the background.
  - Each prospect is scraped, and its content is compared against the user's ICP using GPT-4-Turbo.
  - Results (score, reasoning, status) are saved and displayed in the dashboard.
- **Interactive Dashboard:**
  - View the complete, generated ICP.
  - View the list of qualified prospects with their status (pending, completed, failed).
  - Click "View Reasoning" to open a modal and inspect the AI's qualification logic.

---

## Local Setup Instructions

### 1. Prerequisites

- Node.js (v18 or later)
- `npm` (or `pnpm`/`yarn`)
- A Supabase account (free tier)
- An OpenAI API key

### 2. Clone Repository

```bash
git clone [https://github.com/your-username/ai-qualifier.git](https://github.com/your-username/ai-qualifier.git)
cd ai-qualifier
```

### 3. Run the project

- **Install dependencies:** npm install
- **Generate env local:** cp .env.sample .env
- **Install suplabase cli**
  - npm install supabase --save-dev
  - npx supabase login
  - npx supabase link --project-ref PROJECT_ID
  - - - (You can find your PROJECT_ID in your Supabase project's URL: https://supabase.com/dashboard/project/PROJECT_ID)
- **Running migration:** npx supabase db push
- **Run Project:** npm run dev
