"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiCreditCard, FiDollarSign } from "react-icons/fi";
import { Affiliate, Commission, CommissionStatus } from "@/types/admin";
import { CardStat, EmptyState, SectionTitle, StatusBadge } from "../ui";
import { formatCurrency, formatDate } from "./formatters";

type Props = {
  commissions: Commission[];
  affiliates: Affiliate[];
  onApproveCommission: (id: string) => Promise<void>;
  onMarkCommissionAsPaid: (id: string) => Promise<void>;
};

export default function CommissionsModule({
  commissions,
  affiliates,
  onApproveCommission,
  onMarkCommissionAsPaid,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<CommissionStatus | "all">("all");
  const [affiliateFilter, setAffiliateFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredCommissions = useMemo(() => {
    return commissions.filter((item) => {
      const matchesStatus = statusFilter === "all" ? true : item.status === statusFilter;
      const matchesAffiliate = affiliateFilter === "all" ? true : item.affiliateId === affiliateFilter;
      const matchesStart = startDate ? new Date(item.createdAt) >= new Date(startDate) : true;
      const matchesEnd = endDate ? new Date(item.createdAt) <= new Date(endDate) : true;
      return matchesStatus && matchesAffiliate && matchesStart && matchesEnd;
    });
  }, [affiliateFilter, commissions, endDate, startDate, statusFilter]);

  const summary = useMemo(() => {
    const pending = filteredCommissions
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + item.amount, 0);

    const approved = filteredCommissions
      .filter((item) => item.status === "approved")
      .reduce((sum, item) => sum + item.amount, 0);

    const paid = filteredCommissions
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + item.amount, 0);

    const cancelled = filteredCommissions
      .filter((item) => item.status === "cancelled")
      .reduce((sum, item) => sum + item.amount, 0);

    return { pending, approved, paid, cancelled };
  }, [filteredCommissions]);

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Comissoes"
        description="Historico com filtros por afiliado, status e data"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardStat
          label="Pendentes"
          value={formatCurrency(summary.pending)}
          icon={<FiCreditCard className="h-5 w-5" />}
        />
        <CardStat
          label="Aprovadas"
          value={formatCurrency(summary.approved)}
          icon={<FiCheckCircle className="h-5 w-5" />}
        />
        <CardStat
          label="Pagas"
          value={formatCurrency(summary.paid)}
          icon={<FiDollarSign className="h-5 w-5" />}
        />
        <CardStat
          label="Canceladas"
          value={formatCurrency(summary.cancelled)}
          icon={<FiCreditCard className="h-5 w-5" />}
        />
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
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
            onChange={(event) => setStatusFilter(event.target.value as CommissionStatus | "all")}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Todos os status</option>
            <option value="pending">Pendente</option>
            <option value="approved">Aprovada</option>
            <option value="paid">Paga</option>
            <option value="cancelled">Cancelada</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />

          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
        </div>

        {filteredCommissions.length === 0 ? (
          <EmptyState message="Nenhuma comissao encontrada para os filtros selecionados." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">Comissao</th>
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Pedido</th>
                  <th className="pb-3 pr-3">Valor pedido</th>
                  <th className="pb-3 pr-3">Valor comissao</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCommissions.map((item) => (
                  <tr key={item.id} className="text-slate-200">
                    <td className="py-3 pr-3">
                      <p className="font-semibold text-white">{item.id}</p>
                      <p className="text-xs text-slate-400">{formatDate(item.createdAt)}</p>
                    </td>
                    <td className="py-3 pr-3">{item.affiliateName}</td>
                    <td className="py-3 pr-3">{item.orderId}</td>
                    <td className="py-3 pr-3">{formatCurrency(item.orderValue)}</td>
                    <td className="py-3 pr-3 font-semibold text-emerald-300">
                      {formatCurrency(item.amount)}
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onApproveCommission(item.id)}
                          disabled={item.status !== "pending"}
                          className="rounded-lg border border-slate-600 px-2 py-1 text-xs text-sky-300 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => onMarkCommissionAsPaid(item.id)}
                          disabled={item.status !== "approved"}
                          className="rounded-lg border border-slate-600 px-2 py-1 text-xs text-emerald-300 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Marcar paga
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
