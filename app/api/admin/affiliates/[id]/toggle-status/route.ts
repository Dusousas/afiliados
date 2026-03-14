import { NextResponse } from "next/server";
import { toggleAffiliateStatusInDb } from "@/lib/adminDatabase";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ok = await toggleAffiliateStatusInDb(id);

    if (!ok) {
      return NextResponse.json({ message: "Afiliado nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao alternar status do afiliado.", details: String(error) },
      { status: 500 }
    );
  }
}
