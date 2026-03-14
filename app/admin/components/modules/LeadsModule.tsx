"use client";

import { useMemo, useState } from "react";
import { FiEye } from "react-icons/fi";
import { Affiliate, Lead } from "@/types/admin";
import { EmptyState, SectionTitle, StatusBadge } from "../ui";
import { formatCurrency, formatDate } from "./formatters";

type Props = {
  leads: Lead[];
  affiliates: Affiliate[];
  onUpdateLead: (
    id: string,
    payload: Partial<Pick<Lead, "status" | "notes" | "potentialValue">>
  ) => Promise<void>;
};

export default function LeadsModule({ leads, affiliates, onUpdateLead }: Props) {
  const [statusFilter, setStatusFilter] = useState<Lead["status"] | "all">("all");
  const [affiliateFilter, setAffiliateFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [form, setForm] = useState({
    status: "new" as Lead["status"],
    potentialValue: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  const origins = useMemo(() => {
    const values = new Set(leads.map((lead) => lead.origin));
    return Array.from(values).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus = statusFilter === "all" ? true : lead.status === statusFilter;
      const matchesAffiliate = affiliateFilter === "all" ? true : lead.affiliateId === affiliateFilter;
      const matchesOrigin = originFilter === "all" ? true : lead.origin === originFilter;
      return matchesStatus && matchesAffiliate && matchesOrigin;
    });
  }, [affiliateFilter, leads, originFilter, statusFilter]);

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find((lead) => lead.id === selectedLeadId) ?? null;
  }, [leads, selectedLeadId]);

  const openLead = (lead: Lead) => {
    setSelectedLeadId(lead.id);
    setForm({
      status: lead.status,
      potentialValue: String(lead.potentialValue),
      notes: lead.notes,
    });
  };

  const closeLead = () => {
    setSelectedLeadId(null);
  };

  const saveLead = async () => {
    if (!selectedLead) return;
    setSaving(true);
    await onUpdateLead(selectedLead.id, {
      status: form.status,
      notes: form.notes,
      potentialValue: Number(form.potentialValue) || 0,
    });
    setSaving(false);
    closeLead();
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Leads e Indicacoes"
        description="Controle de origem, afiliado responsavel, status e valor potencial"
      />

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={affiliateFilter}
            onChange={(event) => setAffiliateFilter(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Todos os afiliados</option>
            {affiliates.map((affiliate) => (
              <option key={affiliate.id} value={affiliate.id}>
                {affiliate.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as Lead["status"] | "all")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Todos os status</option>
            <option value="new">Novo</option>
            <option value="qualified">Qualificado</option>
            <option value="proposal">Proposta</option>
            <option value="won">Convertido</option>
            <option value="lost">Perdido</option>
          </select>

          <select
            value={originFilter}
            onChange={(event) => setOriginFilter(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Todas as origens</option>
            {origins.map((origin) => (
              <option key={origin} value={origin}>
                {origin}
              </option>
            ))}
          </select>
        </div>

        {filteredLeads.length === 0 ? (
          <EmptyState message="Nenhum lead encontrado para os filtros atuais." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">Lead</th>
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Origem</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 pr-3">Valor potencial</th>
                  <th className="pb-3 pr-3">Cadastro</th>
                  <th className="pb-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="text-slate-200">
                    <td className="py-3 pr-3 font-semibold text-white">{lead.name}</td>
                    <td className="py-3 pr-3">{lead.affiliateName}</td>
                    <td className="py-3 pr-3">{lead.origin}</td>
                    <td className="py-3 pr-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3 pr-3 text-emerald-300">{formatCurrency(lead.potentialValue)}</td>
                    <td className="py-3 pr-3">{formatDate(lead.createdAt)}</td>
                    <td className="py-3">
                      <button
                        onClick={() => openLead(lead)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-sky-300 hover:bg-slate-700"
                      >
                        <FiEye className="h-3.5 w-3.5" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedLead ? (
        <div className="fixed inset-0 z-[999]">
          <button className="absolute inset-0 bg-black/60" onClick={closeLead} aria-label="Fechar" />
          <div className="relative mx-auto mt-16 w-[92%] max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Detalhes do lead</h3>
                <p className="text-sm text-slate-400">{selectedLead.id} - {selectedLead.name}</p>
              </div>
              <button
                onClick={closeLead}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200"
              >
                Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InfoItem label="Afiliado" value={selectedLead.affiliateName} />
              <InfoItem label="Origem" value={selectedLead.origin} />
              <InfoItem label="Criado em" value={formatDate(selectedLead.createdAt)} />
              <InfoItem label="Atualizado em" value={formatDate(selectedLead.updatedAt)} />
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-slate-400">Status</label>
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, status: event.target.value as Lead["status"] }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                >
                  <option value="new">Novo</option>
                  <option value="qualified">Qualificado</option>
                  <option value="proposal">Proposta</option>
                  <option value="won">Convertido</option>
                  <option value="lost">Perdido</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400">Valor potencial</label>
                <input
                  value={form.potentialValue}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, potentialValue: event.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Notas</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeLead}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveLead}
                  disabled={saving}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-white">{value}</p>
    </div>
  );
}
