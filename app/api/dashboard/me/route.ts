import { NextResponse } from "next/server";
import { AuthError, requireAffiliateUser } from "@/lib/auth";
import { getAffiliateDashboardDataFromDb } from "@/lib/adminDatabase";

export async function GET() {
  try {
    const user = await requireAffiliateUser();
    const data = await getAffiliateDashboardDataFromDb(user.affiliateId);
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Nao foi possivel carregar o dashboard do afiliado." },
      { status: 500 }
    );
  }
}
