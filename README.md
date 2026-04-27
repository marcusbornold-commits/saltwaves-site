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
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Keep defaults (Framework Preset: Next.js).
4. Click **Deploy**.

For custom domain, add `saltwaves.studio` in Vercel project settings.
