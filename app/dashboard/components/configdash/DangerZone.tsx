"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiAlertTriangle, FiArchive, FiXCircle } from "react-icons/fi";
import { authClient } from "@/services/clientApi";

export default function DangerZone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleDeactivate = async () => {
    setLoading(true);
    setError("");

    try {
      await authClient.deactivateAccount();
      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel desativar a conta.");
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-900/70 via-red-800/60 to-slate-900/80 border border-red-800/60 rounded-2xl p-6 shadow-xl text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <FiAlertTriangle className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Zona de risco</h3>
            <p className="text-sm text-red-100/80">
              Exportar dados ou encerrar conta. Estas acoes nao podem ser desfeitas.
            </p>
            {error ? <p className="mt-2 text-sm text-amber-200">{error}</p> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-sm border border-white/20 transition">
            <FiArchive />
            Exportar dados
          </button>
          <button
            onClick={handleDeactivate}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-semibold transition shadow-lg shadow-red-900/30 disabled:opacity-60"
          >
            <FiXCircle />
            {loading ? "Desativando..." : "Desativar conta"}
          </button>
        </div>
      </div>
    </div>
  );
}
