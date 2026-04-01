import { NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { approveCommissionInDb } from "@/lib/adminDatabase";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await context.params;
    const ok = await approveCommissionInDb(id);

    if (!ok) {
      return NextResponse.json(
        { message: "Comissao nao encontrada ou nao esta pendente." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao aprovar comissao.", details: String(error) },
      { status: 500 }
    );
  }
}
