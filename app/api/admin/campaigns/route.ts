import { NextRequest, NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { createCampaignInDb } from "@/lib/adminDatabase";

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();
    const body = await request.json();
    const id = await createCampaignInDb({
      name: body.name,
      description: body.description,
      status: body.status,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao criar campanha.", details: String(error) },
      { status: 500 }
    );
  }
}
