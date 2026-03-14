"use client";

import { useEffect, useMemo, useState } from "react";
import { FiCopy, FiDownload, FiLink, FiPlay } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { adminMockService } from "@/services/admin/adminMockService";
import { MOCK_AFFILIATE_ID } from "../constants";

const typeLabel: Record<string, string> = {
  banner: "Banner",
  link: "Link",
  copy: "Copy",
  file: "Arquivo",
  image: "Imagem",
};

export default function Material() {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<Awaited<
    ReturnType<typeof adminMockService.getAffiliateDashboardData>
  > | null>(null);

  useEffect(() => {
    let mounted = true;

    adminMockService.getAffiliateDashboardData(MOCK_AFFILIATE_ID).then((data) => {
      if (!mounted) return;
      setSnapshot(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const activeCampaigns = snapshot?.campaigns ?? [];
  const materials = useMemo(() => snapshot?.materials ?? [], [snapshot]);

  const copyToClipboard = (value: string) => {
    if (!value) return;
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Materiais You On</h1>
          <p className="text-slate-400 max-w-2xl">
            Materiais sincronizados com o Admin (mock). Tudo que for publicado
            no painel administrativo aparece aqui para o afiliado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-blue-100 uppercase tracking-[0.2em]">Kit atualizado</p>
                <h2 className="text-3xl font-bold mt-1">Pacote de criativos</h2>
              </div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full">
                {loading ? "Carregando" : `${materials.length} materiais`}
              </span>
            </div>
            <p className="text-blue-100 mb-4">
              Banners, links, copies e arquivos publicados pelo Admin para voce divulgar.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                <FiDownload className="w-5 h-5" />
                Baixar kit
              </button>
              <button className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/25 transition-colors">
                <FiPlay className="w-5 h-5" />
                Ver guia rapido
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-amber-300" />
              Campanhas ativas
            </h3>

            <div className="space-y-3">
              {activeCampaigns.length === 0 ? (
                <p className="text-sm text-slate-500">Nenhuma campanha ativa no momento.</p>
              ) : (
                activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-semibold">{campaign.name}</p>
                      <span className="text-xs text-amber-200 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30">
                        {campaign.startDate} a {campaign.endDate}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">{campaign.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Artes e materiais</h3>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Download</span>
          </div>

          {materials.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900 p-6 text-center text-slate-400">
              Nenhum material publicado ainda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {materials.map((material) => (
                <div key={material.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{material.title}</p>
                    <span className="text-xs text-slate-300">{typeLabel[material.type]}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-2">{material.description}</p>
                  <p className="text-slate-500 text-xs mb-3">{material.fileName ?? "Sem arquivo"}</p>

                  <div className="flex items-center justify-between">
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-sm"
                    >
                      <FiLink className="w-4 h-4" />
                      Abrir
                    </a>
                    <button
                      onClick={() => copyToClipboard(material.url)}
                      className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                    >
                      <FiCopy className="w-4 h-4" />
                      Copiar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
