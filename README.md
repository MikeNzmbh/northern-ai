# Northern AI Website

Website and launcher frontend for Northern’s local-first assistant runtime.

This app has two deployment profiles:

- `public_launcher` (Vercel): marketing + account auth + launcher UX
- `local` (localhost): full chat portal connected to local Northern backend

The public website never runs full local chat directly from the cloud host.

## Architecture

1. Identity and account lifecycle
- Supabase Auth is the source of truth for signup/login/OAuth.
- Website uses Supabase session state in the browser.

2. Runtime execution
- Real assistant execution happens on the user’s local Northern backend.
- Local portal sends bearer tokens (`Authorization: Bearer <supabase_access_token>`) to local `/api`.

3. Public `/chat`
- In `public_launcher` profile, `/chat` is launcher-only.
- It shows account state and device presence, then routes users to local portal.

## Environment Variables

### Required
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Runtime profile
- `VITE_NORTHERN_RUNTIME_PROFILE=local|public_launcher`

### API base (local profile)
- `VITE_NORTHERN_API_BASE=/api`

### Optional
- `VITE_NORTHERN_LOCAL_PORTAL_URL=http://127.0.0.1:5173/chat`
- `VITE_NORTHERN_PRESENCE_STALE_SECONDS=60`
- `VITE_NORTHERN_OAUTH_GOOGLE=true`
- `VITE_NORTHERN_OAUTH_APPLE=false`

## Supabase Setup

1. Create project and copy:
- Project URL
- anon public key

2. Configure Auth:
- Enable Email/Password
- Enable Google provider (Apple optional)
- Set Supabase Auth Site URL: `https://northern-ai.vercel.app`
- Add redirect URLs:
  - `https://northern-ai.vercel.app/auth/callback`
  - `http://localhost:5173/auth/callback`

3. Create `northern_devices` table in Supabase (for public launcher presence):
- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `install_id text not null`
- `device_name text not null`
- `is_default boolean not null default false`
- `status text not null default 'sleeping'`
- `last_seen_at timestamptz`
- `heartbeat_meta jsonb not null default '{}'::jsonb`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `unique(user_id, install_id)`

4. RLS policies:
- Enable RLS on `public.northern_devices`
- Allow `select` where `user_id = auth.uid()`
- Do not allow client insert/update/delete
- Presence writes come from backend service-role key

## Local Development

```bash
npm install
npm run dev
```

For local full chat, set:
- `VITE_NORTHERN_RUNTIME_PROFILE=local`
- `VITE_NORTHERN_API_BASE=/api`

Make sure local backend is running and proxying `/api` correctly.

## Build and Lint

```bash
npm run lint
npm run build
```

## Key UX Flows

1. Signup/login
- `/login` and `/signup` use Supabase auth APIs directly.
- OAuth returns through `/auth/callback`.

2. Public launcher
- `/chat` in `public_launcher` shows:
  - account state
  - device online/sleeping state from Supabase presence
  - local portal CTA

3. Local chat portal
- `/chat` in `local` profile uses:
  - runtime probe (`/health/live`)
  - local backend chat/session/queue APIs
  - attachment upload/remove
  - async concierge run status/approval

## Troubleshooting

1. `Supabase is not configured for this deployment`
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

2. OAuth returns to a blank/error callback
- Verify Supabase redirect URLs include `/auth/callback` for your exact domain.

3. Public `/chat` shows sleeping
- Confirm local Northern runtime is running and sending heartbeat.
- Confirm backend has Supabase presence sync enabled.
