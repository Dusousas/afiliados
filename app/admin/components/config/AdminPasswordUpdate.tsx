"use client";

import React, { useState } from "react";
import { FiLock, FiSave } from "react-icons/fi";
import { authClient } from "@/services/clientApi";

export default function AdminPasswordUpdate() {
  const [form, setForm] = useState({
    atual: "",
    nova: "",
    confirmacao: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.nova || form.nova !== form.confirmacao) {
      setError("A confirmacao da nova senha nao confere.");
      return;
    }

    setLoading(true);

    try {
      await authClient.updatePassword({
        currentPassword: form.atual,
        newPassword: form.nova,
      });
      setForm({ atual: "", nova: "", confirmacao: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel atualizar a senha.");
    } finally {
      setLoading(false);
    }
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
            placeholder="Digite a senha atual"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Nova senha</label>
          <input
            type="password"
            value={form.nova}
            onChange={(e) => setForm((p) => ({ ...p, nova: e.target.value }))}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
            placeholder="Digite a nova senha"
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">Confirmar nova senha</label>
          <input
            type="password"
            value={form.confirmacao}
            onChange={(e) => setForm((p) => ({ ...p, confirmacao: e.target.value }))}
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
            placeholder="Repita a nova senha"
          />
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          <FiSave className="w-4 h-4" />
          {loading ? "Atualizando..." : success ? "Senha atualizada" : "Atualizar senha"}
        </button>

        <p className="text-slate-500 text-xs">
          Dica: ative 2FA e use uma senha forte. Conta admin e critica.
        </p>
      </form>
    </div>
  );
}
