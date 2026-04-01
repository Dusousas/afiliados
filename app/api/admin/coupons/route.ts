import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { createCouponInDb } from "@/lib/adminDatabase";

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();
    const body = await request.json();

    const id = await createCouponInDb({
      code: body.code,
      link: body.link,
      status: body.status,
      affiliateId: body.affiliateId,
      affiliateName: body.affiliateName,
      discountPercent: Number(body.discountPercent ?? 0),
      commissionPercent: Number(body.commissionPercent ?? 0),
      expiresAt: body.expiresAt,
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao criar cupom.", details: String(error) },
      { status: 500 }
    );
  }
}
