import { NextRequest, NextResponse } from "next/server";
import { createCampaignInDb } from "@/lib/adminDatabase";

export async function POST(request: NextRequest) {
  try {
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
    return NextResponse.json(
      { message: "Erro ao criar campanha.", details: String(error) },
      { status: 500 }
    );
  }
}
