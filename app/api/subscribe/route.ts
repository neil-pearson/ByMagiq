import { NextRequest, NextResponse } from "next/server";

// Maps the form's logical name to the real MailerLite group ID, so the
// client never sends a raw group ID directly.
const GROUP_IDS: Record<string, string> = {
  newsletter: "200554997365081441", // ByMagiq Newsletter
  "latticaxon-waitlist": "200555010352743485", // Latticaxon Waitlist
};

export async function POST(req: NextRequest) {
  let body: { email?: string; group?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { email, group } = body;
  const groupId = group ? GROUP_IDS[group] : undefined;

  if (!email || !groupId) {
    return NextResponse.json(
      { error: "Missing or invalid email/group" },
      { status: 400 }
    );
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    console.error("MAILERLITE_API_KEY is not set");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, groups: [groupId] }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("MailerLite subscribe failed", res.status, text);
    return NextResponse.json({ error: "MailerLite request failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
