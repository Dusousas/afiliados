import { NextResponse } from "next/server";
import { AuthError, requireCurrentUser } from "@/lib/auth";
import { getAffiliateDashboardDataFromDb } from "@/lib/adminDatabase";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await context.params;

    if (user.role !== "admin" && user.affiliateId !== id) {
      return NextResponse.json({ message: "Acesso nao autorizado." }, { status: 403 });
    }

    const data = await getAffiliateDashboardDataFromDb(id);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao carregar dashboard do afiliado.", details: String(error) },
      { status: 500 }
    );
  }
}
