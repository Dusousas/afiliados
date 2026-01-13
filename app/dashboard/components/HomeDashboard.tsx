import React, { useState } from "react";
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

export default function HomeDashboard() {
  const [period, setPeriod] = useState("30d");

  // Helper para formatar em REAL
  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Dados mockados - substitua pelos dados reais da sua API
  const stats = {
    totalComissoes: 86147,
    comissoesDisponiveis: 21234.8,
    totalCliques: 1547,
    conversoes: 89,
    taxaConversao: 5.8,
    vendasMes: 42,
  };

  const recentSales = [
    {
      id: 1,
      servico: "Desenvolvimento Web",
      valor: 1200,
      comissao: 180,
      data: "2025-11-14",
    },
    {
      id: 2,
      servico: "Design UI/UX",
      valor: 800,
      comissao: 120,
      data: "2025-11-13",
    },
    {
      id: 3,
      servico: "Consultoria",
      valor: 500,
      comissao: 75,
      data: "2025-11-12",
    },
    {
      id: 4,
      servico: "Manutenção",
      valor: 300,
      comissao: 45,
      data: "2025-11-11",
    },
  ];

  const topServices = [
    { nome: "Desenvolvimento Web", vendas: 28, comissao: 840 },
    { nome: "Design UI/UX", vendas: 15, comissao: 450 },
    { nome: "Consultoria", vendas: 12, comissao: 360 },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dashboard do Afiliado
          </h1>
          <p className="text-slate-400">
            Bem-vindo ao painel do afiliado. Aqui você vai ver um resumo das
            suas vendas, cliques e comissões.
          </p>
        </div>

        {/* Filtro de Período */}
        <div className="mb-6 flex gap-2">
          {["7d", "30d", "90d", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
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

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total de Comissões */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FiDollarSign className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Total
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {formatCurrency(stats.totalComissoes)}
            </h3>
            <p className="text-blue-100 text-sm">Comissões Totais</p>
          </div>

          {/* Comissões Disponíveis */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FiTrendingUp className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                Disponível
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">
              {formatCurrency(stats.comissoesDisponiveis)}
            </h3>
            <p className="text-green-100 text-sm">Pronto para Saque</p>
          </div>

          {/* Total de Cliques */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <FiMousePointer className="w-10 h-10 opacity-80" />
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalCliques}</h3>
            <p className="text-purple-100 text-sm">Cliques no Link</p>
          </div>

          {/* Conversões */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FiUsers className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.conversoes}
            </h3>
            <p className="text-slate-400 text-sm">Conversões</p>
          </div>

          {/* Taxa de Conversão */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FiEye className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.taxaConversao}%
            </h3>
            <p className="text-slate-400 text-sm">Taxa de Conversão</p>
          </div>

          {/* Vendas do Mês */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <FiCalendar className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.vendasMes}
            </h3>
            <p className="text-slate-400 text-sm">Vendas Este Mês</p>
          </div>
        </div>

        {/* Grid de Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Vendas Recentes */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AiOutlineLineChart className="w-5 h-5 text-blue-500" />
              Vendas Recentes
            </h2>
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-white font-medium">{sale.servico}</h3>
                    <span className="text-green-400 font-bold">
                      +{formatCurrency(sale.comissao)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">
                      Valor: {formatCurrency(sale.valor)}
                    </span>
                    <span className="text-slate-500">{sale.data}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Serviços */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5 text-green-500" />
              Top Serviços
            </h2>
            <div className="space-y-4">
              {topServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-medium">{service.nome}</h3>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">
                      {service.vendas} vendas
                    </span>
                    <span className="text-green-400 font-bold">
                      {formatCurrency(service.comissao)}
                    </span>
                  </div>
                  {/* Barra de progresso */}
                  <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${(service.vendas / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Pronto para ganhar mais?
          </h2>
          <p className="text-blue-100 mb-4">
            Compartilhe seu link de afiliado nas redes sociais e comece a ganhar
            comissões agora!
          </p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors inline-flex items-center gap-2">
            <FiCopy className="w-5 h-5" />
            Copiar Link de Afiliado
          </button>
        </div>
      </div>
    </section>
  );
}
