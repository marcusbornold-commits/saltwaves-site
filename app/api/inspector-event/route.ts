import { NextResponse } from "next/server";
// Also reject events from already-open tabs running the previous client bundle.
export async function POST() {
  return NextResponse.json({ ok: false, error: "Analytics collection is paused" }, { status: 410 });
}
