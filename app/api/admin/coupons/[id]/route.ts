import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { updateCouponInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateCouponInDb(id, body ?? {});

    if (!ok) {
      return NextResponse.json({ message: "Cupom nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao atualizar cupom.", details: String(error) },
      { status: 500 }
    );
  }
}
