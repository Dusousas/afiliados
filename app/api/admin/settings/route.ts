import { NextRequest, NextResponse } from "next/server";
import { updateSettingsInDb } from "@/lib/adminDatabase";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = await updateSettingsInDb(body ?? {});
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar configuracoes.", details: String(error) },
      { status: 500 }
    );
  }
}
