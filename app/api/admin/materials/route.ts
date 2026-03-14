import { NextRequest, NextResponse } from "next/server";
import { createMaterialInDb } from "@/lib/adminDatabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const id = await createMaterialInDb({
      campaignId: body.campaignId,
      title: body.title,
      type: body.type,
      description: body.description,
      url: body.url,
      fileName: body.fileName,
      isPublished: Boolean(body.isPublished),
    });

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar material.", details: String(error) },
      { status: 500 }
    );
  }
}
