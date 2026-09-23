import { NextRequest, NextResponse } from "next/server";

import { processDueWhatsAppReminders } from "@/lib/whatsapp/reminders";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;

  if (!secret && process.env.NODE_ENV === "development") {
    return true;
  }

  if (!secret) {
    return false;
  }

  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await processDueWhatsAppReminders();

  return NextResponse.json({
    ok: true,
    timeZone: "America/Argentina/Buenos_Aires",
    result
  });
}
