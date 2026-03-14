import { NextRequest, NextResponse } from "next/server";
import { updateCampaignInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateCampaignInDb(id, body ?? {});

    if (!ok) {
      return NextResponse.json({ message: "Campanha nao encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar campanha.", details: String(error) },
      { status: 500 }
    );
  }
}
