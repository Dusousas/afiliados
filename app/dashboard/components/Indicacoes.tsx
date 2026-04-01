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
import { affiliateDashboardClient } from "@/services/clientApi";
import { Lead } from "@/types/admin";

type DashboardLeadStatus = "Prospect" | "Contato" | "Fechado" | "Perdido";

const statusStyles: Record<DashboardLeadStatus, string> = {
  Prospect: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Contato: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  Fechado: "bg-green-500/15 text-green-300 border border-green-500/30",
  Perdido: "bg-red-500/15 text-red-300 border border-red-500/30",
};

function mapStatus(status: Lead["status"]): DashboardLeadStatus {
  if (status === "won") return "Fechado";
  if (status === "lost") return "Perdido";
  if (status === "new") return "Prospect";
  return "Contato";
}

export default function Indicacoes() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingLead, setSavingLead] = useState(false);
  const [novoLead, setNovoLead] = useState({
    nome: "",
    origem: "",
    valor: "",
    nota: "",
  });

  React.useEffect(() => {
    let mounted = true;

    affiliateDashboardClient.getMyDashboard().then((snapshot) => {
      if (!mounted) return;
      setLeads(snapshot.leads);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = leads.length;
    const fechados = leads.filter((l) => l.status === "won");
    const emContato = leads.filter((l) => l.status === "qualified" || l.status === "proposal");
    const prospect = leads.filter((l) => l.status === "new");
    const receitaPrevista = leads.reduce((sum, l) => sum + l.potentialValue, 0);
    const receitaFechada = fechados.reduce((sum, l) => sum + l.potentialValue, 0);

    return {
      total,
      fechados: fechados.length,
      emContato: emContato.length,
      prospect: prospect.length,
      receitaPrevista,
      receitaFechada,
    };
  }, [leads]);

  const addLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoLead.nome.trim()) return;

    setSavingLead(true);
    await affiliateDashboardClient.createLead({
      name: novoLead.nome.trim(),
      origin: novoLead.origem.trim() || "Manual",
      potentialValue: parseFloat(novoLead.valor) || 0,
      notes: novoLead.nota.trim(),
    });

    const snapshot = await affiliateDashboardClient.getMyDashboard();
    setLeads(snapshot.leads);
    setNovoLead({ nome: "", origem: "", valor: "", nota: "" });
    setSavingLead(false);
  };

  const quickProgressLead = async (lead: Lead) => {
    const nextStatus: Lead["status"] =
      lead.status === "new"
        ? "qualified"
        : lead.status === "qualified"
          ? "proposal"
          : lead.status === "proposal"
            ? "won"
            : lead.status;

    await affiliateDashboardClient.updateLead(lead.id, { status: nextStatus });
    const snapshot = await affiliateDashboardClient.getMyDashboard();
    setLeads(snapshot.leads);
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Minhas indicacoes</h1>
          <p className="text-slate-400 max-w-2xl">
            Os leads que voce cadastra aqui entram direto no banco e passam a
            aparecer para o admin acompanhar e avançar.
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
                disabled={savingLead}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingLead ? "Salvando..." : "Salvar lead"}
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
                {loading ? (
                  <tr>
                    <td className="py-4 text-slate-400" colSpan={7}>
                      Carregando leads...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td className="py-4 text-slate-400" colSpan={7}>
                      Nenhum lead cadastrado ainda.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => {
                    const dashboardStatus = mapStatus(lead.status);

                    return (
                      <tr key={lead.id} className="text-white/90">
                        <td className="py-3 pr-3 font-semibold text-white">{lead.name}</td>
                        <td className="py-3 pr-3 text-slate-300">{lead.origin}</td>
                        <td className="py-3 pr-3">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${statusStyles[dashboardStatus]}`}
                          >
                            {dashboardStatus}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-slate-200">
                          R$ {lead.potentialValue.toLocaleString("pt-BR")}
                        </td>
                        <td className="py-3 pr-3 text-slate-400">{lead.updatedAt}</td>
                        <td className="py-3 pr-3 text-slate-400 max-w-[200px]">
                          {lead.notes || "-"}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => quickProgressLead(lead)}
                            disabled={lead.status === "won" || lead.status === "lost"}
                            className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-xs disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <FiEdit2 className="w-4 h-4" />
                            Avancar etapa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
