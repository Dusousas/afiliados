"use client";

import React, { useState } from "react";
import { FiAtSign, FiMail, FiPhone, FiSave, FiUser } from "react-icons/fi";

type ProfileForm = {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
};

export default function ProfileDetails() {
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: "Seu nome completo",
    userName: "@youon.afiliado",
    email: "email@youon.com",
    phone: "(11) 99999-9999",
  });

  const [saved, setSaved] = useState(false);

  const handleChange =
    (field: keyof ProfileForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
            Perfil publico
          </p>
          <h3 className="text-2xl font-semibold text-white mt-1">
            Dados da conta
          </h3>
          <p className="text-sm text-slate-400">
            Nome, email e dados basicos que aparecem para o cliente.
          </p>
        </div>
        <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Atualiza sempre que salvar
        </span>
      </div>

      <form className="grid gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-300 flex items-center gap-2">
            <FiUser className="text-sky-400" /> Nome completo
          </span>
          <input
            value={profile.fullName}
            onChange={handleChange("fullName")}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
            placeholder="Digite como quer ser exibido"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-300 flex items-center gap-2">
              <FiAtSign className="text-sky-400" /> Nome de usuario
            </span>
            <input
              value={profile.userName}
              onChange={handleChange("userName")}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
              placeholder="@usuario"
            />
            <span className="text-xs text-slate-500">
              Use apenas letras, numeros e pontos.
            </span>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-slate-300 flex items-center gap-2">
              <FiMail className="text-sky-400" /> Email principal
            </span>
            <input
              type="email"
              value={profile.email}
              onChange={handleChange("email")}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
              placeholder="email@youon.com"
            />
            <span className="text-xs text-slate-500">
              Usado para login e notificacoes prioritarias.
            </span>
          </label>
        </div>

        <label className="flex flex-col gap-1">
          <span className="text-sm text-slate-300 flex items-center gap-2">
            <FiPhone className="text-sky-400" /> Telefone/WhatsApp
          </span>
          <input
            value={profile.phone}
            onChange={handleChange("phone")}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition"
            placeholder="(DDD) 00000-0000"
          />
          <span className="text-xs text-slate-500">
            Usado em avisos urgentes e validacoes de seguranca.
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-3 rounded-lg transition-shadow shadow-lg shadow-sky-900/30"
          >
            <FiSave />
            {saved ? "Dados salvos" : "Salvar alteracoes"}
          </button>
          <span className="text-sm text-slate-500">
            Ultima revisao segura feita hoje, 08:12
          </span>
        </div>
      </form>
    </div>
  );
}
