"use client";

import { FiShield, FiTrendingUp, FiUsers } from "react-icons/fi";
import AdminProfileDetails from "./AdminProfileDetails";
import AdminPasswordUpdate from "./AdminPasswordUpdate";
import AdminNotificationPreferences from "./AdminNotificationPreferences";
import AdminSecuritySessions from "./AdminSecuritySessions";
import AdminSystemSettings from "./AdminSystemSettings";
import AdminPermissions from "./AdminPermissions";
import AdminDangerZone from "./AdminDangerZone";


const highlights = [
  {
    label: "Cargo",
    value: "Admin Master",
    desc: "Permissões totais no painel",
    icon: FiUsers,
  },
  {
    label: "Segurança",
    value: "2FA ativo",
    desc: "Proteção extra em logins",
    icon: FiShield,
  },
  {
    label: "Sistema",
    value: "Programa rodando",
    desc: "Afiliados e métricas online",
    icon: FiTrendingUp,
  },
];

export default function ConfigAdmin() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 to-blue-700 rounded-2xl p-6 shadow-xl text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center font-bold text-xl">
                AD
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-blue-100">
                  Configurações — Admin
                </p>
                <h1 className="text-3xl font-bold">Central de Ajustes</h1>
                <p className="text-sm text-blue-100/80">
                  Gerencie seu perfil, segurança, notificações e as regras do
                  programa de afiliados.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm bg-white/15 border border-white/20 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              Última auditoria: há 5 minutos
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

        {/* Perfil + Senha */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <AdminProfileDetails />
          <AdminPasswordUpdate />
        </div>

        {/* Notificações + Sessões */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          <AdminNotificationPreferences />
          <AdminSecuritySessions />
        </div>

        {/* Sistema + Permissões */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <AdminSystemSettings />
          <AdminPermissions />
        </div>

        {/* Danger Zone */}
        <AdminDangerZone />
      </div>
    </section>
  );
}
