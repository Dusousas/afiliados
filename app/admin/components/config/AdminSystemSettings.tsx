"use client";

import React, { useState } from "react";
import { FiSettings, FiSave, FiPercent, FiDollarSign, FiGift } from "react-icons/fi";

export default function AdminSystemSettings() {
  const [settings, setSettings] = useState({
    comissaoPadraoPercent: "15",
    bonusCampanhaPercent: "5",
    payoutMinimo: "200",
    payoutFrequencia: "quinzenal",
    permitirResgatePremios: true,
    bloquearAfiliadoInadimplente: true,
  });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar com API
    console.log("Salvar settings do sistema:", settings);
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiSettings className="w-5 h-5 text-sky-400" />
        Configurações do Programa
      </h3>

      <form onSubmit={onSave} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-slate-400">Comissão padrão</label>
            <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <FiPercent className="text-slate-400" />
              <input
                value={settings.comissaoPadraoPercent}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, comissaoPadraoPercent: e.target.value }))
                }
                className="w-full bg-transparent text-white outline-none"
                placeholder="15"
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">Percentual padrão do programa.</p>
          </div>

          <div>
            <label className="text-sm text-slate-400">Bônus campanha</label>
            <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <FiPercent className="text-slate-400" />
              <input
                value={settings.bonusCampanhaPercent}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, bonusCampanhaPercent: e.target.value }))
                }
                className="w-full bg-transparent text-white outline-none"
                placeholder="5"
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">Extra em campanhas promocionais.</p>
          </div>

          <div>
            <label className="text-sm text-slate-400">Payout mínimo</label>
            <div className="mt-1 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
              <FiDollarSign className="text-slate-400" />
              <input
                value={settings.payoutMinimo}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, payoutMinimo: e.target.value }))
                }
                className="w-full bg-transparent text-white outline-none"
                placeholder="200"
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">Valor mínimo para saque.</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-400">Frequência de payout</label>
          <select
            value={settings.payoutFrequencia}
            onChange={(e) =>
              setSettings((p) => ({ ...p, payoutFrequencia: e.target.value }))
            }
            className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-sky-500"
          >
            <option value="semanal">Semanal</option>
            <option value="quinzenal">Quinzenal</option>
            <option value="mensal">Mensal</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ToggleCard
            icon={<FiGift className="w-4 h-4 text-emerald-300" />}
            title="Permitir resgate de prêmios"
            desc="Libera o módulo de prêmios para afiliados."
            value={settings.permitirResgatePremios}
            onChange={(v) => setSettings((p) => ({ ...p, permitirResgatePremios: v }))}
          />

          <ToggleCard
            icon={<FiDollarSign className="w-4 h-4 text-amber-300" />}
            title="Bloquear afiliado inadimplente"
            desc="Restrição de recursos se houver problema de pagamento/contrato."
            value={settings.bloquearAfiliadoInadimplente}
            onChange={(v) =>
              setSettings((p) => ({ ...p, bloquearAfiliadoInadimplente: v }))
            }
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          <FiSave className="w-4 h-4" />
          Salvar configurações
        </button>
      </form>
    </div>
  );
}

function ToggleCard({
  icon,
  title,
  desc,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <p className="text-white font-semibold">{title}</p>
          <p className="text-slate-400 text-sm">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
          value
            ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
        }`}
      >
        {value ? "Ativo" : "Inativo"}
      </button>
    </div>
  );
}
