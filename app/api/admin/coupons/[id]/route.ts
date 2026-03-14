import { NextRequest, NextResponse } from "next/server";
import { updateCouponInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateCouponInDb(id, body ?? {});

    if (!ok) {
      return NextResponse.json({ message: "Cupom nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao atualizar cupom.", details: String(error) },
      { status: 500 }
    );
  }
}
