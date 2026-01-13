"use client";

import React from "react";
import { FiMail, FiShield, FiTrendingUp } from "react-icons/fi";
import DangerZone from "./DangerZone";
import NotificationPreferences from "./NotificationPreferences";
import PasswordUpdate from "./PasswordUpdate";
import ProfileDetails from "./ProfileDetails";
import SecuritySessions from "./SecuritySessions";

const highlights = [
  {
    label: "Plano",
    value: "Pro Afiliado",
    desc: "Acesso completo ao painel",
    icon: FiTrendingUp,
  },
  {
    label: "Email verificado",
    value: "Ativo",
    desc: "Revalidado esta semana",
    icon: FiMail,
  },
  {
    label: "Seguranca",
    value: "2FA via email",
    desc: "Avisos em logins novos",
    icon: FiShield,
  },
];

export default function Config() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-sky-700 to-blue-700 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center font-bold text-xl">
                SN
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-100">
                  Configuracoes da conta
                </p>
                <h1 className="text-3xl font-bold">Central de ajustes</h1>
                <p className="text-sm text-blue-100/80">
                  Edite seu perfil, senha, notificacoes e controle de acesso em
                  um unico lugar.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/15 border border-white/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Ultima revisao automatica ha 5 minutos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
            {highlights.map(({ label, value, desc, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-2 text-sm text-blue-50">
                  <Icon className="text-white/80" />
                  {label}
                </div>
                <p className="text-xl font-semibold">{value}</p>
                <p className="text-xs text-blue-100/80">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <ProfileDetails />
          <PasswordUpdate />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <NotificationPreferences />
          <SecuritySessions />
        </div>

        <DangerZone />
      </div>
    </section>
  );
}
