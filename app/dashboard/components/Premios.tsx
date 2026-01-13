"use client";

import React, { useMemo, useState } from "react";
import { FiGift, FiCheckCircle, FiTrendingUp, FiMapPin, FiSend } from "react-icons/fi";

type Premio = {
  id: number;
  titulo: string;
  descricao: string;
  meta: number;
  resgatado?: boolean;
};

const premios: Premio[] = [
  {
    id: 1,
    titulo: "Kit Welcome",
    descricao: "Camiseta, caneca e adesivos You On.",
    meta: 2000,
  },
  {
    id: 2,
    titulo: "Upgrade Home Office",
    descricao: "Headset + suporte de notebook.",
    meta: 5000,
  },
  {
    id: 3,
    titulo: "Bonus Cash",
    descricao: "R$ 1.000 extras para acelerar vendas.",
    meta: 10000,
  },
  {
    id: 4,
    titulo: "Viagem Experience",
    descricao: "Experiencia com o time You On.",
    meta: 20000,
  },
];

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Premios() {
  const [comissaoTotal] = useState(7200);
  const [comissaoDisponivel] = useState(3600);
  const [address, setAddress] = useState({
    nome: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const progressoGlobal = useMemo(() => {
    const maiorMeta = Math.max(...premios.map((p) => p.meta));
    return Math.min((comissaoTotal / maiorMeta) * 100, 100);
  }, [comissaoTotal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui voce pode salvar o endereco na API
    console.log("Endereco salvo:", address);
  };

  const podeResgatar = (meta: number) => comissaoTotal >= meta;

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Premios e metas</h1>
          <p className="text-slate-400 max-w-2xl">
            Bata metas de comissao e resgate seus premios. Preencha o endereco de entrega para
            receber os brindes fisicos assim que a solicitacao for aprovada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-blue-100">Comissao total</p>
              <FiTrendingUp className="w-6 h-6 opacity-80" />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(comissaoTotal)}</p>
            <p className="text-blue-100 text-sm">Somando todas as vendas validadas</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">Comissao disponivel</p>
              <FiGift className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(comissaoDisponivel)}</p>
            <p className="text-slate-500 text-sm">Pode ser usada para saque ou premios</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-sm">Progresso geral</p>
              <FiCheckCircle className="w-5 h-5 text-sky-400" />
            </div>
            <p className="text-3xl font-bold text-white">{progressoGlobal.toFixed(0)}%</p>
            <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"
                style={{ width: `${progressoGlobal}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Metas e premios</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Resgate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {premios.map((premio) => {
              const progresso = Math.min((comissaoTotal / premio.meta) * 100, 100);
              const liberado = podeResgatar(premio.meta);

              return (
                <div
                  key={premio.id}
                  className="bg-slate-900 rounded-lg p-5 border border-slate-700 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{premio.titulo}</p>
                      <p className="text-slate-400 text-sm">{premio.descricao}</p>
                    </div>
                    <span className="text-xs text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                      Meta: {formatCurrency(premio.meta)}
                    </span>
                  </div>

                  <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      style={{ width: `${progresso}%` }}
                    />
                  </div>
                  <p className="text-slate-400 text-sm">
                    {liberado
                      ? "Meta atingida! Pode solicitar."
                      : `Faltam ${formatCurrency(Math.max(premio.meta - comissaoTotal, 0))} para liberar.`}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Comissao atual: {formatCurrency(comissaoTotal)}</p>
                    <button
                      disabled={!liberado}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        liberado
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                      }`}
                    >
                      <FiGift className="w-4 h-4" />
                      {liberado ? "Resgatar" : "Indisponivel"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-amber-400" />
              Endereco de entrega
            </h3>
            <span className="text-xs text-slate-400">Preencha para premios fisicos</span>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-400">Nome completo</label>
              <input
                value={address.nome}
                onChange={(e) => setAddress((p) => ({ ...p, nome: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="Ex: Maria Souza"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Rua</label>
              <input
                value={address.rua}
                onChange={(e) => setAddress((p) => ({ ...p, rua: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="Av. Principal"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Numero</label>
              <input
                value={address.numero}
                onChange={(e) => setAddress((p) => ({ ...p, numero: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="123"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Complemento</label>
              <input
                value={address.complemento}
                onChange={(e) => setAddress((p) => ({ ...p, complemento: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="Apto, bloco, referencia..."
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Bairro</label>
              <input
                value={address.bairro}
                onChange={(e) => setAddress((p) => ({ ...p, bairro: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="Centro"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">Cidade</label>
              <input
                value={address.cidade}
                onChange={(e) => setAddress((p) => ({ ...p, cidade: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="Sao Paulo"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Estado</label>
              <input
                value={address.estado}
                onChange={(e) => setAddress((p) => ({ ...p, estado: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="SP"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400">CEP</label>
              <input
                value={address.cep}
                onChange={(e) => setAddress((p) => ({ ...p, cep: e.target.value }))}
                className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-500"
                placeholder="00000-000"
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-5 py-2 rounded-lg transition-colors"
              >
                <FiSend className="w-4 h-4" />
                Salvar endereco
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
