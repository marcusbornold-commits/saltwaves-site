# Saltwaves Site

Marketing site for Saltwaves Studio, built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Project Structure

- `app/page.tsx` - landing page (hero + manifesto + signup form)
- `app/blog/page.tsx` - empty blog list page
- `app/blog/[slug]/page.tsx` - empty single post page
- `content/blog/` - MDX content directory
- `public/robots.txt` - static robots rules
- `public/sitemap.xml` - static sitemap

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful scripts:

```bash
npm run lint
npm run build
npm run tina:build:local
```

## Tina CMS (Blog Editor)

- The visual editor is available at `http://localhost:3000/admin` when running `npm run dev`.
- Tina is configured for the existing MDX blog content in `content/blog/`.
- Existing frontmatter fields are preserved: `title`, `description`, `date`.
- Blog rendering in `app/blog/` continues to read directly from MDX files.

### Vercel Setup For `/admin`

Set these environment variables in Vercel so Tina can use the hosted API in production:

- `NEXT_PUBLIC_TINA_CLIENT_ID`
- `TINA_TOKEN`
- `GITHUB_BRANCH` (or rely on `VERCEL_GIT_COMMIT_REF`)

If credentials are not set, `npm run build` falls back to a local Tina build mode.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Keep defaults (Framework Preset: Next.js).
4. Click **Deploy**.

For custom domain, add `saltwaves.studio` in Vercel project settings.
