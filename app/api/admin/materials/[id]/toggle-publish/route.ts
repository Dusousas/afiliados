import { NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { toggleMaterialPublishInDb } from "@/lib/adminDatabase";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminUser();
    const { id } = await context.params;
    const ok = await toggleMaterialPublishInDb(id);

    if (!ok) {
      return NextResponse.json({ message: "Material nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao alternar publicacao do material.", details: String(error) },
      { status: 500 }
    );
  }
}
