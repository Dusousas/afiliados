import { NextResponse } from "next/server";
import { AuthError, updateCurrentUserPassword } from "@/lib/auth";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const result = await updateCurrentUserPassword({
      currentPassword: String(body.currentPassword ?? ""),
      newPassword: String(body.newPassword ?? ""),
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel atualizar a senha." }, { status: 500 });
  }
}
