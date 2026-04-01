import { NextResponse } from "next/server";
import { AuthError, requireAdminUser } from "@/lib/auth";
import { getAdminSnapshotFromDb } from "@/lib/adminDatabase";

export async function GET() {
  try {
    await requireAdminUser();
    const snapshot = await getAdminSnapshotFromDb();
    return NextResponse.json(snapshot);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Erro ao carregar snapshot admin.", details: String(error) },
      { status: 500 }
    );
  }
}
