# Portfolio CMS Dashboard

The dashboard login uses `POST /api/v1/auth/login` on `porto-service` and validates saved sessions with `GET /api/v1/auth/me`.

For local development, start PostgreSQL and the NestJS API from `porto-service`, then copy `.env.local.example` to `.env.local` (the current local workspace already has this file) and run `npm install` followed by `npm run dev`. Set `NEXT_PUBLIC_API_URL` to the API base URL, including `/api/v1`.

Create the demo admin account by running `npm run db:seed:demo:docker` from `porto-service` after configuring `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD` in its ignored `.env.compose` file. The dashboard no longer accepts the old browser-only demo password.

Run `npm test` for the login and session tests.
