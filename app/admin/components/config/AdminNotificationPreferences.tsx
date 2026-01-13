"use client";

import React, { useState } from "react";
import { FiBell, FiSave } from "react-icons/fi";

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
    // TODO: integrar com API
    console.log("Notificações admin:", prefs);
  };

  const Row = ({
    title,
    desc,
    value,
    onChange,
  }: {
    title: string;
    desc: string;
    value: boolean;
    onChange: (v: boolean) => void;
  }) => (
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

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiBell className="w-5 h-5 text-sky-400" />
        Notificações do Admin
      </h3>

      <form onSubmit={onSave} className="space-y-3">
        <Row
          title="Novos leads na fila"
          desc="Sempre que um afiliado cadastrar um lead."
          value={prefs.novosLeads}
          onChange={(v) => setPrefs((p) => ({ ...p, novosLeads: v }))}
        />
        <Row
          title="Novos afiliados cadastrados"
          desc="Entrada de novos afiliados e aprovações."
          value={prefs.novosAfiliados}
          onChange={(v) => setPrefs((p) => ({ ...p, novosAfiliados: v }))}
        />
        <Row
          title="Resgates de prêmio"
          desc="Quando um afiliado solicitar um prêmio."
          value={prefs.resgatesPremio}
          onChange={(v) => setPrefs((p) => ({ ...p, resgatesPremio: v }))}
        />
        <Row
          title="Pedidos de saque"
          desc="Solicitações de retirada de comissão."
          value={prefs.pedidosSaque}
          onChange={(v) => setPrefs((p) => ({ ...p, pedidosSaque: v }))}
        />
        <Row
          title="Alertas de segurança"
          desc="Logins novos, tentativas suspeitas, mudança de senha."
          value={prefs.alertasSeguranca}
          onChange={(v) => setPrefs((p) => ({ ...p, alertasSeguranca: v }))}
        />
        <Row
          title="Resumo semanal"
          desc="Resumo automático de métricas e pendências."
          value={prefs.resumoSemanal}
          onChange={(v) => setPrefs((p) => ({ ...p, resumoSemanal: v }))}
        />

        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
        >
          <FiSave className="w-4 h-4" />
          Salvar preferências
        </button>
      </form>
    </div>
  );
}
