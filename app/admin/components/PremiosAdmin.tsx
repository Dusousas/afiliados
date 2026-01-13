"use client";

import React, { useMemo, useState } from "react";
import {
  FiGift,
  FiCheckCircle,
  FiTrendingUp,
  FiMapPin,
  FiSend,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiCopy,
  FiTruck,
  FiAlertCircle,
  FiUser,
  FiClock,
} from "react-icons/fi";

type Premio = {
  id: string;
  titulo: string;
  descricao: string;
  meta: number;
  ativo: boolean;
  fisico: boolean; // se exige endereço
};

type Address = {
  nome: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

type Affiliate = {
  id: string;
  nome: string;
  email: string;
  comissaoTotal: number;
  comissaoDisponivel: number;
  address?: Address;
};

type RedemptionStatus = "pendente" | "aprovado" | "enviado" | "recusado";

type RedemptionRequest = {
  id: string;
  affiliateId: string;
  premioId: string;
  createdAt: string; // string só para mock
  status: RedemptionStatus;
  observacao?: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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

export default function PremiosAdmin() {
  // ====== PRÊMIOS (ADMIN GERENCIA) ======
  const [premios, setPremios] = useState<Premio[]>([
    {
      id: "p1",
      titulo: "Kit Welcome",
      descricao: "Camiseta, caneca e adesivos You On.",
      meta: 2000,
      ativo: true,
      fisico: true,
    },
    {
      id: "p2",
      titulo: "Upgrade Home Office",
      descricao: "Headset + suporte de notebook.",
      meta: 5000,
      ativo: true,
      fisico: true,
    },
    {
      id: "p3",
      titulo: "Bônus Cash",
      descricao: "R$ 1.000 extras para acelerar vendas.",
      meta: 10000,
      ativo: true,
      fisico: false,
    },
    {
      id: "p4",
      titulo: "Viagem Experience",
      descricao: "Experiência com o time You On.",
      meta: 20000,
      ativo: false,
      fisico: false,
    },
  ]);

  // ====== AFILIADOS (MOCK) ======
  const [affiliates] = useState<Affiliate[]>([
    {
      id: "a1",
      nome: "Mariana Alves",
      email: "mariana@email.com",
      comissaoTotal: 7200,
      comissaoDisponivel: 3600,
      address: {
        nome: "Mariana Alves",
        rua: "Av. Principal",
        numero: "123",
        complemento: "Apto 31",
        bairro: "Centro",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01000-000",
      },
    },
    {
      id: "a2",
      nome: "Carlos Lima",
      email: "carlos@email.com",
      comissaoTotal: 11000,
      comissaoDisponivel: 4200,
      address: {
        nome: "Carlos Lima",
        rua: "Rua das Flores",
        numero: "88",
        complemento: "",
        bairro: "Jardins",
        cidade: "Campinas",
        estado: "SP",
        cep: "13000-000",
      },
    },
    {
      id: "a3",
      nome: "Ana Souza",
      email: "ana@email.com",
      comissaoTotal: 2400,
      comissaoDisponivel: 900,
    },
  ]);

  // ====== SOLICITAÇÕES (AFILIADOS PEDINDO RESGATE) ======
  const [requests, setRequests] = useState<RedemptionRequest[]>([
    {
      id: "r1",
      affiliateId: "a1",
      premioId: "p2",
      createdAt: "2026-01-06 14:22",
      status: "pendente",
    },
    {
      id: "r2",
      affiliateId: "a2",
      premioId: "p3",
      createdAt: "2026-01-06 10:11",
      status: "aprovado",
    },
    {
      id: "r3",
      affiliateId: "a1",
      premioId: "p1",
      createdAt: "2026-01-05 09:40",
      status: "enviado",
    },
  ]);

  // ====== MÉTRICAS ADMIN (visão geral) ======
  const totals = useMemo(() => {
    const totalAfiliados = affiliates.length;
    const totalPremios = premios.length;
    const ativos = premios.filter((p) => p.ativo).length;
    const pendentes = requests.filter((r) => r.status === "pendente").length;
    const aprovados = requests.filter((r) => r.status === "aprovado").length;
    const enviados = requests.filter((r) => r.status === "enviado").length;

    return { totalAfiliados, totalPremios, ativos, pendentes, aprovados, enviados };
  }, [affiliates.length, premios, requests]);

  // ====== MODAL: CRUD PRÊMIOS ======
  const [prizeModalOpen, setPrizeModalOpen] = useState(false);
  const [prizeModalMode, setPrizeModalMode] = useState<"create" | "edit">("create");
  const [editingPrizeId, setEditingPrizeId] = useState<string | null>(null);

  const [prizeForm, setPrizeForm] = useState<Omit<Premio, "id">>({
    titulo: "",
    descricao: "",
    meta: 0,
    ativo: true,
    fisico: true,
  });

  const openCreatePrize = () => {
    setPrizeModalMode("create");
    setEditingPrizeId(null);
    setPrizeForm({ titulo: "", descricao: "", meta: 0, ativo: true, fisico: true });
    setPrizeModalOpen(true);
  };

  const openEditPrize = (id: string) => {
    const item = premios.find((p) => p.id === id);
    if (!item) return;
    setPrizeModalMode("edit");
    setEditingPrizeId(id);
    const { id: _id, ...rest } = item;
    setPrizeForm(rest);
    setPrizeModalOpen(true);
  };

  const savePrize = () => {
    if (!prizeForm.titulo.trim()) return;

    if (prizeModalMode === "create") {
      const id = uid();
      setPremios((prev) => [{ id, ...prizeForm }, ...prev]);
    } else {
      const id = editingPrizeId;
      if (!id) return;
      setPremios((prev) => prev.map((p) => (p.id === id ? { id, ...prizeForm } : p)));
    }

    setPrizeModalOpen(false);
  };

  const removePrize = (id: string) => {
    setPremios((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePrize = (id: string) => {
    setPremios((prev) => prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)));
  };

  // ====== MODAL: DETALHE DA SOLICITAÇÃO ======
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const selectedRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) ?? null;
  }, [requests, selectedRequestId]);

  const selectedAffiliate = useMemo(() => {
    if (!selectedRequest) return null;
    return affiliates.find((a) => a.id === selectedRequest.affiliateId) ?? null;
  }, [affiliates, selectedRequest]);

  const selectedPrize = useMemo(() => {
    if (!selectedRequest) return null;
    return premios.find((p) => p.id === selectedRequest.premioId) ?? null;
  }, [premios, selectedRequest]);

  const openRequestModal = (id: string) => {
    setSelectedRequestId(id);
    setRequestModalOpen(true);
  };

  const updateRequestStatus = (id: string, status: RedemptionStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const canRedeem = (affiliate: Affiliate | null, prize: Premio | null) => {
    if (!affiliate || !prize) return false;
    return affiliate.comissaoTotal >= prize.meta;
  };

  const fullAddress = (a?: Address) => {
    if (!a) return "";
    return `${a.nome}\n${a.rua}, ${a.numero}${a.complemento ? ` - ${a.complemento}` : ""}\n${a.bairro} - ${a.cidade}/${a.estado}\nCEP: ${a.cep}`;
  };

  // ====== LISTAS ======
  const visiblePrizes = useMemo(() => premios, [premios]);

  const requestBuckets = useMemo(() => {
    const pendentes = requests.filter((r) => r.status === "pendente");
    const aprovados = requests.filter((r) => r.status === "aprovado");
    const enviados = requests.filter((r) => r.status === "enviado");
    const recusados = requests.filter((r) => r.status === "recusado");
    return { pendentes, aprovados, enviados, recusados };
  }, [requests]);

  const badgeByStatus = (s: RedemptionStatus) => {
    if (s === "pendente") return "text-amber-200 bg-amber-500/15 border-amber-500/30";
    if (s === "aprovado") return "text-sky-200 bg-sky-500/15 border-sky-500/30";
    if (s === "enviado") return "text-emerald-200 bg-emerald-500/15 border-emerald-500/30";
    return "text-red-200 bg-red-500/15 border-red-500/30";
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Prêmios — Admin</h1>
          <p className="text-slate-400 max-w-2xl">
            Gerencie metas e prêmios do programa e acompanhe solicitações de resgate dos afiliados.
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-blue-100">Afiliados</p>
              <FiTrendingUp className="w-6 h-6 opacity-80" />
            </div>
            <p className="text-3xl font-bold">{totals.totalAfiliados}</p>
            <p className="text-blue-100 text-sm">Total cadastrados</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">Prêmios ativos</p>
              <FiGift className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">{totals.ativos}</p>
            <p className="text-slate-500 text-sm">De {totals.totalPremios} prêmios cadastrados</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">Solicitações pendentes</p>
              <FiCheckCircle className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-bold text-white">{totals.pendentes}</p>
            <p className="text-slate-500 text-sm">Aprovar e organizar envios</p>
          </div>
        </div>

        {/* Grid principal: Prêmios + Solicitações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prêmios (CRUD) */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Metas e prêmios (Admin)</h3>
              <button
                onClick={openCreatePrize}
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Adicionar prêmio
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visiblePrizes.map((premio) => (
                <div
                  key={premio.id}
                  className="bg-slate-900 rounded-lg p-5 border border-slate-700 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-white font-semibold">{premio.titulo}</p>
                      <p className="text-slate-400 text-sm">{premio.descricao}</p>
                      <p className="text-slate-500 text-sm mt-1">
                        Meta: <span className="text-slate-200">{formatCurrency(premio.meta)}</span>
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${
                            premio.ativo
                              ? "text-emerald-200 bg-emerald-500/15 border-emerald-500/30"
                              : "text-slate-300 bg-slate-800 border-slate-700"
                          }`}
                        >
                          {premio.ativo ? "Ativo" : "Inativo"}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {premio.fisico ? "Físico (endereço)" : "Digital"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openEditPrize(premio.id)}
                        className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Editar
                      </button>

                      <button
                        onClick={() => togglePrize(premio.id)}
                        className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        {premio.ativo ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        onClick={() => removePrize(premio.id)}
                        className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remover
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Dica: prêmios inativos não aparecem no painel do afiliado.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Solicitações */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Solicitações de resgate</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Fila
              </span>
            </div>

            {/* Buckets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: "Pendentes", icon: FiClock, items: requestBuckets.pendentes, tone: "text-amber-300" },
                { title: "Aprovados", icon: FiCheckCircle, items: requestBuckets.aprovados, tone: "text-sky-300" },
                { title: "Enviados", icon: FiTruck, items: requestBuckets.enviados, tone: "text-emerald-300" },
                { title: "Recusados", icon: FiAlertCircle, items: requestBuckets.recusados, tone: "text-red-300" },
              ].map((bucket) => (
                <div key={bucket.title} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <bucket.icon className={`w-4 h-4 ${bucket.tone}`} />
                      <p className="text-white font-semibold">{bucket.title}</p>
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                      {bucket.items.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {bucket.items.length === 0 ? (
                      <p className="text-slate-500 text-sm">Nenhuma solicitação.</p>
                    ) : (
                      bucket.items.slice(0, 4).map((r) => {
                        const a = affiliates.find((x) => x.id === r.affiliateId);
                        const p = premios.find((x) => x.id === r.premioId);
                        return (
                          <button
                            key={r.id}
                            onClick={() => openRequestModal(r.id)}
                            className="w-full text-left bg-slate-950 rounded-lg p-3 border border-slate-800 hover:border-slate-600 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-white text-sm font-semibold truncate">
                                  {a?.nome ?? "Afiliado"}
                                </p>
                                <p className="text-slate-400 text-xs truncate">
                                  {p?.titulo ?? "Prêmio"}
                                </p>
                              </div>

                              <span
                                className={`text-xs px-2 py-1 rounded-full border ${badgeByStatus(
                                  r.status
                                )}`}
                              >
                                {r.status}
                              </span>
                            </div>

                            <p className="text-slate-500 text-xs mt-2">
                              {r.createdAt}
                            </p>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {bucket.items.length > 4 ? (
                    <p className="text-slate-500 text-xs mt-2">
                      + {bucket.items.length - 4} outras solicitações…
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-xs mt-4">
              Clique em uma solicitação para abrir os detalhes do afiliado, prêmio e endereço.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: CRUD PRÊMIO */}
      <ModalShell
        open={prizeModalOpen}
        onClose={() => setPrizeModalOpen(false)}
        title={prizeModalMode === "create" ? "Adicionar prêmio" : "Editar prêmio"}
        subtitle="Configure título, meta e se é físico (exige endereço)."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 text-sm">Título</label>
              <input
                value={prizeForm.titulo}
                onChange={(e) => setPrizeForm((p) => ({ ...p, titulo: e.target.value }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="Ex: Kit Welcome"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Meta (R$)</label>
              <input
                type="number"
                min={0}
                value={prizeForm.meta}
                onChange={(e) => setPrizeForm((p) => ({ ...p, meta: Number(e.target.value) }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="2000"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm">Descrição</label>
            <textarea
              value={prizeForm.descricao}
              onChange={(e) => setPrizeForm((p) => ({ ...p, descricao: e.target.value }))}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500 min-h-[100px]"
              placeholder="Descreva o prêmio..."
            />
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={prizeForm.ativo}
                onChange={(e) => setPrizeForm((p) => ({ ...p, ativo: e.target.checked }))}
              />
              Prêmio ativo (visível para afiliados)
            </label>

            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={prizeForm.fisico}
                onChange={(e) => setPrizeForm((p) => ({ ...p, fisico: e.target.checked }))}
              />
              Prêmio físico (exige endereço)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setPrizeModalOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={savePrize}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>
      </ModalShell>

      {/* MODAL: DETALHE SOLICITAÇÃO */}
      <ModalShell
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Solicitação de resgate"
        subtitle="Detalhes do afiliado, prêmio e endereço (se aplicável)."
      >
        {selectedRequest && selectedAffiliate && selectedPrize ? (
          <div className="space-y-5">
            {/* Header cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Afiliado</p>
                  <FiUser className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-white font-semibold">{selectedAffiliate.nome}</p>
                <p className="text-slate-400 text-xs">{selectedAffiliate.email}</p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Prêmio</p>
                  <FiGift className="w-4 h-4 text-emerald-300" />
                </div>
                <p className="text-white font-semibold">{selectedPrize.titulo}</p>
                <p className="text-slate-400 text-xs">
                  Meta: {formatCurrency(selectedPrize.meta)} •{" "}
                  {selectedPrize.fisico ? "Físico" : "Digital"}
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">Status</p>
                  <FiClock className="w-4 h-4 text-slate-300" />
                </div>
                <span
                  className={`inline-flex text-xs px-2 py-1 rounded-full border ${badgeByStatus(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
                <p className="text-slate-500 text-xs mt-2">{selectedRequest.createdAt}</p>
              </div>
            </div>

            {/* Validação de meta */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <p className="text-white font-semibold mb-1">Validação</p>
              <p className="text-slate-400 text-sm">
                Comissão total do afiliado:{" "}
                <span className="text-slate-200">
                  {formatCurrency(selectedAffiliate.comissaoTotal)}
                </span>
              </p>
              <p className="text-slate-400 text-sm">
                Comissão disponível:{" "}
                <span className="text-slate-200">
                  {formatCurrency(selectedAffiliate.comissaoDisponivel)}
                </span>
              </p>

              <p className="text-slate-400 text-sm mt-2">
                {canRedeem(selectedAffiliate, selectedPrize) ? (
                  <span className="text-emerald-300">
                    ✅ Meta atingida — pode aprovar.
                  </span>
                ) : (
                  <span className="text-amber-300">
                    ⚠️ Meta NÃO atingida — revise antes de aprovar.
                  </span>
                )}
              </p>
            </div>

            {/* Endereço */}
            {selectedPrize.fisico ? (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-white font-semibold flex items-center gap-2">
                    <FiMapPin className="w-4 h-4 text-amber-300" />
                    Endereço de entrega
                  </h4>
                  <button
                    onClick={() => copyToClipboard(fullAddress(selectedAffiliate.address))}
                    className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
                    disabled={!selectedAffiliate.address}
                  >
                    <FiCopy className="w-4 h-4" />
                    Copiar endereço
                  </button>
                </div>

                {selectedAffiliate.address ? (
                  <pre className="text-slate-300 text-sm whitespace-pre-wrap bg-slate-900 border border-slate-800 rounded-lg p-3">
                    {fullAddress(selectedAffiliate.address)}
                  </pre>
                ) : (
                  <p className="text-amber-300 text-sm">
                    Afiliado não cadastrou endereço ainda.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <p className="text-white font-semibold mb-1">Entrega</p>
                <p className="text-slate-400 text-sm">
                  Prêmio digital — não exige endereço. Você pode liberar via contato com o afiliado.
                </p>
              </div>
            )}

            {/* Ações */}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                onClick={() => updateRequestStatus(selectedRequest.id, "recusado")}
                className="inline-flex items-center gap-2 bg-red-500/15 text-red-200 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/25 transition-colors"
              >
                <FiX className="w-4 h-4" />
                Recusar
              </button>

              <button
                onClick={() => updateRequestStatus(selectedRequest.id, "aprovado")}
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FiCheckCircle className="w-4 h-4" />
                Aprovar
              </button>

              <button
                onClick={() => updateRequestStatus(selectedRequest.id, "enviado")}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <FiTruck className="w-4 h-4" />
                Marcar como enviado
              </button>
            </div>

            <p className="text-slate-500 text-xs">
              Depois você liga essas ações na API (approve/ship/reject) e notifica o afiliado.
            </p>
          </div>
        ) : (
          <p className="text-slate-300">Carregando detalhes…</p>
        )}
      </ModalShell>
    </section>
  );
}
