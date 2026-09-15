# Launch constraint: Earselect must remain available

User instruction, 14 September 2026: Earselect demo availability takes priority over the PodMaster main-domain launch.

- Demo: https://app.saltwaves.studio/tools/audiobook (EARSELECT · AUDIOBOOK).
- Existing production project saltwaves-services and app.saltwaves.studio must remain unchanged by the main-domain launch.
- Do not push launch changes to saltwaves-frontend/main: it autodeploys saltwaves-services. Do not deploy this patch to that project, move its domain, change its AUTH_URL/auth setup, or introduce host-wide redirects.
- Prepare the combined public app in saltwaves-site through an isolated source/preview. Preserve the existing site deployment for rollback.
- Keep the app-domain login, /api/auth/*, /api/audiobook and descendants, assets, sessions, audiobook environment values, dedicated storage and Mini API/worker/cleanup intact.
- Keep audiobook disabled in the new main-domain deployment. Do not clone its private storage/service configuration or schedule duplicate cleanup jobs.
- Shared auth providers, databases and Mini capacity still require compatibility checks. Separate Vercel projects alone do not ensure dependency isolation.
- Before publishing, verify an authorized demo login, preview, status, playback and download; repeat after publishing. Unauthenticated 307/200/401 checks are not an end-to-end test.
- Retain noindex for Earselect and omit it from public links and sitemap.
- No scheduled monitor is configured by this file. No promise of zero downtime is implied by a point-in-time check.

## Prepared release — 15 September 2026
This repository now contains the main-domain release in saltwaves-site, combining the prepared public tools/blog/SEO work with source app commit dca35ff and the previously verified dependency fixes. The target vercel.json omits the cleanup cron; the existing services scheduler remains responsible.
