import { NextResponse } from "next/server";
import { AuthError, createAffiliateAccountAsAdmin, requireAdminUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await requireAdminUser();
    const body = await request.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { message: "Preencha nome, email e senha para criar o afiliado." },
        { status: 400 }
      );
    }

    const result = await createAffiliateAccountAsAdmin({
      name: String(body.name),
      email: String(body.email),
      password: String(body.password),
      phone: String(body.phone ?? ""),
      city: String(body.city ?? ""),
      state: String(body.state ?? ""),
      status: body.status,
    });

    return NextResponse.json(
      { success: true, affiliateId: result.user.affiliateId, userId: result.user.id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json({ message: "Nao foi possivel criar a conta do afiliado." }, { status: 500 });
  }
}
