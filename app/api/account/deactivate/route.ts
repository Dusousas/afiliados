import { NextResponse } from "next/server";
import { clearSessionCookie, AuthError, deactivateCurrentUserAccount } from "@/lib/auth";

export async function POST() {
  try {
    const result = await deactivateCurrentUserAccount();
    const response = NextResponse.json(result);
    return clearSessionCookie(response);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel desativar a conta." }, { status: 500 });
  }
}
