"use client";

import React, { useMemo, useState } from "react";
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

import AdminChartModal, { ChartPoint } from "./AdminChartModal"; // ajuste o path

export default function HomeDashboardAdmin() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "all">("30d");
  const [chartOpen, setChartOpen] = useState(false);

  // Helper para formatar em REAL
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Dados mockados (ADMIN) — substitua pela sua API
  const stats = {
    afiliadosTotal: 126,
    afiliadosAtivos: 74,
    totalComissoesGeradas: 148678.18,
    comissoesPendentes: 21234.8,
    totalCliques: 1547,
    conversaoMedia: 5.8,
    vendasPeriodo: 42,
  };

  // Atividade recente (conversões/vendas)
  const recentActivity = [
    {
      id: 1,
      afiliado: "Ana Souza",
      acao: "Venda aprovada",
      servico: "Desenvolvimento Web",
      valor: 1200,
      comissao: 180,
      data: "2025-11-14",
    },
    {
      id: 2,
      afiliado: "Carlos Lima",
      acao: "Venda aprovada",
      servico: "Design UI/UX",
      valor: 800,
      comissao: 120,
      data: "2025-11-13",
    },
    {
      id: 3,
      afiliado: "Mariana Alves",
      acao: "Conversão registrada",
      servico: "Consultoria",
      valor: 500,
      comissao: 75,
      data: "2025-11-12",
    },
    {
      id: 4,
      afiliado: "Pedro Rocha",
      acao: "Venda aprovada",
      servico: "Manutenção",
      valor: 300,
      comissao: 45,
      data: "2025-11-11",
    },
  ];

  // Top afiliados
  const topAffiliates = [
    { nome: "Ana Souza", vendas: 18, comissao: 24833 },
    { nome: "Carlos Lima", vendas: 12, comissao: 15391.18 },
    { nome: "Mariana Alves", vendas: 9, comissao: 9373 },
  ];

  const maxVendasTop = useMemo(() => {
    const max = Math.max(...topAffiliates.map((a) => a.vendas));
    return max > 0 ? max : 1;
  }, [topAffiliates]);

  // Mock de dados do gráfico (troca conforme o período)
  const chartData: ChartPoint[] = useMemo(() => {
    const base7 = [
      { label: "01/12", vendas: 2, cliques: 45, comissoes: 180 },
      { label: "02/12", vendas: 1, cliques: 33, comissoes: 120 },
      { label: "03/12", vendas: 4, cliques: 70, comissoes: 360 },
      { label: "04/12", vendas: 3, cliques: 62, comissoes: 240 },
      { label: "05/12", vendas: 5, cliques: 90, comissoes: 480 },
      { label: "06/12", vendas: 2, cliques: 40, comissoes: 180 },
      { label: "07/12", vendas: 6, cliques: 120, comissoes: 540 },
    ];

    const base30 = [
      { label: "01", vendas: 1, cliques: 18, comissoes: 90 },
      { label: "05", vendas: 3, cliques: 42, comissoes: 270 },
      { label: "10", vendas: 4, cliques: 55, comissoes: 360 },
      { label: "15", vendas: 2, cliques: 38, comissoes: 180 },
      { label: "20", vendas: 5, cliques: 80, comissoes: 450 },
      { label: "25", vendas: 6, cliques: 95, comissoes: 540 },
      { label: "30", vendas: 4, cliques: 70, comissoes: 360 },
    ];

    const base90 = [
      { label: "S1", vendas: 6, cliques: 120, comissoes: 540 },
      { label: "S2", vendas: 9, cliques: 180, comissoes: 810 },
      { label: "S3", vendas: 7, cliques: 150, comissoes: 630 },
      { label: "S4", vendas: 10, cliques: 210, comissoes: 900 },
      { label: "S5", vendas: 8, cliques: 160, comissoes: 720 },
      { label: "S6", vendas: 12, cliques: 240, comissoes: 1080 },
    ];

    const baseAll = [
      { label: "Jan", vendas: 22, cliques: 420, comissoes: 1980 },
      { label: "Fev", vendas: 18, cliques: 380, comissoes: 1620 },
      { label: "Mar", vendas: 25, cliques: 520, comissoes: 2250 },
      { label: "Abr", vendas: 19, cliques: 410, comissoes: 1710 },
      { label: "Mai", vendas: 28, cliques: 610, comissoes: 2520 },
      { label: "Jun", vendas: 24, cliques: 560, comissoes: 2160 },
    ];

    if (period === "7d") return base7;
    if (period === "30d") return base30;
    if (period === "90d") return base90;
    return baseAll;
  }, [period]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Admin</h1>
          <p className="text-slate-400">
            Visão geral do programa de afiliados: afiliados, cliques, vendas e comissões.
          </p>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6 flex gap-2">
          {(["7d", "30d", "90d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${period === p
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

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Afiliados Totais */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Total</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.afiliadosTotal}</h3>
            <p className="text-blue-100 text-sm">Afiliados cadastrados</p>
          </div>

          {/* Afiliados Ativos */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Ativos</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.afiliadosAtivos}</h3>
            <p className="text-green-100 text-sm">Afiliados ativos no período</p>
          </div>

          {/* Total de Cliques */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FiMousePointer className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Global</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalCliques}</h3>
            <p className="text-purple-100 text-sm">Cliques em links</p>
          </div>

          {/* Comissões Geradas */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FiDollarSign className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {formatCurrency(stats.totalComissoesGeradas)}
            </h3>
            <p className="text-slate-400 text-sm">Comissões geradas (global)</p>
          </div>

          {/* Comissões Pendentes */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {formatCurrency(stats.comissoesPendentes)}
            </h3>
            <p className="text-slate-400 text-sm">Comissões pendentes</p>
          </div>

          {/* Vendas do período */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FiCalendar className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stats.vendasPeriodo}</h3>
            <p className="text-slate-400 text-sm">Vendas no período</p>
          </div>
        </div>

        {/* Grid de Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Atividade Recente */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AiOutlineLineChart className="w-5 h-5 text-blue-500" />
              Atividade Recente
            </h2>

            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-medium">
                        {item.acao} • {item.servico}
                      </h3>
                      <p className="text-slate-400 text-sm">Afiliado: {item.afiliado}</p>
                    </div>

                    <span className="text-green-400 font-bold">
                      +{formatCurrency(item.comissao)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">
                      Valor: {formatCurrency(item.valor)}
                    </span>
                    <span className="text-slate-500">{item.data}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Afiliados */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5 text-green-500" />
              Top Afiliados
            </h2>

            <div className="space-y-4">
              {topAffiliates.map((affiliate, index) => (
                <div
                  key={index}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">{affiliate.nome}</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">{affiliate.vendas} vendas</span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(affiliate.comissao)}
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                      style={{
                        width: `${(affiliate.vendas / maxVendasTop) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Acompanhe a performance do programa
          </h2>
          <p className="text-blue-100 mb-4">
            Abra o gráfico para visualizar vendas, cliques e comissões no período selecionado.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setChartOpen(true)}
              className="bg-white text-blue-600 cursor-pointer px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <FiEye className="w-5 h-5" />
              Ver gráfico
            </button>
          </div>
        </div>
      </div>

      {/* Modal do gráfico */}
      <AdminChartModal
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        data={chartData}
        title="Gráfico do Programa"
        subtitle={`Período: ${period}`}
      />
    </section>
  );
}
