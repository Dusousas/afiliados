"use client";

import React, { useState } from "react";
import { FiAlertTriangle, FiTrash2, FiLock } from "react-icons/fi";

export default function AdminDangerZone() {
  const [confirm, setConfirm] = useState("");

  const resetProgram = () => {
    if (confirm !== "RESETAR") return;
    // TODO: integrar com API
    console.log("RESETAR programa inteiro (mock)");
    setConfirm("");
  };

  const disableAccount = () => {
    // TODO: integrar com API
    console.log("Desativar conta admin (mock)");
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-red-500/30">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <FiAlertTriangle className="w-5 h-5 text-red-300" />
        Danger Zone
      </h3>
      <p className="text-slate-400 text-sm mb-4">
        Ações críticas. Use com cuidado — ideal ter confirmação no backend.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reset do programa */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-white font-semibold">Resetar configurações do programa</p>
          <p className="text-slate-400 text-sm mt-1">
            Reseta regras/padrões (não recomendado em produção).
          </p>

          <div className="mt-3">
            <label className="text-xs text-slate-500">Digite RESETAR para confirmar</label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500"
              placeholder="RESETAR"
            />
          </div>

          <button
            onClick={resetProgram}
            className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              confirm === "RESETAR"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
            }`}
          >
            <FiTrash2 className="w-4 h-4" />
            Resetar
          </button>
        </div>

        {/* Desativar conta */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
          <p className="text-white font-semibold">Desativar conta admin</p>
          <p className="text-slate-400 text-sm mt-1">
            Remove acesso ao painel. Recomenda-se ter outro admin ativo.
          </p>

          <button
            onClick={disableAccount}
            className="mt-3 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <FiLock className="w-4 h-4" />
            Desativar conta
          </button>
        </div>
      </div>
    </div>
  );
}
