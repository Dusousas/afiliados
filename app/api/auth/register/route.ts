import { NextResponse } from "next/server";
import { applySessionCookie, AuthError, getRedirectPathForRole, registerAffiliateUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const name = String(payload.name ?? "").trim();
    const email = String(payload.email ?? "").trim();
    const password = String(payload.password ?? "");
    const phone = String(payload.phone ?? "").trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Preencha nome, email e senha para criar sua conta." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "A senha precisa ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const { user, token } = await registerAffiliateUser({ name, email, password, phone });
    const response = NextResponse.json({
      user,
      redirectTo: getRedirectPathForRole(user.role),
    });

    return applySessionCookie(response, token);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel criar a conta." }, { status: 500 });
  }
}
