// app/api/inspector-event/route.ts
// Receives Loudness Inspector events. Measurements only — never audio,
// never anything that identifies a person.

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "analysis_started",
  "analysis_completed",
  "analysis_failed",
  "target_changed",
]);

const num = (v: unknown): number | null =>
  typeof v === "number" && isFinite(v) ? v : null;

const str = (v: unknown, max = 64): string | null =>
  typeof v === "string" ? v.slice(0, max) : null;

export async function POST(request: Request) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("[inspector] missing supabase env");
    return NextResponse.json({ ok: true });
  }

  let body: { event?: unknown; props?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = str(body.event, 40);
  if (!event || !ALLOWED.has(event)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const p = body.props ?? {};
  const days = num(p.daysSinceFirstTouch);

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.from("inspector_events").insert({
    event,
    tool: str(p.tool, 40) ?? "loudness_inspector",
    days_since_first_touch: days === null ? null : Math.round(days),
    duration_min: num(p.durationMin),
    integrated_lufs: num(p.integratedLufs),
    true_peak_db: num(p.truePeakDb),
    lra: num(p.lra),
    elapsed_sec: num(p.elapsedSec),
    target: str(p.target, 40),
    referrer: str(request.headers.get("referer"), 300),
    props: p,
  });
  if (error) console.error("[inspector] insert failed", error.message);

  return NextResponse.json({ ok: true });
}
