"use client";

import React, { useMemo, useState } from "react";
import {
  FiUserPlus,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiPlus,
  FiEdit2,
  FiDollarSign,
} from "react-icons/fi";

type LeadStatus = "Prospect" | "Contato" | "Fechado";

type Lead = {
  id: number;
  nome: string;
  status: LeadStatus;
  origem: string;
  valor: number;
  ultimoContato: string;
  nota?: string;
};

const statusStyles: Record<LeadStatus, string> = {
  Prospect: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Contato: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  Fechado: "bg-green-500/15 text-green-300 border border-green-500/30",
};

const initialLeads: Lead[] = [
  {
    id: 1,
    nome: "Carla Lima",
    status: "Fechado",
    origem: "Instagram",
    valor: 1800,
    ultimoContato: "2025-11-21",
    nota: "Fechou combo site + social",
  },
  {
    id: 2,
    nome: "Lucas Andrade",
    status: "Contato",
    origem: "WhatsApp",
    valor: 1200,
    ultimoContato: "2025-11-23",
    nota: "Quer proposta detalhada",
  },
  {
    id: 3,
    nome: "Marta Campos",
    status: "Prospect",
    origem: "Indicacao",
    valor: 900,
    ultimoContato: "2025-11-20",
  },
  {
    id: 4,
    nome: "Studio Alpha",
    status: "Fechado",
    origem: "LinkedIn",
    valor: 2400,
    ultimoContato: "2025-11-18",
    nota: "Retorno em 30 dias",
  },
];

export default function Indicacoes() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [novoLead, setNovoLead] = useState({
    nome: "",
    origem: "",
    valor: "",
    status: "Prospect" as LeadStatus,
    nota: "",
  });

  const stats = useMemo(() => {
    const total = leads.length;
    const fechados = leads.filter((l) => l.status === "Fechado");
    const emContato = leads.filter((l) => l.status === "Contato");
    const prospect = leads.filter((l) => l.status === "Prospect");
    const receitaPrevista = leads.reduce((sum, l) => sum + l.valor, 0);
    const receitaFechada = fechados.reduce((sum, l) => sum + l.valor, 0);

    return {
      total,
      fechados: fechados.length,
      emContato: emContato.length,
      prospect: prospect.length,
      receitaPrevista,
      receitaFechada,
    };
  }, [leads]);

  const addLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoLead.nome.trim()) return;

    const parsedValor = parseFloat(novoLead.valor) || 0;

    setLeads((prev) => [
      {
        id: Date.now(),
        nome: novoLead.nome.trim(),
        origem: novoLead.origem.trim() || "Manual",
        valor: parsedValor,
        status: novoLead.status,
        ultimoContato: new Date().toISOString().split("T")[0],
        nota: novoLead.nota.trim() || undefined,
      },
      ...prev,
    ]);

    setNovoLead({ nome: "", origem: "", valor: "", status: "Prospect", nota: "" });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Minhas indicacoes</h1>
          <p className="text-slate-400 max-w-2xl">
            Acompanhe prospects, contatos e fechamentos. Registre rapidamente novas
            oportunidades e use o painel para ter clareza do seu funil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-100">Leads no funil</p>
                <FiUserPlus className="w-6 h-6 opacity-90" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-blue-100 text-sm">Prospects + contatos + fechados</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Fechados</p>
                <FiCheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.fechados}</p>
              <p className="text-slate-500 text-sm">
                Receita:{" "}
                <span className="text-green-300 font-semibold">
                  R$ {stats.receitaFechada.toLocaleString("pt-BR")}
                </span>
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Em contato</p>
                <FiClock className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.emContato}</p>
              <p className="text-slate-500 text-sm">Prospects ativos para follow-up</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Prospects</p>
                <FiTrendingUp className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.prospect}</p>
              <p className="text-slate-500 text-sm">Para abordar e qualificar</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Receita prevista</p>
                <FiDollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                R$ {stats.receitaPrevista.toLocaleString("pt-BR")}
              </p>
              <p className="text-slate-500 text-sm">
                Soma dos valores estimados para todas as oportunidades.
              </p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiPlus className="w-5 h-5 text-sky-400" />
              Registrar novo lead
            </h3>
            <form onSubmit={addLead} className="space-y-3">
              <div>
                <label className="text-sm text-slate-400">Nome/empresa</label>
                <input
                  value={novoLead.nome}
                  onChange={(e) => setNovoLead((p) => ({ ...p, nome: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  placeholder="Ex: Maria Souza / Agencia X"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-400">Origem</label>
                  <input
                    value={novoLead.origem}
                    onChange={(e) =>
                      setNovoLead((p) => ({ ...p, origem: e.target.value }))
                    }
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    placeholder="WhatsApp, Instagram..."
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400">Valor estimado</label>
                  <input
                    value={novoLead.valor}
                    onChange={(e) =>
                      setNovoLead((p) => ({ ...p, valor: e.target.value }))
                    }
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    placeholder="Ex: 1500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-400">Status</label>
                <select
                  value={novoLead.status}
                  onChange={(e) =>
                    setNovoLead((p) => ({ ...p, status: e.target.value as LeadStatus }))
                  }
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Contato">Contato</option>
                  <option value="Fechado">Fechado</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400">Nota</label>
                <textarea
                  value={novoLead.nota}
                  onChange={(e) => setNovoLead((p) => ({ ...p, nota: e.target.value }))}
                  className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                  placeholder="Contexto, proximo passo, follow-up..."
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Salvar lead
              </button>
            </form>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Resumo de leads</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Funil
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            <BadgeCounter
              title="Prospects"
              value={stats.prospect}
              color="text-sky-300"
              bg="bg-sky-500/10"
            />
            <BadgeCounter
              title="Em contato"
              value={stats.emContato}
              color="text-amber-300"
              bg="bg-amber-500/10"
            />
            <BadgeCounter
              title="Fechados"
              value={stats.fechados}
              color="text-green-300"
              bg="bg-green-500/10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-700">
                  <th className="pb-3 pr-3">Nome</th>
                  <th className="pb-3 pr-3">Origem</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 pr-3">Valor</th>
                  <th className="pb-3 pr-3">Ultimo contato</th>
                  <th className="pb-3 pr-3">Nota</th>
                  <th className="pb-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="text-white/90">
                    <td className="py-3 pr-3 font-semibold text-white">{lead.nome}</td>
                    <td className="py-3 pr-3 text-slate-300">{lead.origem}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${statusStyles[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-slate-200">
                      R$ {lead.valor.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 pr-3 text-slate-400">{lead.ultimoContato}</td>
                    <td className="py-3 pr-3 text-slate-400 max-w-[200px]">
                      {lead.nota || "-"}
                    </td>
                    <td className="py-3">
                      <button className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-xs">
                        <FiEdit2 className="w-4 h-4" />
                        Atualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

type BadgeCounterProps = {
  title: string;
  value: number;
  color: string;
  bg: string;
};

function BadgeCounter({ title, value, color, bg }: BadgeCounterProps) {
  return (
    <div className={`rounded-lg px-4 py-3 border border-slate-700 ${bg}`}>
      <p className="text-slate-300 text-sm">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
