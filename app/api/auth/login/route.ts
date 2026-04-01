import { NextResponse } from "next/server";
import { applySessionCookie, AuthError, getRedirectPathForRole, loginWithEmail } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const email = String(payload.email ?? "");
    const password = String(payload.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { message: "Informe email e senha para entrar." },
        { status: 400 }
      );
    }

    const { user, token } = await loginWithEmail({ email, password });
    const response = NextResponse.json({
      user,
      redirectTo: getRedirectPathForRole(user.role),
    });

    return applySessionCookie(response, token);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel fazer login." }, { status: 500 });
  }
}
