"use client";

import {
  FiCopy,
  FiLink,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiInfo,
} from "react-icons/fi";
import { HiOutlineGift } from "react-icons/hi";

const couponCode = "YOUON10";
const couponLink = `https://youon.com/afiliado/${couponCode}`;

const perks = [
  {
    label: "Comissao por venda",
    value: "20%",
    icon: FiTrendingUp,
    accent: "text-green-400",
  },
  {
    label: "Desconto para o cliente",
    value: "10%",
    icon: HiOutlineGift,
    accent: "text-blue-400",
  },
  {
    label: "Validade do cupom",
    value: "Sem expiracao",
    icon: FiClock,
    accent: "text-orange-400",
  },
];

const guarantees = [
  {
    title: "Link monitorado",
    desc: "Rastreio completo dos cliques e vendas geradas.",
    icon: FiShield,
  },
  {
    title: "Pagamento quinzenal",
    desc: "Comissoes liberadas sempre que atingir o minimo.",
    icon: FiInfo,
  },
  {
    title: "Uso simples",
    desc: "Cliente aplica o cupom no checkout e o desconto sai na hora.",
    icon: FiLink,
  },
];

const steps = [
  {
    title: "Copie o cupom",
    desc: "Use o botao para copiar e deixar salvo no celular.",
  },
  {
    title: "Compartilhe o link",
    desc: "Envie para leads no WhatsApp, Instagram ou email.",
  },
  {
    title: "Acompanhe as vendas",
    desc: "Volte ao Dashboard para ver cliques, vendas e saldo.",
  },
];

const copyToClipboard = (value: string) => {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(value).catch(() => {});
  }
};

export default function Cupon() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Meu Cupom</h1>
          <p className="text-slate-400 max-w-2xl">
            Seu codigo exclusivo para vender os servicos You On. Copie o cupom,
            compartilhe o link monitorado e acompanhe o desempenho aqui mesmo
            no painel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-blue-100">
                  Cupom ativo
                </p>
                <h2 className="text-3xl font-bold mt-1">YOU ON Afiliados</h2>
              </div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full">
                Sempre ligado
              </span>
            </div>

            <div className="bg-slate-900/30 border border-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-100 mb-1">Codigo do cupom</p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-3xl font-black tracking-[0.25em]">
                  {couponCode}
                </span>
                <button
                  onClick={() => copyToClipboard(couponCode)}
                  className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  <FiCopy className="w-4 h-4" />
                  Copiar
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-3">
                Clientes ganham desconto imediato ao usar o cupom. Sua
                comissao e rastreada automaticamente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-[240px] bg-slate-900/40 border border-white/10 rounded-lg px-4 py-3">
                <p className="text-sm text-blue-100 mb-1">Link direto</p>
                <div className="flex items-center gap-2 text-sm break-all">
                  <FiLink className="w-4 h-4" />
                  {couponLink}
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(couponLink)}
                className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/25 transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                Copiar link
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">
              Regras e beneficios
            </h3>
            <div className="space-y-4">
              {guarantees.map(({ title, desc, icon: Icon }) => (
                <div
                  key={title}
                  className="flex items-start gap-3 bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="mt-0.5">
                    <Icon className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{title}</p>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {perks.map(({ label, value, icon: Icon, accent }) => (
            <div
              key={label}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm">{label}</p>
                <Icon className={`w-5 h-5 ${accent}`} />
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
              <p className="text-slate-500 text-sm mt-1">
                Vendas validadas entram na sua carteira automaticamente.
              </p>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Como divulgar</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Passo a passo
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">
                    Etapa {index + 1}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                </div>
                <p className="text-white font-semibold mb-1">{step.title}</p>
                <p className="text-slate-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
