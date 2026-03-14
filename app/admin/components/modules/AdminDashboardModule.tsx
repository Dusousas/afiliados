"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FiActivity, FiCreditCard, FiDollarSign, FiUsers } from "react-icons/fi";
import { AdminDashboardMetrics, Commission, Lead, RankingItem } from "@/types/admin";
import { CardStat, EmptyState, SectionTitle, StatusBadge } from "../ui";
import { formatCurrency } from "./formatters";

type Props = {
  metrics: AdminDashboardMetrics;
  ranking: RankingItem[];
  commissions: Commission[];
  leads: Lead[];
};

export default function AdminDashboardModule({
  metrics,
  ranking,
  commissions,
  leads,
}: Props) {
  const commissionStatusData = [
    {
      status: "pending",
      total: commissions
        .filter((item) => item.status === "pending")
        .reduce((sum, item) => sum + item.amount, 0),
    },
    {
      status: "approved",
      total: commissions
        .filter((item) => item.status === "approved")
        .reduce((sum, item) => sum + item.amount, 0),
    },
    {
      status: "paid",
      total: commissions
        .filter((item) => item.status === "paid")
        .reduce((sum, item) => sum + item.amount, 0),
    },
    {
      status: "cancelled",
      total: commissions
        .filter((item) => item.status === "cancelled")
        .reduce((sum, item) => sum + item.amount, 0),
    },
  ];

  const leadStatusData = [
    { status: "new", total: leads.filter((lead) => lead.status === "new").length },
    {
      status: "qualified",
      total: leads.filter((lead) => lead.status === "qualified").length,
    },
    {
      status: "proposal",
      total: leads.filter((lead) => lead.status === "proposal").length,
    },
    { status: "won", total: leads.filter((lead) => lead.status === "won").length },
    { status: "lost", total: leads.filter((lead) => lead.status === "lost").length },
  ];

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Visao Geral"
        description="Metricas centrais do programa de afiliados com dados mockados"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <CardStat
          label="Total de afiliados"
          value={metrics.totalAffiliates}
          icon={<FiUsers className="h-5 w-5" />}
          helper="Quantidade total cadastrada"
        />
        <CardStat
          label="Afiliados ativos"
          value={metrics.activeAffiliates}
          icon={<FiActivity className="h-5 w-5" />}
          helper="Com atividade recente no painel"
        />
        <CardStat
          label="Total de comissoes"
          value={formatCurrency(metrics.totalCommissions)}
          icon={<FiDollarSign className="h-5 w-5" />}
          helper="Soma geral do historico"
        />
        <CardStat
          label="Comissoes pendentes"
          value={formatCurrency(metrics.pendingCommissions)}
          icon={<FiCreditCard className="h-5 w-5" />}
          helper="Aguardando aprovacao"
        />
        <CardStat
          label="Comissoes pagas"
          value={formatCurrency(metrics.paidCommissions)}
          icon={<FiCreditCard className="h-5 w-5" />}
          helper="Ja liquidadas"
        />
        <CardStat
          label="Numero de leads"
          value={metrics.totalLeads}
          icon={<FiUsers className="h-5 w-5" />}
          helper="Total de indicacoes registradas"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="mb-3 text-sm text-slate-300">Comissoes por status</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commissionStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value: unknown) => formatCurrency(Number(value ?? 0))}
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="total" fill="#0bb0e6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="mb-3 text-sm text-slate-300">Leads por etapa do funil</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadStatusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="status" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f8fafc",
                  }}
                />
                <Bar dataKey="total" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Ranking de afiliados</h3>
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Top performance</span>
        </div>

        {ranking.length === 0 ? (
          <EmptyState message="Nenhum afiliado para exibir no ranking." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">#</th>
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Leads</th>
                  <th className="pb-3 pr-3">Conversoes</th>
                  <th className="pb-3 pr-3">Taxa</th>
                  <th className="pb-3">Comissoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {ranking.slice(0, 7).map((item, index) => (
                  <tr key={item.affiliateId} className="text-slate-200">
                    <td className="py-3 pr-3">#{index + 1}</td>
                    <td className="py-3 pr-3 font-semibold text-white">{item.affiliateName}</td>
                    <td className="py-3 pr-3">{item.totalLeads}</td>
                    <td className="py-3 pr-3">{item.totalConversions}</td>
                    <td className="py-3 pr-3">{item.conversionRate.toFixed(1)}%</td>
                    <td className="py-3 font-semibold text-emerald-300">
                      {formatCurrency(item.totalCommissions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
          <StatusBadge status="blocked" />
        </div>
      </div>
    </section>
  );
}
