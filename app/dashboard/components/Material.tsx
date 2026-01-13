"use client";

import { FiDownload, FiPlay, FiLink, FiCopy, FiClock } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

const promos = [
  {
    titulo: "Campanha Black",
    descricao: "Desconto extra de 20% para novos clientes ate o fim do mes.",
    validade: "Valido ate 30/11",
    bonus: "Comissao turbinada +5%",
    link: "https://youon.com/afiliados/campanha-black",
  },
  {
    titulo: "Semana Social",
    descricao: "Pacote de gestao de redes com 15% OFF e setup gratis.",
    validade: "Valido ate 10/12",
    bonus: "Lead qualificado em 48h",
    link: "https://youon.com/afiliados/semana-social",
  },
];

const assets = [
  {
    titulo: "Kit Social 1080x1080",
    tipo: "Imagens",
    tamanho: "12 MB",
    link: "https://youon.com/assets/kit-social.zip",
    tags: ["Instagram", "Carrossel", "PNG"],
  },
  {
    titulo: "Stories animados",
    tipo: "Video",
    tamanho: "35 MB",
    link: "https://youon.com/assets/stories-animados.zip",
    tags: ["Stories", "MP4", "Animado"],
  },
  {
    titulo: "Apresentacao comercial",
    tipo: "PDF",
    tamanho: "4 MB",
    link: "https://youon.com/assets/apresentacao.pdf",
    tags: ["Pitch", "Proposta", "PDF"],
  },
];

const videos = [
  {
    titulo: "Como divulgar no Instagram",
    duracao: "08:12",
    link: "https://youon.com/v/class-instagram",
  },
  {
    titulo: "Copy rapida para WhatsApp",
    duracao: "05:47",
    link: "https://youon.com/v/copy-whatsapp",
  },
  {
    titulo: "Checklist de fechamento",
    duracao: "06:03",
    link: "https://youon.com/v/checklist-fechamento",
  },
];

const copyToClipboard = (value: string) => {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(value).catch(() => {});
  }
};

export default function Material() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Materiais You On</h1>
          <p className="text-slate-400 max-w-2xl">
            Kit completo de criativos, promocoes e videoaulas para voce divulgar
            e vender. Baixe, copie o link e compartilhe com seus leads.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-blue-100 uppercase tracking-[0.2em]">
                  Kit atualizado
                </p>
                <h2 className="text-3xl font-bold mt-1">Pacote de criativos</h2>
              </div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full">
                Nov 2025
              </span>
            </div>
            <p className="text-blue-100 mb-4">
              Imagens, stories animados, mockups e copies prontas para voce
              divulgar nas redes sociais e WhatsApp.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                <FiDownload className="w-5 h-5" />
                Baixar kit
              </button>
              <button className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/25 transition-colors">
                <FiPlay className="w-5 h-5" />
                Ver video guia
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-amber-300" />
              Promocoes ativas
            </h3>
            <div className="space-y-3">
              {promos.map((promo) => (
                <div
                  key={promo.titulo}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{promo.titulo}</p>
                    <span className="text-xs text-amber-200 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30">
                      {promo.validade}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm">{promo.descricao}</p>
                  <p className="text-green-300 text-sm font-semibold mt-2">
                    {promo.bonus}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-slate-400 flex items-center gap-2">
                      <FiLink className="w-4 h-4" />
                      {promo.link}
                    </div>
                    <button
                      onClick={() => copyToClipboard(promo.link)}
                      className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
                    >
                      <FiCopy className="w-4 h-4" />
                      Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Artes e banners</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Download
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.titulo}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">{asset.titulo}</p>
                  <span className="text-xs text-slate-300">{asset.tipo}</span>
                </div>
                <p className="text-slate-500 text-sm mb-2">{asset.tamanho}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {asset.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href={asset.link}
                    className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-sm"
                  >
                    <FiDownload className="w-4 h-4" />
                    Baixar
                  </a>
                  <button
                    onClick={() => copyToClipboard(asset.link)}
                    className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copiar link
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Videoaulas</h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <FiClock className="w-4 h-4" />
              Atualizado semanalmente
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.titulo}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">{video.titulo}</p>
                  <span className="text-xs text-slate-400">{video.duracao}</span>
                </div>
                <div className="flex items-center justify-between">
                  <a
                    href={video.link}
                    className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-sm"
                  >
                    <FiPlay className="w-4 h-4" />
                    Assistir
                  </a>
                  <button
                    onClick={() => copyToClipboard(video.link)}
                    className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    <FiCopy className="w-4 h-4" />
                    Copiar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
