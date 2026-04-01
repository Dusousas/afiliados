import { NextResponse } from "next/server";
import { AuthError, getAccountProfile, updateCurrentUserProfile } from "@/lib/auth";

export async function GET() {
  try {
    const profile = await getAccountProfile();
    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel carregar o perfil." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const profile = await updateCurrentUserProfile(payload);
    return NextResponse.json(profile);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel atualizar o perfil." }, { status: 500 });
  }
}
