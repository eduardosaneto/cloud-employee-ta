```markdown
# Architecture & Technical Decisions

This document outlines the architecture for "The AI Qualifier," detailing the technical decisions and trade-offs made during its construction.

## 1. High-Level Architecture

The system is built as a **full-stack monolith using Next.js (App Router)**.

This architecture was chosen for prototype speed and simplicity. It allows for a single codebase, a single development environment, and a single deployment, which dramatically accelerates development. Server-side logic is co-located with the frontend and handled primarily by Next.js Server Actions.



### Core Components

* **Framework (Frontend & Backend):** **Next.js 14 (App Router)**. We use React Server Components (RSC) for data fetching and static rendering, and Client Components for interactivity. All backend mutations (login, onboarding, qualification) are handled via **Server Actions**.
* **Database:** **Supabase (PostgreSQL)**. Supabase was chosen because it bundles a production-grade Postgres database with a complete Auth system, solving two major requirements with one tool.
* **Authentication:** **Supabase Auth**. We use the modern `@supabase/ssr` library, which implements a cookie-based session flow that works seamlessly across Server Components, Server Actions, and Middleware.
* **UI:** **HeroUI (NextUI)**. This component library was chosen (as an alternative to `shadcn/ui`) because it is built on Tailwind CSS, supports the App Router, and provides a complete, beautiful set of components out of the box.
* **AI:** **OpenAI API**. We use the official `openai` Node.js library to call GPT models. We use `gpt-3.5-turbo` for simple tasks (summarization) and `gpt-4-turbo` with **JSON Mode** for complex, structured data generation (ICP and Qualification).
* **Deployment & CI/CD:** **Vercel** for hosting/deployment and **GitHub Actions** for CI checks (linting/formatting).

## 2. Data Model (PostgreSQL)

The database schema is defined in the `supabase/migrations` folder and version-controlled with Git.

* `companies`: Stores the user's own company info (domain, summary).
* `icps`: Stores the generated Ideal Customer Profile. (1-to-1 with `companies`).
* `buyer_personas`: Stores the personas for an ICP. (Many-to-1 with `icps`).
* `prospects`: Stores the prospect domains a user wants to qualify.
* `qualifications`: Stores the result of a qualification run (score, reasoning, status).

A key decision was to **add `user_id` to every table** (`icps`, `buyer_personas`, `qualifications`). While this slightly de-normalizes the data, it makes writing **Row Level Security (RLS)** policies drastically simpler and more performant, as we can check `auth.uid() = user_id` without expensive table joins.

## 3. Key Technical Decisions & Trade-offs

### Decision: Next.js Monolith vs. Separate Backend
* **Choice:** Next.js monolith using Server Actions.
* **Reasoning:** For a prototype, this is the fastest way to build. It eliminates the complexity of managing two separate services, CORS, and duplicated types. Server Actions provide a zero-boilerplate way to write backend code that integrates directly with the UI.
* **Trade-off:** Tightly couples the backend and frontend logic. This would be less ideal for a large-scale system needing to support many different clients (e.g., mobile, desktop), but it's perfect for a web-based SaaS prototype.

### Decision: `cheerio` vs. Professional Scraping API
* **Choice:** A simple server-side `fetch` with `cheerio`.
* **Reasoning:** It's free, has no external dependencies, and is simple to implement for basic HTML text extraction. We made it more resilient by adding a `User-Agent` and a `www`-fallback.
* **Trade-off:** This is the most fragile part of the system. It will **fail** on any site that is a Single Page Application (SPA) or has moderate-to-strong bot detection (like Cloudflare). A professional API (like ScrapingBee or Browserless.io) would be required for a real product.

### Decision: Async "Fire-and-Forget" vs. Dedicated Job Queue
* **Choice:** For prospect qualification, the Server Action triggers a `processQualification` function for each domain **without** `await`-ing it.
* **Reasoning:** This provides a good user experience (the UI returns instantly) without the complexity of a dedicated queue system. It's a simple way to handle background tasks within the Next.js serverless environment.
* **Trade-off:** This is **not resilient**. If the serverless function times out or crashes during processing, the job is lost forever and will remain "pending" in the database. A true production system would use a dedicated queue (like Inngest, QStash, or BullMQ) to manage these jobs, with retries and error handling.

### Decision: Synchronous Onboarding
* **Choice:** The `completeOnboarding` action is a single, long-running (15-30s) synchronous function. The user must wait.
* **Reasoning:** This was a simplification to meet the deadline.
* **Trade-off:** This is a **bad user experience** and **will fail in production** on Vercel's Hobby plan, which has a 10-15s timeout. This is the single biggest "prototype" shortcut taken.

## 4. What I'd Do Next (Future Improvements)

If I had more time, I would focus on making the system more robust and resilient:

1.  **Refactor Onboarding to be Asynchronous:** The `completeOnboarding` action should be "fire-and-forget," just like the prospect qualification. It would create the `icp` with a `status: 'pending'` and redirect the user *immediately*. The dashboard would then show a loading state until the background job is complete.
2.  **Implement a True Job Queue:** I would integrate **Inngest** or **QStash** to manage all background jobs (onboarding and qualification). This provides retries, error handling, and concurrency control, making the system vastly more resilient.
3.  **Integrate a Professional Scraping API:** I would replace `cheerio` with a service like **ScrapingBee** or **Browserless.io**. This would allow the app to successfully scrape SPAs (JavaScript-heavy sites) and bypass most bot-detection, making the core feature far more reliable.
4.  **Implement Real-time Updates:** Instead of relying on `revalidatePath` (which requires a user refresh), I would use **Supabase Realtime** to listen for database changes and update the prospect list live as qualifications complete.
5.  **Allow ICP Editing:** The AI-generated ICP is a great start, but users should be able to manually edit the personas, industries, and other fields to refine their profile.