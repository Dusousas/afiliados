import { NextRequest, NextResponse } from "next/server";
import { createLeadInDb } from "@/lib/adminDatabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = await createLeadInDb({
      affiliateId: body.affiliateId,
      name: body.name,
      origin: body.origin,
      potentialValue: Number(body.potentialValue ?? 0),
      notes: body.notes,
    });

    if (!id) {
      return NextResponse.json({ message: "Afiliado nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar lead.", details: String(error) },
      { status: 500 }
    );
  }
}
