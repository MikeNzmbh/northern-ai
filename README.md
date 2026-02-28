# Northern: High-Assurance Personal AI Orchestrator

Northern is undergoing a massive transformation. Originally built as a strict, high-performance FX Trading Operator (with Rust engines, killswitches, and institutional discipline), it has evolved into a **High-Assurance Personal AI Orchestrator**. 

The recent modifications have shifted the focus toward casual user accessibility and generalized workflow automation, bridging the gap between intense security and casual convenience.

## 1. The Evolution: What Northern is Becoming

- **Beginner-Friendly UX**: Simplified error copy, improved chat tone, and seamless Human-In-The-Loop (HITL) fallback.
- **Persistent Tool Grants**: The concept of `yes_never` (approve once, execute natively in the session) allows for fluid workflows without sacrificing safety.
- **Platform Agnosticism**: With email intent routing, channel clarifications, and GitHub repo disambiguation, Northern transcends order books to manage your entire digital life.

### Core Value Proposition
Most consumer AI agents are loosely tethered and prone to hallucinate actions. Northern brings **Wall Street-grade safety rails** (evidence gates, operator locks, paper-vs-live execution modes, circuit breakers) to everyday digital workflows.

## 2. Real-Life Use Cases for Casual Users

By hiding the hardcore Python/Rust/Postgres backend behind an elegant Apple-like Next.js chat UX, casual users can use Northern for high-stakes personal orchestration.

### A. The "Personal Chief of Staff" (Email & Comms)
- **Scenario**: Returning from vacation to 300 emails and a chaotic Slack/Discord workspace.
- **Workflow**: The user types, *"Northern, triage my inbox and draft polite declines to any vendor pitches."*
- **The Magic**: Northern pauses for a Human-In-The-Loop (HITL) approval. The user hits `yes_never` for this session. Northern safely routes intents, drafts emails, and categorizes messages without accidental sends, leaning on its **Evidence Gate** to prove why it flagged certain emails as "vendor pitches."

### B. The "Independent Creator" (GitHub & Project Management)
- **Scenario**: A casual developer or content creator wants to manage bug reports or website updates without leaving the chat interface.
- **Workflow**: *"Northern, read the latest issues on my blog repository and deploy fixes for the typos mentioned."*
- **The Magic**: Using GitHub repo intent routing and Codex skills, Northern creates a "Research Ticket", writes the code, and asks for an "Evidence Gate" approval before deploying. The user gets a simplified chat prompt rather than reading messy git diffs.

### C. The "Safe-Fail Researcher" (News & Market Scout)
- **Scenario**: Tracking specific topics (e.g., AI hardware releases or local real estate trends) without getting hallucinated garbage.
- **Workflow**: *"Northern, run a scout loop every morning on AI news and synthesize it into a report."*
- **The Magic**: Leveraging the `NEWS_SCOUT` and `STRATEGY_SCIENTIST` agents, Northern requires citations (Tier A/B sources) through its immutable Research Protocol. The user receives heavily vetted, non-hallucinated daily synthesis. If a news cycle gets chaotic, a **"volatility shock circuit breaker"** halts the summary and asks the user what to focus on.

## 3. Go-To-Market & Ecosystem Strategy

To successfully market Northern, we lean into the juxtaposition of its friendly frontend and hardcore, battle-tested backend.

### Phase 1: Study 
- **Master the "Supervisor FSM"**: Northern is a Finite State Machine with scanning, cooling down, and lock-down states—"An AI that knows how to hit the brakes."
- **Experiment with the Lab**: Understand how Northern proposes an action, evaluates it against a shadow (paper) state, and requires governance to push it live.
- **Analyze the Agent Hierarchy**: Memorize the differential components (`NEWS_SCOUT`, `OPS_SENTINEL`, `CHANGE_CONTROL`) to explain Northern as a "company of experts in a box".

### Phase 2: Promote
1. **The "Military-Grade Personal AI" Angle (Twitter/LinkedIn)**
   - *Hook*: "Most AI agents are interns who accidentally delete production. Northern is an operator with a built-in killswitch."
   - *Content*: Side-by-side comparisons of standard AI hallucinating an email versus Northern pausing at an Evidence Gate.
2. **The Output-First Demo Strategy (YouTube/TikTok)**
   - Display the sleek Next.js Cockpit dark mode, Framer Motion animations, and "TradingView-style" telemetry.
   - *Content*: 60-second workflows (e.g., parsing 50 GitHub issues, drafting PRs, waiting for execution thumbprint).
3. **The Open-Source "Prosumer" Appeal (Hacker News/Reddit)**
   - Position Northern as the ultimate self-hosted orchestrator, scaling from local SQLite to enterprise PostgreSQL.
   - Emphasize the clean separation of backend (FastAPI/uvloop) and frontend (Next.js Vercel deploy).

### Summary Action Plan
- **Build 3 Core "Casual Demos"**: Email, GitHub, and Unified Daily Research.
- **Lock in the "Voice"**: Market like a high-end luxury vehicle—incredibly powerful under the hood (Rust core), but sleek and simple on the dashboard (Next.js Cockpit).
- **Focus on "Trust"**: Evidence Gates and HITL approvals are the ultimate competitive advantage. Market the **safety**, not just the speed.

## 4. Vercel Deployment (Keep Users Logged In)

Use a same-origin API proxy on Vercel so browser requests stay on one origin and auth cookies persist correctly.

### Required setup
1. Keep frontend API base as `/api`.
2. Configure Vercel rewrite:
   - `/api/:path* -> https://api.northern.ai/:path*`
   - keep SPA fallback rewrite after this rule.
3. Backend must run cookie auth with hardened settings:
   - `NORTHERN_AUTH_MODE=cookie`
   - `SESSION_SECRET=<32+ random chars>`
   - `COOKIE_SECURE=true`
   - `COOKIE_SAMESITE=lax`
   - `CORS_ALLOW_ORIGINS=https://app.northern.ai`
   - Optional for cross-subdomain cookies: `COOKIE_DOMAIN=.northern.ai`
4. Optional UI toggles for social buttons:
   - `VITE_NORTHERN_OAUTH_GOOGLE=true`
   - `VITE_NORTHERN_OAUTH_APPLE=true`

### Verify
- Login from the website and confirm protected endpoints return 200 with `credentials: include`.
- Probe backend auth readiness:
  - `GET /health/auth`
- Confirm status is `ready` and no blockers are reported.

## 5. Logging and User Traceability

To keep reliable user-level visibility in production:
- Frontend: enable Vercel log drains for request/error aggregation.
- Backend: keep structured logs and metrics enabled.
- Keep audit/session tables enabled in the backend DB.
- Correlate events using backend run IDs/correlation IDs and session/user identifiers.
