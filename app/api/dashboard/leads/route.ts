import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAffiliateUser } from "@/lib/auth";
import { createLeadInDb } from "@/lib/adminDatabase";

export async function POST(request: NextRequest) {
  try {
    const user = await requireAffiliateUser();
    const body = await request.json();

    const id = await createLeadInDb({
      affiliateId: user.affiliateId,
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
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel criar o lead." }, { status: 500 });
  }
}
