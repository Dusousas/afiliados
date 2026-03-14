import { NextResponse } from "next/server";
import { getAffiliateDashboardDataFromDb } from "@/lib/adminDatabase";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const data = await getAffiliateDashboardDataFromDb(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao carregar dashboard do afiliado.", details: String(error) },
      { status: 500 }
    );
  }
}
