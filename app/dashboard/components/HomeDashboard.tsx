"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiMousePointer,
  FiEye,
  FiCalendar,
  FiCopy,
} from "react-icons/fi";
import { HiOutlineChartBar } from "react-icons/hi";
import { AiOutlineLineChart } from "react-icons/ai";
import { adminMockService } from "@/services/admin/adminMockService";
import { MOCK_AFFILIATE_ID } from "../constants";

export default function HomeDashboard() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<
    ReturnType<typeof adminMockService.getAffiliateDashboardData>
  > | null>(null);

  useEffect(() => {
    let mounted = true;

    adminMockService.getAffiliateDashboardData(MOCK_AFFILIATE_ID).then((snapshot) => {
      if (!mounted) return;
      setData(snapshot);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const filteredCommissions = useMemo(() => {
    if (!data) return [];
    if (period === "all") return data.commissions;

    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);

    return data.commissions.filter((item) => new Date(item.createdAt) >= threshold);
  }, [data, period]);

  const filteredLeads = useMemo(() => {
    if (!data) return [];
    if (period === "all") return data.leads;

    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - days);

    return data.leads.filter((item) => new Date(item.createdAt) >= threshold);
  }, [data, period]);

  const stats = useMemo(() => {
    const totalComissoes = filteredCommissions.reduce((sum, item) => sum + item.amount, 0);
    const comissoesDisponiveis = filteredCommissions
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + item.amount, 0);
    const conversoes = filteredLeads.filter((item) => item.status === "won").length;
    const totalCliques = filteredLeads.length * 37;
    const taxaConversao = filteredLeads.length
      ? (conversoes / filteredLeads.length) * 100
      : 0;
    const vendasMes = filteredCommissions.filter((item) => {
      const now = new Date();
      const d = new Date(item.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return {
      totalComissoes,
      comissoesDisponiveis,
      totalCliques,
      conversoes,
      taxaConversao,
      vendasMes,
    };
  }, [filteredCommissions, filteredLeads]);

  const recentSales = useMemo(
    () =>
      filteredCommissions
        .slice()
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 4),
    [filteredCommissions]
  );

  const topOrigins = useMemo(() => {
    const map = new Map<string, { vendas: number; comissao: number }>();

    filteredLeads.forEach((lead) => {
      const current = map.get(lead.origin) ?? { vendas: 0, comissao: 0 };
      const hasWon = lead.status === "won";
      map.set(lead.origin, {
        vendas: current.vendas + (hasWon ? 1 : 0),
        comissao: current.comissao,
      });
    });

    filteredCommissions.forEach((commission) => {
      const lead = filteredLeads.find((item) => item.id === commission.leadId);
      const key = lead?.origin ?? "Outros";
      const current = map.get(key) ?? { vendas: 0, comissao: 0 };
      map.set(key, {
        vendas: current.vendas,
        comissao: current.comissao + commission.amount,
      });
    });

    return Array.from(map.entries())
      .map(([nome, value]) => ({ nome, ...value }))
      .sort((a, b) => b.comissao - a.comissao)
      .slice(0, 3);
  }, [filteredCommissions, filteredLeads]);

  const mainCoupon = data?.coupons[0];

  const copyToClipboard = (value: string) => {
    if (!value) return;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">Dashboard do Afiliado</h1>
          <p className="text-slate-400">
            Visao conectada ao Admin (modo mock). Tudo que for alterado no painel
            administrativo pode refletir aqui.
          </p>
        </div>

        <div className="mb-6 flex gap-2">
          {["7d", "30d", "90d", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as "7d" | "30d" | "90d" | "all")}
              className={`rounded-lg px-4 py-2 font-medium transition-all ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {p === "7d" && "7 dias"}
              {p === "30d" && "30 dias"}
              {p === "90d" && "90 dias"}
              {p === "all" && "Tudo"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-36 animate-pulse rounded-xl border border-slate-700 bg-slate-800"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <FiDollarSign className="h-10 w-10 opacity-80" />
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm">Total</span>
                </div>
                <h3 className="mb-1 text-3xl font-bold">{formatCurrency(stats.totalComissoes)}</h3>
                <p className="text-sm text-blue-100">Comissoes Totais</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <FiTrendingUp className="h-10 w-10 opacity-80" />
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm">Disponivel</span>
                </div>
                <h3 className="mb-1 text-3xl font-bold">
                  {formatCurrency(stats.comissoesDisponiveis)}
                </h3>
                <p className="text-sm text-green-100">Pronto para saque</p>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white shadow-lg">
                <div className="mb-4 flex items-center justify-between">
                  <FiMousePointer className="h-10 w-10 opacity-80" />
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm">Estimado</span>
                </div>
                <h3 className="mb-1 text-3xl font-bold">{stats.totalCliques}</h3>
                <p className="text-sm text-purple-100">Cliques no link</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <FiUsers className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="mb-1 text-3xl font-bold text-white">{stats.conversoes}</h3>
                <p className="text-sm text-slate-400">Conversoes</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <FiEye className="h-8 w-8 text-cyan-500" />
                </div>
                <h3 className="mb-1 text-3xl font-bold text-white">
                  {stats.taxaConversao.toFixed(1)}%
                </h3>
                <p className="text-sm text-slate-400">Taxa de Conversao</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <FiCalendar className="h-8 w-8 text-pink-500" />
                </div>
                <h3 className="mb-1 text-3xl font-bold text-white">{stats.vendasMes}</h3>
                <p className="text-sm text-slate-400">Vendas neste mes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                  <AiOutlineLineChart className="h-5 w-5 text-blue-500" />
                  Comissoes recentes
                </h2>
                <div className="space-y-3">
                  {recentSales.length === 0 ? (
                    <p className="text-sm text-slate-500">Nenhuma venda no periodo.</p>
                  ) : (
                    recentSales.map((sale) => (
                      <div
                        key={sale.id}
                        className="rounded-lg border border-slate-700 bg-slate-900 p-4 transition-colors hover:border-slate-600"
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <h3 className="font-medium text-white">Pedido {sale.orderId}</h3>
                          <span className="font-bold text-green-400">
                            +{formatCurrency(sale.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">
                            Valor: {formatCurrency(sale.orderValue)}
                          </span>
                          <span className="text-slate-500">{sale.createdAt}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800 p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                  <HiOutlineChartBar className="h-5 w-5 text-green-500" />
                  Top origens
                </h2>
                <div className="space-y-4">
                  {topOrigins.length === 0 ? (
                    <p className="text-sm text-slate-500">Sem dados de origem neste periodo.</p>
                  ) : (
                    topOrigins.map((service, index) => (
                      <div key={service.nome} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="font-medium text-white">{service.nome}</h3>
                          <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                            #{index + 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">{service.vendas} conversoes</span>
                          <span className="font-bold text-green-400">
                            {formatCurrency(service.comissao)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-white">Seu link de afiliado</h2>
              <p className="mb-4 text-blue-100">
                Cupom e link definidos pelo Admin. Compartilhe para aumentar suas conversoes.
              </p>
              <button
                onClick={() => copyToClipboard(mainCoupon?.link ?? "")}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-bold text-blue-600 transition-colors hover:bg-blue-50"
              >
                <FiCopy className="h-5 w-5" />
                {mainCoupon ? `Copiar ${mainCoupon.code}` : "Sem cupom ativo"}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
