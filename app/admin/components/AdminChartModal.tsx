"use client";

import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export type ChartPoint = {
  label: string; // ex: "01/12"
  vendas: number;
  cliques: number;
  comissoes: number; // BRL
};

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  data: ChartPoint[];
};

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AdminChartModal({
  open,
  onClose,
  title = "Performance do Programa",
  subtitle = "Vendas, cliques e comissões no período selecionado",
  data,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <button
        aria-label="Fechar gráfico"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      {/* Modal */}
      <div className="relative z-[1000] mx-auto mt-16 w-[92%] max-w-5xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800">
            <div>
              <h3 className="text-white text-xl font-bold">{title}</h3>
              <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
            </div>

            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg p-2 transition-colors"
              aria-label="Fechar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <div className="h-[360px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => {
                        if (name === "comissoes")
                          return [formatBRL(Number(value)), "Comissões"];
                        if (name === "vendas") return [value, "Vendas"];
                        if (name === "cliques") return [value, "Cliques"];
                        return [value, name];
                      }}
                      labelFormatter={(label) => `Dia: ${label}`}
                    />

                    {/* Sem cor fixa (você pode ajustar depois para a paleta) */}
                    <Line type="monotone" dataKey="vendas" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="cliques" strokeWidth={2} dot={false} />
                    <Line
                      type="monotone"
                      dataKey="comissoes"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
                  vendas
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
                  cliques
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-200">
                  comissões
                </span>
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-4">
              Dica: pressione <span className="text-slate-300">ESC</span> para fechar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
