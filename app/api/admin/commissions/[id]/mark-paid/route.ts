import { NextResponse } from "next/server";
import { markCommissionAsPaidInDb } from "@/lib/adminDatabase";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ok = await markCommissionAsPaidInDb(id);

    if (!ok) {
      return NextResponse.json(
        { message: "Comissao nao encontrada ou nao esta aprovada." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao marcar comissao como paga.", details: String(error) },
      { status: 500 }
    );
  }
}
