<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Saltwaves kundwebb — gemensamma instruktioner

Verifierat 2026-09-08. Läs `CLAUDE.md` för arkitektur och skyddade ändringsområden, `LOCAL-RUN.md` för ljudverktyget.

- GitHub: `saltwaves-site`. Vercel: `saltwaves-site`. Produktion: `saltwaves.studio`. Källappen och Earselect finns separat i `saltwaves-services` på `app.saltwaves.studio`.
- Git autodeploy är PÅ från `main`: push till `main` publicerar. Arbeta på separat branch när ändringen ska granskas före publicering.
- Visa plan eller diff före commit. Kontrollera `git log --oneline -5` och `git status --short`; stagea namngivna filer, aldrig `git add -A`.
- Bevara lokalt arbete. Ändra ljudkedja, auth, Stripe, affärsvillkor och raderingsregler endast när uppgiften uttryckligen omfattar ändringen.
- Dela inte miljöhemligheter eller kundmaterial i instruktioner, rapporter eller Git.
- Relevant kodverifiering: `npm run build`; kör riktad kontroll efter ändringar. Lokala beroenden saknades vid överlämningen; en lyckad produktionsbuild är inte ett lokalt test.
- HS256-uppladdningstoken används redan. Ett påstått äldre JWE-problem är ingen verifierad aktuell felorsak.
- Local Run kan köras helt på MacBook eller via tunnel till Mac Mini. Båda använder lokalt 8766 och får inte startas samtidigt.

## Supabase B2C queue
- Read `CLOUD-QUEUE.md`. Marcus approved direct private Storage uploads for Creator, Studio and Founding on 2026-09-11. Free inputs and all results remain on Mini.
- B2B and Local Run keep their current paths. Paid cloud uploads depend on the queue, not Mini availability; local uploads retain the Mini health check.

## Main-domain launch: Earselect has priority
Read `EARSELECT-LAUNCH-GUARD.md` before any deployment, domain, auth-environment or redirect change. The combined launch patch must not be published to saltwaves-services; prepare saltwaves-site independently.

## Main-domain deployment target
This launch copy targets Vercel saltwaves-site (saltwaves.studio). The references above to saltwaves-services describe the source app. Never deploy this copy to saltwaves-services.
Keep AUDIOBOOK_ENABLED=false in saltwaves-site. The existing saltwaves-services deployment remains the sole scheduler for /api/queue/cleanup; do not add a cron here. Preserve the existing app-domain Stripe webhook.
