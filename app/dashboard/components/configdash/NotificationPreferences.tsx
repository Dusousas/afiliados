"use client";

import React, { useState } from "react";
import { FiBell, FiMail, FiMessageCircle, FiSmartphone } from "react-icons/fi";

type Preference = {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

const preferences: Preference[] = [
  {
    id: "email",
    label: "Alertas por email",
    description: "Vendas, comissoes liberadas e avisos importantes.",
    icon: FiMail,
  },
  {
    id: "push",
    label: "Notificacoes push",
    description: "Atualizacoes rapidas no navegador e mobile.",
    icon: FiSmartphone,
  },
  {
    id: "whatsapp",
    label: "Resumo semanal no WhatsApp",
    description: "Performance do cupom, leads e checkpoints da semana.",
    icon: FiMessageCircle,
  },
];

export default function NotificationPreferences() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    whatsapp: false,
  });

  const toggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
            Comunicacao
          </p>
          <h3 className="text-2xl font-semibold text-white mt-1">
            Notificacoes e alertas
          </h3>
          <p className="text-sm text-slate-400">
            Escolha como quer ser avisado sobre movimentacoes da sua conta.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs">
          <FiBell className="text-amber-400" />
          Modo silencioso ativo das 22h as 7h
        </div>
      </div>

      <div className="space-y-4">
        {preferences.map(({ id, label, description, icon: Icon }) => {
          const isActive = enabled[id];
          return (
            <div
              key={id}
              className={`flex items-start gap-3 rounded-xl border p-4 transition ${
                isActive
                  ? "border-emerald-500/40 bg-emerald-500/5"
                  : "border-slate-800 bg-slate-950/60"
              }`}
            >
              <div className="mt-1">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-emerald-400" : "text-slate-400"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{label}</p>
                <p className="text-sm text-slate-400">{description}</p>
              </div>
              <button
                onClick={() => toggle(id)}
                className={`relative w-14 h-8 rounded-full border transition ${
                  isActive
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-slate-800 border-slate-700"
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                    isActive ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
