import { NextResponse } from "next/server";
import { clearSessionCookie, logoutCurrentSession } from "@/lib/auth";

export async function POST() {
  await logoutCurrentSession();
  const response = NextResponse.json({ success: true });
  return clearSessionCookie(response);
}
