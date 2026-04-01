import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { updateCampaignInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateCampaignInDb(id, body ?? {});

    if (!ok) {
      return NextResponse.json({ message: "Campanha nao encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao atualizar campanha.", details: String(error) },
      { status: 500 }
    );
  }
}
