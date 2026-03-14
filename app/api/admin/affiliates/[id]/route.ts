import { NextRequest, NextResponse } from "next/server";
import { updateAffiliateInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateAffiliateInDb(id, body ?? {});

    if (!ok) {
      return NextResponse.json({ message: "Afiliado nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar afiliado.", details: String(error) },
      { status: 500 }
    );
  }
}
