// app/podcast-loudness-checker/tracking.ts
// Conversion instrumentation for the Loudness Inspector.
// Uses a first-party cookie scoped to .saltwaves.studio so the marker survives
// the hop to app.saltwaves.studio, where PodMaster jobs actually start.

const COOKIE = "sw_li_first_touch";
const WINDOW_DAYS = 30;

type Props = Record<string, string | number | boolean>;

function cookieDomain(): string {
  const h = window.location.hostname;
  return h.endsWith("saltwaves.studio") ? "; domain=.saltwaves.studio" : "";
}

function readCookie(): string | null {
  const hit = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE}=`));
  if (!hit) return null;
  const value = hit.slice(COOKIE.length + 1);
  return /^\d+$/.test(value) ? value : null;
}

function ensureFirstTouch(): string {
  const existing = readCookie();
  if (existing) return existing;
  const now = String(Date.now());
  const maxAge = WINDOW_DAYS * 86400;
  document.cookie =
    `${COOKIE}=${now}; path=/; max-age=${maxAge}` +
    `${cookieDomain()}; SameSite=Lax; Secure`;
  return now;
}

export function trackInspectorEvent(event: string, props: Props): void {
  if (typeof window === "undefined") return;

  const firstTouch = ensureFirstTouch();
  const payload: Props = {
    ...props,
    tool: "loudness_inspector",
    daysSinceFirstTouch: Math.floor(
      (Date.now() - Number(firstTouch)) / 86400000,
    ),
  };

  try {
    const body = JSON.stringify({ event, props: payload });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/inspector-event",
        new Blob([body], { type: "application/json" }),
      );
    } else {
      void fetch("/api/inspector-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    /* measurement must never break the tool */
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("[inspector]", event, payload);
  }
}

/** Read from the PodMaster app when a job starts, to close the loop. */
export function inspectorAttribution(): { days: number } | null {
  if (typeof window === "undefined") return null;
  const ft = readCookie();
  if (!ft) return null;
  return { days: Math.floor((Date.now() - Number(ft)) / 86400000) };
}
