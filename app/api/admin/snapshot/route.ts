import { NextResponse } from "next/server";
import { getAdminSnapshotFromDb } from "@/lib/adminDatabase";

export async function GET() {
  try {
    const snapshot = await getAdminSnapshotFromDb();
    return NextResponse.json(snapshot);
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao carregar snapshot admin.", details: String(error) },
      { status: 500 }
    );
  }
}
