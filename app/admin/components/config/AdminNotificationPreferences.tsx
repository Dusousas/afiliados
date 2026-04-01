"use client";

import React, { useState } from "react";
import { FiBell, FiSave } from "react-icons/fi";

type PreferenceRowProps = {
  title: string;
  desc: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

function PreferenceRow({ title, desc, value, onChange }: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 bg-slate-900 border border-slate-700 rounded-xl p-4">
      <div>
        <p className="text-white font-semibold">{title}</p>
        <p className="text-slate-400 text-sm">{desc}</p>
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

export default function AdminNotificationPreferences() {
  const [prefs, setPrefs] = useState({
    novosLeads: true,
    novosAfiliados: true,
    resgatesPremio: true,
    pedidosSaque: true,
    alertasSeguranca: true,
    resumoSemanal: false,
  });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notificacoes admin:", prefs);
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiBell className="w-5 h-5 text-sky-400" />
        Notificacoes do Admin
      </h3>

      <form onSubmit={onSave} className="space-y-3">
        <PreferenceRow
          title="Novos leads na fila"
          desc="Sempre que um afiliado cadastrar um lead."
          value={prefs.novosLeads}
          onChange={(value) => setPrefs((prev) => ({ ...prev, novosLeads: value }))}
        />
        <PreferenceRow
          title="Novos afiliados cadastrados"
          desc="Entrada de novos afiliados e aprovacoes."
          value={prefs.novosAfiliados}
          onChange={(value) => setPrefs((prev) => ({ ...prev, novosAfiliados: value }))}
        />
        <PreferenceRow
          title="Resgates de premio"
          desc="Quando um afiliado solicitar um premio."
          value={prefs.resgatesPremio}
          onChange={(value) => setPrefs((prev) => ({ ...prev, resgatesPremio: value }))}
        />
        <PreferenceRow
          title="Pedidos de saque"
          desc="Solicitacoes de retirada de comissao."
          value={prefs.pedidosSaque}
          onChange={(value) => setPrefs((prev) => ({ ...prev, pedidosSaque: value }))}
        />
        <PreferenceRow
          title="Alertas de seguranca"
          desc="Logins novos, tentativas suspeitas, mudanca de senha."
          value={prefs.alertasSeguranca}
          onChange={(value) => setPrefs((prev) => ({ ...prev, alertasSeguranca: value }))}
        />
        <PreferenceRow
          title="Resumo semanal"
          desc="Resumo automatico de metricas e pendencias."
          value={prefs.resumoSemanal}
          onChange={(value) => setPrefs((prev) => ({ ...prev, resumoSemanal: value }))}
        />

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          <FiSave className="w-4 h-4" />
          Salvar preferencias
        </button>
      </form>
    </div>
  );
}
