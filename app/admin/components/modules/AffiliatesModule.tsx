"use client";

import { ReactNode, useMemo, useState } from "react";
import { FiEdit2, FiEye, FiSearch, FiShield } from "react-icons/fi";
import { Affiliate, AffiliateStatus } from "@/types/admin";
import { EmptyState, SectionTitle, StatusBadge } from "../ui";
import { calculateConversionRate, formatCurrency, formatDate } from "./formatters";

type Props = {
  affiliates: Affiliate[];
  onUpdateAffiliate: (
    id: string,
    payload: Partial<Pick<Affiliate, "name" | "email" | "phone" | "status" | "city" | "state">>
  ) => Promise<void>;
  onToggleAffiliateStatus: (id: string) => Promise<void>;
};

type ModalMode = "view" | "edit";

export default function AffiliatesModule({
  affiliates,
  onUpdateAffiliate,
  onToggleAffiliateStatus,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AffiliateStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<ModalMode>("view");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as AffiliateStatus,
    city: "",
    state: "",
  });

  const filteredAffiliates = useMemo(() => {
    return affiliates.filter((affiliate) => {
      const searchValue = search.trim().toLowerCase();
      const matchesSearch = !searchValue
        ? true
        : affiliate.name.toLowerCase().includes(searchValue) ||
          affiliate.email.toLowerCase().includes(searchValue) ||
          affiliate.id.toLowerCase().includes(searchValue);

      const matchesStatus = statusFilter === "all" ? true : affiliate.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [affiliates, search, statusFilter]);

  const selectedAffiliate = useMemo(() => {
    if (!selectedId) return null;
    return affiliates.find((affiliate) => affiliate.id === selectedId) ?? null;
  }, [affiliates, selectedId]);

  const openModal = (affiliate: Affiliate, modalMode: ModalMode) => {
    setSelectedId(affiliate.id);
    setMode(modalMode);
    setForm({
      name: affiliate.name,
      email: affiliate.email,
      phone: affiliate.phone,
      status: affiliate.status,
      city: affiliate.city,
      state: affiliate.state,
    });
  };

  const closeModal = () => {
    setSelectedId(null);
  };

  const handleSave = async () => {
    if (!selectedAffiliate) return;
    setSaving(true);
    await onUpdateAffiliate(selectedAffiliate.id, form);
    setSaving(false);
    closeModal();
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Afiliados"
        description="Listagem completa com busca, filtros e acoes de perfil"
      />

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por nome, email ou ID"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as AffiliateStatus | "all")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="pending">Pendente</option>
            <option value="blocked">Bloqueado</option>
          </select>
        </div>

        {filteredAffiliates.length === 0 ? (
          <EmptyState message="Nenhum afiliado encontrado para o filtro atual." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Local</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 pr-3">Leads</th>
                  <th className="pb-3 pr-3">Conversao</th>
                  <th className="pb-3 pr-3">Comissoes</th>
                  <th className="pb-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAffiliates.map((affiliate) => {
                  const conversionRate = calculateConversionRate(
                    affiliate.totalLeads,
                    affiliate.totalConversions
                  );

                  return (
                    <tr key={affiliate.id} className="text-slate-200">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-white">{affiliate.name}</p>
                        <p className="text-xs text-slate-400">{affiliate.email}</p>
                      </td>
                      <td className="py-3 pr-3 text-slate-300">
                        {affiliate.city}/{affiliate.state}
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge status={affiliate.status} />
                      </td>
                      <td className="py-3 pr-3">{affiliate.totalLeads}</td>
                      <td className="py-3 pr-3">{conversionRate.toFixed(1)}%</td>
                      <td className="py-3 pr-3 font-semibold text-emerald-300">
                        {formatCurrency(affiliate.totalCommissions)}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openModal(affiliate, "view")}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                          >
                            <FiEye className="h-3.5 w-3.5" />
                            Perfil
                          </button>
                          <button
                            onClick={() => openModal(affiliate, "edit")}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-sky-300 hover:bg-slate-700"
                          >
                            <FiEdit2 className="h-3.5 w-3.5" />
                            Editar
                          </button>
                          <button
                            onClick={() => onToggleAffiliateStatus(affiliate.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-amber-300 hover:bg-slate-700"
                          >
                            <FiShield className="h-3.5 w-3.5" />
                            {affiliate.status === "blocked" ? "Ativar" : "Bloquear"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedAffiliate ? (
        <div className="fixed inset-0 z-[999]">
          <button className="absolute inset-0 bg-black/60" onClick={closeModal} aria-label="Fechar" />
          <div className="relative mx-auto mt-16 w-[92%] max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {mode === "view" ? "Perfil do afiliado" : "Editar afiliado"}
                </h3>
                <p className="text-sm text-slate-400">ID {selectedAffiliate.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200"
              >
                Fechar
              </button>
            </div>

            {mode === "view" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoRow label="Nome" value={selectedAffiliate.name} />
                <InfoRow label="Email" value={selectedAffiliate.email} />
                <InfoRow label="Telefone" value={selectedAffiliate.phone} />
                <InfoRow label="Status" value={<StatusBadge status={selectedAffiliate.status} />} />
                <InfoRow label="Cidade" value={`${selectedAffiliate.city}/${selectedAffiliate.state}`} />
                <InfoRow label="Entrada" value={formatDate(selectedAffiliate.joinedAt)} />
                <InfoRow label="Ultima atividade" value={formatDate(selectedAffiliate.lastActiveAt)} />
                <InfoRow label="Comissoes" value={formatCurrency(selectedAffiliate.totalCommissions)} />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <LabeledInput
                    label="Nome"
                    value={form.name}
                    onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                  />
                  <LabeledInput
                    label="Email"
                    value={form.email}
                    onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                  />
                  <LabeledInput
                    label="Telefone"
                    value={form.phone}
                    onChange={(value) => setForm((prev) => ({ ...prev, phone: value }))}
                  />
                  <div>
                    <label className="text-xs text-slate-400">Status</label>
                    <select
                      value={form.status}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, status: event.target.value as AffiliateStatus }))
                      }
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                    >
                      <option value="active">Ativo</option>
                      <option value="pending">Pendente</option>
                      <option value="blocked">Bloqueado</option>
                    </select>
                  </div>
                  <LabeledInput
                    label="Cidade"
                    value={form.city}
                    onChange={(value) => setForm((prev) => ({ ...prev, city: value }))}
                  />
                  <LabeledInput
                    label="Estado"
                    value={form.state}
                    onChange={(value) => setForm((prev) => ({ ...prev, state: value }))}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={closeModal}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Salvando..." : "Salvar alteracoes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-slate-400">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
      />
    </div>
  );
}
