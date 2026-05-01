import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Stub: in production, deliver to inbox (Resend, Postmark, etc.)
  console.log("[brief] received:", body);

  return NextResponse.json({ ok: true });
}
