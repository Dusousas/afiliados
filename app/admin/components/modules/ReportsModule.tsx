"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Commission, Lead, RankingItem } from "@/types/admin";
import { EmptyState, SectionTitle } from "../ui";
import { formatCurrency } from "./formatters";

type Props = {
  ranking: RankingItem[];
  commissions: Commission[];
  leads: Lead[];
};

export default function ReportsModule({ ranking, commissions, leads }: Props) {
  const monthlyData = buildMonthlyCommissions(commissions);
  const rankingChartData = ranking.slice(0, 8).map((item) => ({
    name: item.affiliateName.split(" ")[0],
    comissoes: item.totalCommissions,
    conversoes: item.totalConversions,
  }));

  const leadFunnel = [
    { label: "Novos", total: leads.filter((lead) => lead.status === "new").length },
    {
      label: "Qualificados",
      total: leads.filter((lead) => lead.status === "qualified").length,
    },
    {
      label: "Proposta",
      total: leads.filter((lead) => lead.status === "proposal").length,
    },
    { label: "Convertidos", total: leads.filter((lead) => lead.status === "won").length },
    { label: "Perdidos", total: leads.filter((lead) => lead.status === "lost").length },
  ];

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Ranking e Relatorios"
        description="Visao de ganhos, conversoes e melhor performance"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Ganhos por mes (comissoes)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  formatter={(value: unknown) => formatCurrency(Number(value ?? 0))}
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f8fafc",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#0bb0e6"
                  strokeWidth={3}
                  dot={{ fill: "#38bdf8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Top afiliados (ganhos e conversoes)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rankingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis yAxisId="left" stroke="#94a3b8" />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid #334155",
                    color: "#f8fafc",
                  }}
                />
                <Bar yAxisId="left" dataKey="comissoes" fill="#0bb0e6" radius={[6, 6, 0, 0]} />
                <Bar yAxisId="right" dataKey="conversoes" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-lg font-semibold text-white">Ranking detalhado</h3>

        {ranking.length === 0 ? (
          <EmptyState message="Sem dados para gerar ranking." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">Posicao</th>
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Leads</th>
                  <th className="pb-3 pr-3">Conversoes</th>
                  <th className="pb-3 pr-3">Taxa de conversao</th>
                  <th className="pb-3">Ganhos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {ranking.map((item, index) => (
                  <tr key={item.affiliateId} className="text-slate-200">
                    <td className="py-3 pr-3 font-semibold text-white">#{index + 1}</td>
                    <td className="py-3 pr-3">{item.affiliateName}</td>
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
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-lg font-semibold text-white">Funil de leads</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          {leadFunnel.map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-2xl font-bold text-white">{item.total}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function buildMonthlyCommissions(commissions: Commission[]) {
  const map = new Map<string, number>();

  commissions.forEach((commission) => {
    const [year, month] = commission.createdAt.split("-");
    const key = `${month}/${year.slice(-2)}`;
    const current = map.get(key) ?? 0;
    map.set(key, current + commission.amount);
  });

  return Array.from(map.entries()).map(([month, total]) => ({ month, total }));
}
