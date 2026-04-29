import { NextResponse } from "next/server";

type MailerLiteErrorResponse = {
  message?: string;
  error?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey || !groupId) {
    return NextResponse.json(
      { error: "Missing MailerLite server configuration." },
      { status: 500 }
    );
  }

  let email = "";
  try {
    const body = (await request.json()) as { email?: string };
    email = body.email?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });
  }

  try {
    const mailerLiteResponse = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        groups: [groupId],
      }),
      cache: "no-store",
    });

    if (!mailerLiteResponse.ok) {
      const errorPayload = (await mailerLiteResponse
        .json()
        .catch(() => ({}))) as MailerLiteErrorResponse;

      return NextResponse.json(
        {
          error:
            errorPayload.message ||
            errorPayload.error ||
            "Could not subscribe right now.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to reach MailerLite." }, { status: 502 });
  }
}
