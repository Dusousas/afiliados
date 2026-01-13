"use client";

import React, { useState } from "react";
import { FiLock, FiSave } from "react-icons/fi";

export default function AdminPasswordUpdate() {
  const [form, setForm] = useState({
    atual: "",
    nova: "",
    confirmacao: "",
  });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nova || form.nova !== form.confirmacao) return;
    // TODO: integrar com API
    console.log("Trocar senha admin:", form);
    setForm({ atual: "", nova: "", confirmacao: "" });
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiLock className="w-5 h-5 text-amber-300" />
        Senha
      </h3>

      <form onSubmit={onSave} className="space-y-3">
        <div>
          <label className="text-sm text-slate-400">Senha atual</label>
          <input
            type="password"
            value={form.atual}
            onChange={(e) => setForm((p) => ({ ...p, atual: e.target.value }))}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Nova senha</label>
          <input
            type="password"
            value={form.nova}
            onChange={(e) => setForm((p) => ({ ...p, nova: e.target.value }))}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Confirmar nova senha</label>
          <input
            type="password"
            value={form.confirmacao}
            onChange={(e) =>
              setForm((p) => ({ ...p, confirmacao: e.target.value }))
            }
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          <FiSave className="w-4 h-4" />
          Atualizar senha
        </button>

        <p className="text-slate-500 text-xs">
          Dica: ative 2FA e use uma senha forte — conta admin é crítica.
        </p>
      </form>
    </div>
  );
}
