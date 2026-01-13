"use client";

import React, { useState } from "react";
import { FiCheckCircle, FiKey, FiLock } from "react-icons/fi";

type PasswordForm = {
  current: string;
  next: string;
  confirm: string;
};

const requirements = [
  "Minimo 8 caracteres",
  "Pelo menos 1 letra maiuscula",
  "Um numero ou caractere especial",
];

export default function PasswordUpdate() {
  const [form, setForm] = useState<PasswordForm>({
    current: "",
    next: "",
    confirm: "",
  });

  const [updated, setUpdated] = useState(false);

  const handleChange =
    (field: keyof PasswordForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdated(true);
    setTimeout(() => setUpdated(false), 1800);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
            Acesso seguro
          </p>
          <h3 className="text-2xl font-semibold text-white mt-1">
            Trocar senha
          </h3>
          <p className="text-sm text-slate-400">
            Reforce o acesso da sua conta You On com uma senha forte.
          </p>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs">
          <FiLock />
          <span>Protegida por HTTPS</span>
        </div>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-300">Senha atual</span>
          <input
            type="password"
            value={form.current}
            onChange={handleChange("current")}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
            placeholder="Digite a senha que voce usa hoje"
            required
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-300">Nova senha</span>
            <input
              type="password"
              value={form.next}
              onChange={handleChange("next")}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
              placeholder="Crie uma senha forte"
              required
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-300">Confirmar nova senha</span>
            <input
              type="password"
              value={form.confirm}
              onChange={handleChange("confirm")}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
              placeholder="Repita a nova senha"
              required
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3 rounded-lg transition-shadow shadow-lg shadow-emerald-900/30"
          >
            <FiKey />
            {updated ? "Senha atualizada" : "Atualizar senha"}
          </button>
          <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            {requirements.map((req) => (
              <span
                key={req}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 border border-slate-700"
              >
                <FiCheckCircle className="text-emerald-400" />
                {req}
              </span>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
