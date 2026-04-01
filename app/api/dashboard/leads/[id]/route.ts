import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAffiliateUser } from "@/lib/auth";
import { updateAffiliateLeadInDb } from "@/lib/adminDatabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAffiliateUser();
    const { id } = await context.params;
    const body = await request.json();

    const ok = await updateAffiliateLeadInDb(user.affiliateId, id, {
      status: body.status,
      notes: body.notes,
      potentialValue: body.potentialValue,
    });

    if (!ok) {
      return NextResponse.json({ message: "Lead nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel atualizar o lead." }, { status: 500 });
  }
}
