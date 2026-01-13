"use client";

import React, { useMemo, useState } from "react";
import {
  FiCopy,
  FiLink,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiInfo,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
  FiCheckCircle,
  FiSlash,
} from "react-icons/fi";
import { HiOutlineGift } from "react-icons/hi";

type Coupon = {
  id: string;
  nomeCampanha: string;
  codigo: string; // ex: YOUON10
  descontoPercent: number; // 10
  comissaoPercent: number; // 20
  validadeLabel: string; // "Sem expiração" ou "Válido até 30/11"
  linkBase: string; // ex: https://youon.com/afiliado/
  ativo: boolean;

  // textos auxiliares que aparecem ao lado direito (regras)
  regras: {
    linkMonitorado: boolean;
    pagamentoQuinzenal: boolean;
    usoSimples: boolean;
  };
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const copyToClipboard = (value: string) => {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(value).catch(() => {});
  }
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

      <div className="relative z-[1000] mx-auto mt-16 w-[92%] max-w-3xl">
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

export default function CuponsAdmin() {
  // ====== MOCK (troque por API depois) ======
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "c1",
      nomeCampanha: "YOU ON Afiliados",
      codigo: "YOUON10",
      descontoPercent: 10,
      comissaoPercent: 20,
      validadeLabel: "Sem expiração",
      linkBase: "https://youon.com/afiliado/",
      ativo: true,
      regras: {
        linkMonitorado: true,
        pagamentoQuinzenal: true,
        usoSimples: true,
      },
    },
    {
      id: "c2",
      nomeCampanha: "Campanha Black",
      codigo: "BLACK20",
      descontoPercent: 20,
      comissaoPercent: 25,
      validadeLabel: "Válido até 30/11",
      linkBase: "https://youon.com/afiliado/",
      ativo: false,
      regras: {
        linkMonitorado: true,
        pagamentoQuinzenal: true,
        usoSimples: true,
      },
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>("c1");

  const selected = useMemo(() => {
    return coupons.find((c) => c.id === selectedId) ?? coupons[0];
  }, [coupons, selectedId]);

  const couponLink = useMemo(() => {
    if (!selected) return "";
    return `${selected.linkBase}${selected.codigo}`;
  }, [selected]);

  // ====== MODAL ======
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const [form, setForm] = useState<Omit<Coupon, "id">>({
    nomeCampanha: "",
    codigo: "",
    descontoPercent: 10,
    comissaoPercent: 20,
    validadeLabel: "Sem expiração",
    linkBase: "https://youon.com/afiliado/",
    ativo: true,
    regras: { linkMonitorado: true, pagamentoQuinzenal: true, usoSimples: true },
  });

  const openCreate = () => {
    setModalMode("create");
    setForm({
      nomeCampanha: "",
      codigo: "",
      descontoPercent: 10,
      comissaoPercent: 20,
      validadeLabel: "Sem expiração",
      linkBase: "https://youon.com/afiliado/",
      ativo: true,
      regras: { linkMonitorado: true, pagamentoQuinzenal: true, usoSimples: true },
    });
    setModalOpen(true);
  };

  const openEdit = () => {
    if (!selected) return;
    setModalMode("edit");
    const { id: _id, ...rest } = selected;
    setForm(rest);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const submit = () => {
    if (!form.nomeCampanha.trim() || !form.codigo.trim() || !form.linkBase.trim())
      return;

    const normalizedCode = form.codigo.trim().toUpperCase().replace(/\s+/g, "");

    if (modalMode === "create") {
      const id = uid();
      const next = { id, ...form, codigo: normalizedCode };
      setCoupons((prev) => [next, ...prev]);
      setSelectedId(id);
    } else {
      if (!selected) return;
      const id = selected.id;
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { id, ...form, codigo: normalizedCode } : c))
      );
    }

    closeModal();
  };

  const removeSelected = () => {
    if (!selected) return;
    const id = selected.id;
    const next = coupons.filter((c) => c.id !== id);
    setCoupons(next);
    setSelectedId(next[0]?.id ?? "");
  };

  const toggleActiveSelected = () => {
    if (!selected) return;
    setCoupons((prev) =>
      prev.map((c) => (c.id === selected.id ? { ...c, ativo: !c.ativo } : c))
    );
  };

  // ====== UI DATA (mantendo estilo parecido com afiliado) ======
  const perks = useMemo(() => {
    if (!selected) return [];
    return [
      {
        label: "Comissão por venda",
        value: `${selected.comissaoPercent}%`,
        icon: FiTrendingUp,
        accent: "text-green-400",
      },
      {
        label: "Desconto para o cliente",
        value: `${selected.descontoPercent}%`,
        icon: HiOutlineGift,
        accent: "text-blue-400",
      },
      {
        label: "Validade do cupom",
        value: selected.validadeLabel,
        icon: FiClock,
        accent: "text-orange-400",
      },
    ];
  }, [selected]);

  const guarantees = useMemo(() => {
    if (!selected) return [];
    return [
      {
        title: "Link monitorado",
        desc: "Rastreio completo dos cliques e vendas geradas.",
        icon: FiShield,
        ok: selected.regras.linkMonitorado,
      },
      {
        title: "Pagamento quinzenal",
        desc: "Comissões liberadas sempre que atingir o mínimo.",
        icon: FiInfo,
        ok: selected.regras.pagamentoQuinzenal,
      },
      {
        title: "Uso simples",
        desc: "Cliente aplica o cupom no checkout e o desconto sai na hora.",
        icon: FiLink,
        ok: selected.regras.usoSimples,
      },
    ];
  }, [selected]);

  const steps = [
    {
      title: "Criar/editar cupom",
      desc: "Cadastre campanha, % desconto, % comissão e validade.",
    },
    {
      title: "Ativar para os afiliados",
      desc: "Ative o cupom para aparecer no painel dos afiliados.",
    },
    {
      title: "Acompanhar performance",
      desc: "Veja cliques/vendas no dashboard e ajuste campanhas.",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Cupons — Admin</h1>
          <p className="text-slate-400 max-w-2xl">
            Gerencie cupons do programa: crie campanhas, defina desconto e comissão,
            ative/desative e copie o link monitorado.
          </p>
        </div>

        {/* Seletor de cupom */}
        <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {coupons.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selected?.id === c.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {c.codigo}
                {!c.ativo ? (
                  <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                    inativo
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Novo cupom
            </button>

            <button
              onClick={openEdit}
              className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/25 transition-colors"
              disabled={!selected}
            >
              <FiEdit2 className="w-4 h-4" />
              Editar
            </button>

            <button
              onClick={toggleActiveSelected}
              className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/15 transition-colors"
              disabled={!selected}
            >
              {selected?.ativo ? (
                <>
                  <FiSlash className="w-4 h-4" />
                  Desativar
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  Ativar
                </>
              )}
            </button>

            <button
              onClick={removeSelected}
              className="inline-flex items-center gap-2 bg-red-500/15 text-red-200 px-4 py-2 rounded-lg font-semibold hover:bg-red-500/25 transition-colors"
              disabled={!selected}
            >
              <FiTrash2 className="w-4 h-4" />
              Remover
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-8">
          {/* Card principal (mesmo estilo afiliado) */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-100">
                  {selected?.ativo ? "Cupom ativo" : "Cupom inativo"}
                </p>
                <h2 className="text-3xl font-bold mt-1">
                  {selected?.nomeCampanha ?? "Selecione um cupom"}
                </h2>
              </div>

              <span className="bg-white/20 text-xs px-3 py-1 rounded-full">
                {selected?.ativo ? "Visível para afiliados" : "Oculto para afiliados"}
              </span>
            </div>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-100 mb-1">Código do cupom</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black tracking-[0.25em]">
                  {selected?.codigo ?? "--"}
                </span>

                <button
                  onClick={() => selected?.codigo && copyToClipboard(selected.codigo)}
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  disabled={!selected}
                >
                  <FiCopy className="w-4 h-4" />
                  Copiar
                </button>
              </div>

              <p className="text-blue-100 text-sm mt-3">
                Defina desconto, comissão e validade. O link do cupom é usado para rastrear
                cliques e vendas do programa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[240px] bg-slate-900/40 border border-white/10 rounded-lg px-4 py-3">
                <p className="text-sm text-blue-100 mb-1">Link direto</p>
                <div className="flex items-center gap-2 text-sm break-all">
                  <FiLink className="w-4 h-4" />
                  {selected ? couponLink : "--"}
                </div>
              </div>

              <button
                onClick={() => selected && copyToClipboard(couponLink)}
                className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/25 transition-colors"
                disabled={!selected}
              >
                <FiCopy className="w-4 h-4" />
                Copiar link
              </button>
            </div>
          </div>

          {/* Regras e benefícios (admin toggles visuais) */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Regras e benefícios (Admin)
            </h3>

            <div className="space-y-4">
              {guarantees.map(({ title, desc, icon: Icon, ok }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="mt-0.5">
                    <Icon className="w-5 h-5 text-sky-400" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-white font-medium">{title}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          ok
                            ? "text-green-200 bg-green-500/15 border-green-500/30"
                            : "text-slate-300 bg-slate-800 border-slate-700"
                        }`}
                      >
                        {ok ? "Ativo" : "Desligado"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-slate-500 text-xs mt-4">
              (Você pode tornar esses itens editáveis também — já deixei no formulário do modal.)
            </p>
          </div>
        </div>

        {/* Cards perks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {perks.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">{label}</p>
                <Icon className={`w-5 h-5 ${accent}`} />
              </div>

              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-slate-500 text-sm mt-1">
                Este valor é configurado por campanha no Admin.
              </p>
            </div>
          ))}
        </div>


      </div>

      {/* MODAL create/edit */}
      <ModalShell
        open={modalOpen}
        onClose={closeModal}
        title={modalMode === "create" ? "Novo cupom" : "Editar cupom"}
        subtitle="Preencha os campos e salve. Depois você liga na API."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 text-sm">Nome da campanha</label>
              <input
                value={form.nomeCampanha}
                onChange={(e) => setForm((s) => ({ ...s, nomeCampanha: e.target.value }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="Ex: YOU ON Afiliados"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Código</label>
              <input
                value={form.codigo}
                onChange={(e) => setForm((s) => ({ ...s, codigo: e.target.value }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="Ex: YOUON10"
              />
              <p className="text-slate-500 text-xs mt-1">
                Dica: será normalizado para MAIÚSCULO e sem espaços.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-300 text-sm">Desconto (%)</label>
              <input
                type="number"
                min={0}
                value={form.descontoPercent}
                onChange={(e) =>
                  setForm((s) => ({ ...s, descontoPercent: Number(e.target.value) }))
                }
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Comissão (%)</label>
              <input
                type="number"
                min={0}
                value={form.comissaoPercent}
                onChange={(e) =>
                  setForm((s) => ({ ...s, comissaoPercent: Number(e.target.value) }))
                }
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm">Validade</label>
              <input
                value={form.validadeLabel}
                onChange={(e) => setForm((s) => ({ ...s, validadeLabel: e.target.value }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="Ex: Sem expiração / Válido até 30/11"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-sm">Link base</label>
            <input
              value={form.linkBase}
              onChange={(e) => setForm((s) => ({ ...s, linkBase: e.target.value }))}
              className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
              placeholder="https://youon.com/afiliado/"
            />
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <p className="text-white font-semibold mb-2">Regras (visibilidade)</p>

            <label className="flex items-center gap-2 text-slate-300 text-sm mb-2">
              <input
                type="checkbox"
                checked={form.regras.linkMonitorado}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    regras: { ...s.regras, linkMonitorado: e.target.checked },
                  }))
                }
              />
              Link monitorado
            </label>

            <label className="flex items-center gap-2 text-slate-300 text-sm mb-2">
              <input
                type="checkbox"
                checked={form.regras.pagamentoQuinzenal}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    regras: { ...s.regras, pagamentoQuinzenal: e.target.checked },
                  }))
                }
              />
              Pagamento quinzenal
            </label>

            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={form.regras.usoSimples}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    regras: { ...s.regras, usoSimples: e.target.checked },
                  }))
                }
              />
              Uso simples
            </label>
          </div>

          <label className="flex items-center gap-2 text-slate-300 text-sm">
            <input
              type="checkbox"
              checked={form.ativo}
              onChange={(e) => setForm((s) => ({ ...s, ativo: e.target.checked }))}
            />
            Cupom ativo (visível para afiliados)
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={closeModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FiX className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={submit}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <FiSave className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>
      </ModalShell>
    </section>
  );
}
