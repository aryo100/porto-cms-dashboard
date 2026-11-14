# Portfolio CMS Dashboard

The dashboard login uses `POST /api/v1/auth/login` on `porto-service` and validates saved sessions with `GET /api/v1/auth/me`.

For local development, start PostgreSQL and the NestJS API from `porto-service`, then copy `.env.local.example` to `.env.local` (the current local workspace already has this file) and run `npm install` followed by `npm run dev`. Set `NEXT_PUBLIC_API_URL` to the API base URL, including `/api/v1`.

Create the demo admin account by running `npm run db:seed:demo:docker` from `porto-service` after configuring `DEMO_ADMIN_EMAIL` and `DEMO_ADMIN_PASSWORD` in its ignored `.env.compose` file. The dashboard no longer accepts the old browser-only demo password.

CMS data comes from `porto-service` as each page needs it. Projects loads projects and skills; Blog loads posts; Experience loads its records and settings; Settings loads settings. The dashboard uses `/stats`, `/activity`, and `/content`. Global search loads other resources only when used, and Export Data loads all resources when clicked. Projects, blog posts, work experience, education, skills, and achievements use their list/create/update/delete endpoints. Profile, site, SEO, and social settings use `GET/PUT /api/v1/settings`. Image and PDF uploads use `POST /api/v1/uploads`. In Settings → Profile, upload a PDF CV (up to 10 MB) and click Save Changes; the file metadata is saved to the profile and the Download CV card appears in Porto. Replacing or removing the CV also removes the previous file from storage after saving. The dashboard no longer keeps content or demo data in browser storage. Browser storage holds the authentication session. The former browser AI key is cleared on dashboard load.

Settings → Site Config reads editable homepage copy from `GET /api/v1/content/section-content/editor` and saves it with `PUT /api/v1/content/section-content`. The public `GET /api/v1/content/section-content` also includes projects, skills, experience, and achievements for Porto. Settings includes Instagram alongside the other contact links.

Settings → Assistant lists the forms that support **Generate form draft** and lets you choose a model. The service default is selected automatically, or the first available model when no default is configured. Enter a title, optionally add notes, review the draft, then Apply. Undo and Redo work locally until the form is closed; Save writes the content. Review generated assumptions and estimated metrics before saving.

If the API is unavailable, the dashboard shows a loading error and a retry button instead of displaying stale local data. Start the service and database before opening the CMS.

Run `npm test` for the login and session tests, and `npm run build` to verify the dashboard build.
