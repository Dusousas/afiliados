"use client";

import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiSave } from "react-icons/fi";

export default function AdminProfileDetails() {
  const [form, setForm] = useState({
    nome: "Admin You On",
    email: "admin@youon.com",
    telefone: "(11) 90000-0000",
    cargo: "Admin Master",
  });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com API
    console.log("Salvar perfil admin:", form);
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
                onChange={(e) =>
                  setForm((p) => ({ ...p, telefone: e.target.value }))
                }
                className="w-full bg-transparent text-white outline-none"
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">Cargo</label>
            <input
              value={form.cargo}
              onChange={(e) => setForm((p) => ({ ...p, cargo: e.target.value }))}
              className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
              placeholder="Admin"
            />
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          <FiSave className="w-4 h-4" />
          Salvar perfil
        </button>
      </form>
    </div>
  );
}
