"use client";

import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi";
import { authClient } from "@/services/clientApi";

export default function AdminProfileDetails() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cargo: "Admin Master",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    authClient
      .getProfile()
      .then((profile) => {
        if (!mounted) return;
        setForm({
          nome: profile.name,
          email: profile.email,
          telefone: profile.phone,
          cargo: "Admin Master",
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Nao foi possivel carregar o perfil.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await authClient.updateProfile({
        name: form.nome,
        email: form.email,
        phone: form.telefone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiUser className="w-5 h-5 text-sky-400" />
        Perfil do Admin
      </h3>

      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="text-sm text-slate-400">Nome</label>
          <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
            <FiUser className="text-slate-400" />
            <input
              value={form.nome}
              onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))}
              className="w-full bg-transparent text-white outline-none"
              placeholder="Seu nome"
              disabled={loading || saving}
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400">Email</label>
          <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
            <FiMail className="text-slate-400" />
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full bg-transparent text-white outline-none"
              placeholder="email@youon.com"
              disabled={loading || saving}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-400">Telefone</label>
            <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <FiPhone className="text-slate-400" />
              <input
                value={form.telefone}
                onChange={(e) => setForm((p) => ({ ...p, telefone: e.target.value }))}
                className="w-full bg-transparent text-white outline-none"
                placeholder="(xx) xxxxx-xxxx"
                disabled={loading || saving}
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Cargo</label>
            <input
              value={form.cargo}
              readOnly
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 outline-none"
            />
          </div>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={loading || saving}
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-60"
        >
          <FiSave className="w-4 h-4" />
          {saving ? "Salvando..." : saved ? "Perfil salvo" : "Salvar perfil"}
        </button>
      </form>
    </div>
  );
}
