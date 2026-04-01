"use client";

import React, { useEffect, useState } from "react";
import { FiAtSign, FiMail, FiPhone, FiSave, FiUser } from "react-icons/fi";
import { authClient } from "@/services/clientApi";

type ProfileForm = {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
};

export default function ProfileDetails() {
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    authClient
      .getProfile()
      .then((data) => {
        if (!mounted) return;
        setProfile({
          fullName: data.name,
          userName: data.username,
          email: data.email,
          phone: data.phone,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Nao foi possivel carregar seu perfil.");
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange =
    (field: keyof ProfileForm) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setProfile((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const nextProfile = await authClient.updateProfile({
        name: profile.fullName,
        username: profile.userName,
        email: profile.email,
        phone: profile.phone,
      });

      setProfile({
        fullName: nextProfile.name,
        userName: nextProfile.username,
        email: nextProfile.email,
        phone: nextProfile.phone,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel salvar as alteracoes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">Perfil publico</p>
          <h3 className="text-2xl font-semibold text-white mt-1">Dados da conta</h3>
          <p className="text-sm text-slate-400">
            Nome, email e dados basicos que aparecem para o cliente.
          </p>
        </div>
        <span className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          {loading ? "Carregando" : "Sincronizado com o banco"}
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
            disabled={loading || saving}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition disabled:opacity-60"
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
              disabled={loading || saving}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition disabled:opacity-60"
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
              disabled={loading || saving}
              className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition disabled:opacity-60"
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
            disabled={loading || saving}
            className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none transition disabled:opacity-60"
            placeholder="(DDD) 00000-0000"
          />
          <span className="text-xs text-slate-500">
            Usado em avisos urgentes e validacoes de seguranca.
          </span>
        </label>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || saving}
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-5 py-3 rounded-lg transition-shadow shadow-lg shadow-sky-900/30 disabled:opacity-60"
          >
            <FiSave />
            {saving ? "Salvando..." : saved ? "Dados salvos" : "Salvar alteracoes"}
          </button>
          <span className="text-sm text-slate-500">
            {saved ? "Perfil atualizado com sucesso." : "As alteracoes ficam gravadas no banco."}
          </span>
        </div>
      </form>
    </div>
  );
}
