"use client";

import React, { useMemo, useState } from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiEdit2,
  FiDollarSign,
  FiX,
  FiSave,
  FiUser,
  FiMail,
  FiCopy,
  FiTag,
} from "react-icons/fi";

type LeadStatus = "Prospect" | "Contato" | "Fechado";

type Lead = {
  id: number;
  nome: string;
  status: LeadStatus;
  origem: string;
  valor: number; // valor estimado da venda (lead)
  ultimoContato: string;
  nota?: string;

  // extras para ADMIN
  affiliateId: string;
  briefing?: string;
  leadReward?: number; // valor que você define para o afiliado (comissão fixa/valor do lead)
  adminNote?: string;
  createdAt: string;
};

type Affiliate = {
  id: string;
  nome: string;
  email: string;
};

const statusStyles: Record<LeadStatus, string> = {
  Prospect: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  Contato: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
  Fechado: "bg-green-500/15 text-green-300 border border-green-500/30",
};

const copyToClipboard = (value: string) => {
  if (navigator?.clipboard) navigator.clipboard.writeText(value).catch(() => {});
};

function ModalShell({
  open,
  title,
  subtitle,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative z-[1000] mx-auto mt-16 w-[92%] max-w-4xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800">
            <div>
              <h3 className="text-white text-xl font-bold">{title}</h3>
              {subtitle ? (
                <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg p-2 transition-colors"
              aria-label="Fechar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function IndicacoesAdmin() {
  // ====== MOCK: afiliados ======
  const [affiliates] = useState<Affiliate[]>([
    { id: "a1", nome: "Mariana Alves", email: "mariana@email.com" },
    { id: "a2", nome: "Carlos Lima", email: "carlos@email.com" },
    { id: "a3", nome: "Ana Souza", email: "ana@email.com" },
  ]);

  // ====== MOCK: leads (chegam do painel do afiliado) ======
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      affiliateId: "a1",
      nome: "Carla Lima",
      status: "Prospect",
      origem: "Instagram",
      valor: 1800,
      ultimoContato: "2025-11-21",
      nota: "Fechou combo site + social (informado pelo afiliado)",
      briefing: "Cliente quer um site institucional + social media. Segmento: estética.",
      leadReward: 0,
      adminNote: "",
      createdAt: "2026-01-06 09:40",
    },
    {
      id: 2,
      affiliateId: "a2",
      nome: "Lucas Andrade",
      status: "Contato",
      origem: "WhatsApp",
      valor: 1200,
      ultimoContato: "2025-11-23",
      nota: "Quer proposta detalhada",
      briefing: "Lead interessado em landing page para captação. Prazo: 7 dias.",
      leadReward: 150,
      adminNote: "Enviei proposta inicial, aguardando retorno.",
      createdAt: "2026-01-06 10:11",
    },
    {
      id: 3,
      affiliateId: "a3",
      nome: "Marta Campos",
      status: "Prospect",
      origem: "Indicação",
      valor: 900,
      ultimoContato: "2025-11-20",
      briefing: "Cliente pequeno, orçamento limitado, quer algo simples.",
      leadReward: 0,
      adminNote: "",
      createdAt: "2026-01-06 12:22",
    },
    {
      id: 4,
      affiliateId: "a1",
      nome: "Studio Alpha",
      status: "Fechado",
      origem: "LinkedIn",
      valor: 2400,
      ultimoContato: "2025-11-18",
      nota: "Retorno em 30 dias",
      briefing: "Projeto: site + gestão. Contrato fechado.",
      leadReward: 300,
      adminNote: "Pagamento da comissão do lead na próxima rodada.",
      createdAt: "2026-01-05 17:08",
    },
  ]);

  // ====== filtro por afiliado ======
  const [selectedAffiliateId, setSelectedAffiliateId] = useState<string>("all");

  const filteredLeads = useMemo(() => {
    if (selectedAffiliateId === "all") return leads;
    return leads.filter((l) => l.affiliateId === selectedAffiliateId);
  }, [leads, selectedAffiliateId]);

  // ====== stats ======
  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const fechados = filteredLeads.filter((l) => l.status === "Fechado");
    const emContato = filteredLeads.filter((l) => l.status === "Contato");
    const prospect = filteredLeads.filter((l) => l.status === "Prospect");

    const receitaPrevista = filteredLeads.reduce((sum, l) => sum + (l.valor || 0), 0);
    const receitaFechada = fechados.reduce((sum, l) => sum + (l.valor || 0), 0);

    const payoutPrevisto = filteredLeads.reduce((sum, l) => sum + (l.leadReward || 0), 0);
    const payoutFechado = fechados.reduce((sum, l) => sum + (l.leadReward || 0), 0);

    return {
      total,
      fechados: fechados.length,
      emContato: emContato.length,
      prospect: prospect.length,
      receitaPrevista,
      receitaFechada,
      payoutPrevisto,
      payoutFechado,
    };
  }, [filteredLeads]);

  // ====== filas ======
  const buckets = useMemo(() => {
    return {
      Prospect: filteredLeads.filter((l) => l.status === "Prospect"),
      Contato: filteredLeads.filter((l) => l.status === "Contato"),
      Fechado: filteredLeads.filter((l) => l.status === "Fechado"),
    };
  }, [filteredLeads]);

  const getAffiliate = (id: string) => affiliates.find((a) => a.id === id);

  // ====== modal de lead ======
  const [open, setOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find((l) => l.id === selectedLeadId) ?? null;
  }, [leads, selectedLeadId]);

  const selectedAffiliate = selectedLead ? getAffiliate(selectedLead.affiliateId) ?? null : null;

  // form dentro do modal (valor do lead + admin note + status)
  const [modalForm, setModalForm] = useState({
    leadReward: "",
    adminNote: "",
    status: "Prospect" as LeadStatus,
  });

  const openLead = (id: number) => {
    const l = leads.find((x) => x.id === id);
    if (!l) return;

    setSelectedLeadId(id);
    setModalForm({
      leadReward: String(l.leadReward ?? 0),
      adminNote: l.adminNote ?? "",
      status: l.status,
    });
    setOpen(true);
  };

  const closeLead = () => setOpen(false);

  const saveLead = () => {
    if (!selectedLead) return;

    const parsedReward = Number(modalForm.leadReward) || 0;

    setLeads((prev) =>
      prev.map((l) =>
        l.id === selectedLead.id
          ? {
              ...l,
              leadReward: parsedReward,
              adminNote: modalForm.adminNote.trim() || "",
              status: modalForm.status,
              ultimoContato: new Date().toISOString().split("T")[0],
            }
          : l
      )
    );

    setOpen(false);
  };

  const quickSetStatus = (status: LeadStatus) => {
    setModalForm((p) => ({ ...p, status }));
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Indicações — Admin</h1>
          <p className="text-slate-400 max-w-2xl">
            Receba os leads dos afiliados em formato de fila, revise briefing/notas e defina o valor do lead
            para o afiliado finalizar a venda.
          </p>
        </div>

        {/* Filtro por afiliado */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedAffiliateId("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedAffiliateId === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              Todos
            </button>
            {affiliates.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAffiliateId(a.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedAffiliateId === a.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {a.nome}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Mostrando <span className="text-slate-200 font-semibold">{filteredLeads.length}</span>{" "}
            leads
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-blue-100">Leads recebidos</p>
                <FiUsers className="w-6 h-6 opacity-90" />
              </div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-blue-100 text-sm">Fila total (prospect + contato + fechados)</p>
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
              <p className="text-slate-500 text-sm">
                Payout afiliado:{" "}
                <span className="text-emerald-300 font-semibold">
                  R$ {stats.payoutFechado.toLocaleString("pt-BR")}
                </span>
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Em contato</p>
                <FiClock className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.emContato}</p>
              <p className="text-slate-500 text-sm">Leads em andamento (follow-up)</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Prospects</p>
                <FiTrendingUp className="w-5 h-5 text-sky-400" />
              </div>
              <p className="text-3xl font-bold text-white">{stats.prospect}</p>
              <p className="text-slate-500 text-sm">Para qualificar e precificar</p>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 md:col-span-2 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">Payout previsto (valor dos leads)</p>
                <FiDollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-white">
                R$ {stats.payoutPrevisto.toLocaleString("pt-BR")}
              </p>
              <p className="text-slate-500 text-sm">
                Soma do “valor do lead” definido por você em cada oportunidade.
              </p>
            </div>
          </div>

          {/* Painel rápido */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FiTag className="w-5 h-5 text-sky-400" />
              Fila por status
            </h3>

            <div className="space-y-3">
              <QueueRow title="Prospect" value={buckets.Prospect.length} tone="text-sky-300" />
              <QueueRow title="Contato" value={buckets.Contato.length} tone="text-amber-300" />
              <QueueRow title="Fechado" value={buckets.Fechado.length} tone="text-green-300" />
            </div>

            <p className="text-slate-500 text-xs mt-4">
              Clique em qualquer lead abaixo para abrir detalhes e definir valor do lead.
            </p>
          </div>
        </div>

        {/* Tabela + filas */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Fila de leads</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Recebidos
            </span>
          </div>

          {/* Filas (cards) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <QueueColumn
              title="Prospects"
              badgeClass={statusStyles.Prospect}
              items={buckets.Prospect}
              getAffiliate={getAffiliate}
              onOpen={openLead}
            />
            <QueueColumn
              title="Em contato"
              badgeClass={statusStyles.Contato}
              items={buckets.Contato}
              getAffiliate={getAffiliate}
              onOpen={openLead}
            />
            <QueueColumn
              title="Fechados"
              badgeClass={statusStyles.Fechado}
              items={buckets.Fechado}
              getAffiliate={getAffiliate}
              onOpen={openLead}
            />
          </div>

          {/* Tabela completa */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left border-b border-slate-700">
                  <th className="pb-3 pr-3">Lead</th>
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Origem</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 pr-3">Valor estimado</th>
                  <th className="pb-3 pr-3">Valor do lead</th>
                  <th className="pb-3 pr-3">Criado</th>
                  <th className="pb-3">Ações</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {filteredLeads.map((lead) => {
                  const a = getAffiliate(lead.affiliateId);
                  return (
                    <tr key={lead.id} className="text-white/90">
                      <td className="py-3 pr-3 font-semibold text-white">{lead.nome}</td>
                      <td className="py-3 pr-3 text-slate-300">
                        {a?.nome ?? "—"}
                        <div className="text-slate-500 text-xs">{a?.email ?? ""}</div>
                      </td>
                      <td className="py-3 pr-3 text-slate-300">{lead.origem}</td>
                      <td className="py-3 pr-3">
                        <span className={`text-xs px-3 py-1 rounded-full ${statusStyles[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 pr-3 text-slate-200">
                        R$ {lead.valor.toLocaleString("pt-BR")}
                      </td>
                      <td className="py-3 pr-3 text-slate-200">
                        {typeof lead.leadReward === "number" ? (
                          <span className="text-emerald-300 font-semibold">
                            R$ {lead.leadReward.toLocaleString("pt-BR")}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-3 pr-3 text-slate-400">{lead.createdAt}</td>
                      <td className="py-3">
                        <button
                          onClick={() => openLead(lead.id)}
                          className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-xs"
                        >
                          <FiEdit2 className="w-4 h-4" />
                          Abrir
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DETALHE DO LEAD */}
      <ModalShell
        open={open}
        onClose={closeLead}
        title="Detalhes do lead"
        subtitle="Revise briefing e defina o valor do lead para o afiliado finalizar a venda."
      >
        {selectedLead && selectedAffiliate ? (
          <div className="space-y-5">
            {/* Top cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Afiliado</p>
                  <FiUser className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-white font-semibold">{selectedAffiliate.nome}</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-slate-400 text-xs flex items-center gap-2">
                    <FiMail className="w-4 h-4" />
                    {selectedAffiliate.email}
                  </p>
                  <button
                    onClick={() => copyToClipboard(selectedAffiliate.email)}
                    className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copiar
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Lead</p>
                <p className="text-white font-semibold mt-1">{selectedLead.nome}</p>
                <p className="text-slate-400 text-xs mt-1">
                  Origem: <span className="text-slate-200">{selectedLead.origem}</span>
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Valor estimado:{" "}
                  <span className="text-slate-200">
                    R$ {selectedLead.valor.toLocaleString("pt-BR")}
                  </span>
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-slate-400 text-sm">Status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => quickSetStatus("Prospect")}
                    className={`text-xs px-3 py-1 rounded-full ${
                      modalForm.status === "Prospect" ? statusStyles.Prospect : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    Prospect
                  </button>
                  <button
                    onClick={() => quickSetStatus("Contato")}
                    className={`text-xs px-3 py-1 rounded-full ${
                      modalForm.status === "Contato" ? statusStyles.Contato : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    Contato
                  </button>
                  <button
                    onClick={() => quickSetStatus("Fechado")}
                    className={`text-xs px-3 py-1 rounded-full ${
                      modalForm.status === "Fechado" ? statusStyles.Fechado : "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    Fechado
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  Criado em: {selectedLead.createdAt}
                </p>
              </div>
            </div>

            {/* Briefing / notas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-white font-semibold">Briefing (do afiliado)</p>
                <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap">
                  {selectedLead.briefing || "—"}
                </p>
                <p className="text-slate-500 text-xs mt-3">
                  Nota do afiliado: {selectedLead.nota || "—"}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-white font-semibold">Ação do Admin</p>

                <div className="mt-3">
                  <label className="text-sm text-slate-400">Valor do lead (p/ afiliado)</label>
                  <input
                    value={modalForm.leadReward}
                    onChange={(e) => setModalForm((p) => ({ ...p, leadReward: e.target.value }))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    placeholder="Ex: 150"
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Esse é o valor que você repassa ao afiliado quando o lead fechar.
                  </p>
                </div>

                <div className="mt-3">
                  <label className="text-sm text-slate-400">Nota interna</label>
                  <textarea
                    value={modalForm.adminNote}
                    onChange={(e) => setModalForm((p) => ({ ...p, adminNote: e.target.value }))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                    placeholder="Ex: enviei proposta, aguardando retorno..."
                    rows={5}
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={closeLead}
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <FiX className="w-4 h-4" />
                Cancelar
              </button>

              <button
                onClick={saveLead}
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <FiSave className="w-4 h-4" />
                Salvar alterações
              </button>
            </div>

            <p className="text-slate-500 text-xs">
              Depois você liga isso na API: atualizar status, salvar valor do lead, e registrar payout para o afiliado.
            </p>
          </div>
        ) : (
          <p className="text-slate-300">Carregando…</p>
        )}
      </ModalShell>
    </section>
  );
}

function QueueRow({ title, value, tone }: { title: string; value: number; tone: string }) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
      <p className="text-slate-300 text-sm">{title}</p>
      <p className={`text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function QueueColumn({
  title,
  badgeClass,
  items,
  getAffiliate,
  onOpen,
}: {
  title: string;
  badgeClass: string;
  items: Lead[];
  getAffiliate: (id: string) => { id: string; nome: string; email: string } | undefined;
  onOpen: (id: number) => void;
}) {
  return (
    <div className="bg-slate-900 rounded-xl p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white font-semibold">{title}</p>
        <span className={`text-xs px-3 py-1 rounded-full ${badgeClass}`}>
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">Nenhum lead.</p>
        ) : (
          items.slice(0, 6).map((l) => {
            const a = getAffiliate(l.affiliateId);
            const reward = typeof l.leadReward === "number" ? l.leadReward : 0;

            return (
              <button
                key={l.id}
                onClick={() => onOpen(l.id)}
                className="w-full text-left bg-slate-950 rounded-lg p-3 border border-slate-800 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{l.nome}</p>
                    <p className="text-slate-400 text-xs truncate">
                      {a?.nome ?? "Afiliado"} • {l.origem}
                    </p>
                  </div>

                  <span className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                    R$ {l.valor.toLocaleString("pt-BR")}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-slate-500 text-xs">{l.createdAt}</p>
                  <p className="text-emerald-300 text-xs font-semibold">
                    lead: R$ {reward.toLocaleString("pt-BR")}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {items.length > 6 ? (
        <p className="text-slate-500 text-xs mt-2">+ {items.length - 6} outros…</p>
      ) : null}
    </div>
  );
}
