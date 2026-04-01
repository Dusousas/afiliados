import { NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { toggleCouponStatusInDb } from "@/lib/adminDatabase";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await context.params;
    const ok = await toggleCouponStatusInDb(id);

    if (!ok) {
      return NextResponse.json({ message: "Cupom nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao alternar status do cupom.", details: String(error) },
      { status: 500 }
    );
  }
}
