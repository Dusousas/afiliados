import { NextRequest, NextResponse } from "next/server";
import { updateLeadInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateLeadInDb(id, {
      status: body.status,
      notes: body.notes,
      potentialValue: body.potentialValue,
    });

    if (!ok) {
      return NextResponse.json({ message: "Lead nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar lead.", details: String(error) },
      { status: 500 }
    );
  }
}
