import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { updateSettingsInDb } from "@/lib/adminDatabase";

export async function PATCH(request: NextRequest) {
  try {
    await requireAdminUser();
    const body = await request.json();
    const settings = await updateSettingsInDb(body ?? {});
    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao atualizar configuracoes.", details: String(error) },
      { status: 500 }
    );
  }
}
