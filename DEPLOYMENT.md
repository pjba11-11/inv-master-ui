# Deployment

Free-tier stack: **Supabase** (Postgres) + **Render** (Spring Boot backend) + **Vercel** (Next.js frontend).

## Live URLs

| Service | URL |
|---|---|
| Frontend (production) | https://inv-master-ui.vercel.app |
| Backend API | https://inv-master-001.onrender.com |
| Supabase project | https://ytpcbqfgtjmndrnqemqb.supabase.co |

## Supabase

- Project ref: `ytpcbqfgtjmndrnqemqb`
- Dashboard: https://supabase.com/dashboard/project/ytpcbqfgtjmndrnqemqb
- Connection used by the backend: **Session pooler** (not direct connection — Supabase's direct connection is IPv6-only and Render's network can't route it, fails with `Network is unreachable`)
  - Host: `aws-1-ap-south-1.pooler.supabase.com:5432`
  - Username format: `postgres.ytpcbqfgtjmndrnqemqb`
  - Get the password from Project Settings → Database → Connection string → Session pooler tab
- Schema is created by Flyway on backend boot (`V1__create_all_basic_tables.sql`), not applied manually.

## Render (backend: `inv-master-001`)

- Service ID: `srv-d9hq64brjlhs739jmjo0`
- Dashboard: https://dashboard.render.com/web/srv-d9hq64brjlhs739jmjo0
- Runtime: Docker (`./Dockerfile`, repo root)
- Repo: `pjba11-11/inv-master-001`, branch `main`, auto-deploy on push enabled
- Free tier: spins down after 15 min idle — first request after idle takes 30-60s (cold start), not a bug

Required environment variables (set in Render dashboard, Environment tab):

| Key | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres` |
| `SPRING_DATASOURCE_USERNAME` | `postgres.ytpcbqfgtjmndrnqemqb` |
| `SPRING_DATASOURCE_PASSWORD` | (Supabase DB password) |
| `JWT_SECRET` | (generate: `openssl rand -base64 32`) |
| `GROQ_API_KEY` | (Groq API key — required, no default) |
| `PORT` | injected automatically by Render, do not set manually |

## Vercel (frontend: `inv-master-ui`)

- Project: `pjba/inv-master-ui`
- Dashboard: https://vercel.com/pjba/inv-master-ui
- **Git integration is not connected** (Vercel's GitHub App lacks access to the `pjba11-11` org — fix via https://github.com/organizations/pjba11-11/settings/installations, grant access to `inv-master-ui`/`inv-master-001`, then reconnect in Vercel project settings → Git)
- Until Git is connected, deploys are manual from a local clone:
  ```bash
  vercel --prod
  ```

Required environment variable (Project Settings → Environment Variables):

| Key | Value |
|---|---|
| `BACKEND_URL` | `https://inv-master-001.onrender.com` |

## Redeploying after a change

- **Backend**: push to `main` on `pjba11-11/inv-master-001` — Render auto-deploys.
- **Frontend**: until Git integration is fixed, run `vercel --prod` from `inv-master-ui` locally.

## Local development

Unaffected by any of the above — `docker-compose.yml` still runs Postgres/backend/frontend locally with the same env var names, defaulting to `localhost` values when unset.
