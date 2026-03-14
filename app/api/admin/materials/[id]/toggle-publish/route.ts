import { NextResponse } from "next/server";
import { toggleMaterialPublishInDb } from "@/lib/adminDatabase";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const ok = await toggleMaterialPublishInDb(id);

    if (!ok) {
      return NextResponse.json({ message: "Material nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao alternar publicacao do material.", details: String(error) },
      { status: 500 }
    );
  }
}
