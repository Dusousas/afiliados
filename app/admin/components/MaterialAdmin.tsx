"use client";

import React, { useMemo, useState } from "react";
import {
  FiDownload,
  FiPlay,
  FiLink,
  FiCopy,
  FiClock,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSave,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";

type Promo = {
  id: string;
  titulo: string;
  descricao: string;
  validade: string;
  bonus: string;
  link: string;
  ativo: boolean;
};

type Asset = {
  id: string;
  titulo: string;
  tipo: "Imagens" | "Video" | "PDF" | "Arquivo";
  tamanho: string;
  link: string;
  tags: string[];
  ativo: boolean;
};

type Video = {
  id: string;
  titulo: string;
  duracao: string;
  link: string;
  ativo: boolean;
};

const copyToClipboard = (value: string) => {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(value).catch(() => {});
  }
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

type ModalMode = "create" | "edit";
type ModalType = "promo" | "asset" | "video";

type ModalState =
  | { open: false }
  | {
      open: true;
      mode: ModalMode;
      type: ModalType;
      id?: string; // quando edit
    };

function ModalShell({
  open,
  title,
  subtitle,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative z-[1000] mx-auto mt-16 w-[92%] max-w-3xl">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex items-start justify-between gap-4 p-6 border-b border-slate-800">
            <div>
              <h3 className="text-white text-xl font-bold">{title}</h3>
              {subtitle ? (
                <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
              ) : null}
            </div>

            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg p-2 transition-colors"
              aria-label="Fechar"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function MaterialAdmin() {
  // ====== MOCK STATE (troque por API depois) ======
  const [promos, setPromos] = useState<Promo[]>([
    {
      id: "p1",
      titulo: "Campanha Black",
      descricao: "Desconto extra de 20% para novos clientes ate o fim do mes.",
      validade: "Valido ate 30/11",
      bonus: "Comissao turbinada +5%",
      link: "https://youon.com/afiliados/campanha-black",
      ativo: true,
    },
    {
      id: "p2",
      titulo: "Semana Social",
      descricao: "Pacote de gestao de redes com 15% OFF e setup gratis.",
      validade: "Valido ate 10/12",
      bonus: "Lead qualificado em 48h",
      link: "https://youon.com/afiliados/semana-social",
      ativo: true,
    },
  ]);

  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "a1",
      titulo: "Kit Social 1080x1080",
      tipo: "Imagens",
      tamanho: "12 MB",
      link: "https://youon.com/assets/kit-social.zip",
      tags: ["Instagram", "Carrossel", "PNG"],
      ativo: true,
    },
    {
      id: "a2",
      titulo: "Stories animados",
      tipo: "Video",
      tamanho: "35 MB",
      link: "https://youon.com/assets/stories-animados.zip",
      tags: ["Stories", "MP4", "Animado"],
      ativo: true,
    },
    {
      id: "a3",
      titulo: "Apresentacao comercial",
      tipo: "PDF",
      tamanho: "4 MB",
      link: "https://youon.com/assets/apresentacao.pdf",
      tags: ["Pitch", "Proposta", "PDF"],
      ativo: true,
    },
  ]);

  const [videos, setVideos] = useState<Video[]>([
    {
      id: "v1",
      titulo: "Como divulgar no Instagram",
      duracao: "08:12",
      link: "https://youon.com/v/class-instagram",
      ativo: true,
    },
    {
      id: "v2",
      titulo: "Copy rapida para WhatsApp",
      duracao: "05:47",
      link: "https://youon.com/v/copy-whatsapp",
      ativo: true,
    },
    {
      id: "v3",
      titulo: "Checklist de fechamento",
      duracao: "06:03",
      link: "https://youon.com/v/checklist-fechamento",
      ativo: true,
    },
  ]);

  // ====== MODAL CONTROL ======
  const [modal, setModal] = useState<ModalState>({ open: false });

  // ====== FORMS (controlados) ======
  const [promoForm, setPromoForm] = useState<Omit<Promo, "id">>({
    titulo: "",
    descricao: "",
    validade: "",
    bonus: "",
    link: "",
    ativo: true,
  });

  const [assetForm, setAssetForm] = useState<Omit<Asset, "id">>({
    titulo: "",
    tipo: "Imagens",
    tamanho: "",
    link: "",
    tags: [],
    ativo: true,
  });

  const [videoForm, setVideoForm] = useState<Omit<Video, "id">>({
    titulo: "",
    duracao: "",
    link: "",
    ativo: true,
  });

  const openCreate = (type: ModalType) => {
    if (type === "promo") {
      setPromoForm({
        titulo: "",
        descricao: "",
        validade: "",
        bonus: "",
        link: "",
        ativo: true,
      });
    }
    if (type === "asset") {
      setAssetForm({
        titulo: "",
        tipo: "Imagens",
        tamanho: "",
        link: "",
        tags: [],
        ativo: true,
      });
    }
    if (type === "video") {
      setVideoForm({ titulo: "", duracao: "", link: "", ativo: true });
    }
    setModal({ open: true, mode: "create", type });
  };

  const openEdit = (type: ModalType, id: string) => {
    if (type === "promo") {
      const item = promos.find((p) => p.id === id);
      if (!item) return;
      const { id: _id, ...rest } = item;
      setPromoForm(rest);
    }
    if (type === "asset") {
      const item = assets.find((a) => a.id === id);
      if (!item) return;
      const { id: _id, ...rest } = item;
      setAssetForm(rest);
    }
    if (type === "video") {
      const item = videos.find((v) => v.id === id);
      if (!item) return;
      const { id: _id, ...rest } = item;
      setVideoForm(rest);
    }
    setModal({ open: true, mode: "edit", type, id });
  };

  const closeModal = () => setModal({ open: false });

  const submitModal = () => {
    if (!modal.open) return;

    const { type, mode } = modal;

    if (type === "promo") {
      if (!promoForm.titulo || !promoForm.link) return;
      if (mode === "create") {
        setPromos((prev) => [{ id: uid(), ...promoForm }, ...prev]);
      } else {
        const id = modal.id!;
        setPromos((prev) => prev.map((p) => (p.id === id ? { id, ...promoForm } : p)));
      }
    }

    if (type === "asset") {
      if (!assetForm.titulo || !assetForm.link) return;
      if (mode === "create") {
        setAssets((prev) => [{ id: uid(), ...assetForm }, ...prev]);
      } else {
        const id = modal.id!;
        setAssets((prev) => prev.map((a) => (a.id === id ? { id, ...assetForm } : a)));
      }
    }

    if (type === "video") {
      if (!videoForm.titulo || !videoForm.link) return;
      if (mode === "create") {
        setVideos((prev) => [{ id: uid(), ...videoForm }, ...prev]);
      } else {
        const id = modal.id!;
        setVideos((prev) => prev.map((v) => (v.id === id ? { id, ...videoForm } : v)));
      }
    }

    closeModal();
  };

  const removeItem = (type: ModalType, id: string) => {
    if (type === "promo") setPromos((prev) => prev.filter((p) => p.id !== id));
    if (type === "asset") setAssets((prev) => prev.filter((a) => a.id !== id));
    if (type === "video") setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const toggleActive = (type: ModalType, id: string) => {
    if (type === "promo") {
      setPromos((prev) => prev.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p)));
    }
    if (type === "asset") {
      setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ativo: !a.ativo } : a)));
    }
    if (type === "video") {
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ativo: !v.ativo } : v)));
    }
  };

  const modalTitle = useMemo(() => {
    if (!modal.open) return "";
    const base =
      modal.type === "promo"
        ? "Promoção"
        : modal.type === "asset"
        ? "Asset"
        : "Vídeo";
    return modal.mode === "create" ? `Adicionar ${base}` : `Editar ${base}`;
  }, [modal]);

  // ====== RENDER ======
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Materiais — Admin</h1>
          <p className="text-slate-400 max-w-2xl">
            Aqui você gerencia os conteúdos que os afiliados vão ver: promoções, artes/banners
            e videoaulas. Adicione, edite, ative/desative e copie links.
          </p>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mb-8">
          {/* CTA / KIT */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-blue-100 uppercase tracking-[0.2em]">
                  Gerenciamento
                </p>
                <h2 className="text-3xl font-bold mt-1">Conteúdos do Afiliado</h2>
              </div>
              <span className="bg-white/20 text-xs px-3 py-1 rounded-full">Admin</span>
            </div>

            <p className="text-blue-100 mb-4">
              Cadastre novos materiais e promoções para o afiliado divulgar. Tudo que você
              publicar aqui aparece no painel deles.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openCreate("asset")}
                className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Adicionar asset
              </button>

              <button
                onClick={() => openCreate("video")}
                className="inline-flex items-center gap-2 bg-white/15 text-white px-4 py-3 rounded-lg font-semibold hover:bg-white/25 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Adicionar videoaula
              </button>
            </div>
          </div>

          {/* PROMOS */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <HiOutlineSparkles className="w-5 h-5 text-amber-300" />
                Promoções (Admin)
              </h3>

              <button
                onClick={() => openCreate("promo")}
                className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
              >
                <FiPlus className="w-4 h-4" />
                Adicionar
              </button>
            </div>

            <div className="space-y-3">
              {promos.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-slate-900 rounded-lg p-4 border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">
                      {promo.titulo}{" "}
                      {!promo.ativo ? (
                        <span className="ml-2 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                          Inativa
                        </span>
                      ) : null}
                    </p>

                    <span className="text-xs text-amber-200 bg-amber-500/15 px-2 py-1 rounded-full border border-amber-500/30">
                      {promo.validade}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm">{promo.descricao}</p>
                  <p className="text-green-300 text-sm font-semibold mt-2">{promo.bonus}</p>

                  <div className="flex items-center justify-between mt-3 gap-3">
                    <div className="text-sm text-slate-400 flex items-center gap-2 min-w-0">
                      <FiLink className="w-4 h-4 shrink-0" />
                      <span className="truncate">{promo.link}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleActive("promo", promo.id)}
                        className="text-xs text-slate-300 hover:text-white"
                      >
                        {promo.ativo ? "Desativar" : "Ativar"}
                      </button>

                      <button
                        onClick={() => copyToClipboard(promo.link)}
                        className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
                      >
                        <FiCopy className="w-4 h-4" />
                        Copiar
                      </button>

                      <button
                        onClick={() => openEdit("promo", promo.id)}
                        className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Editar
                      </button>

                      <button
                        onClick={() => removeItem("promo", promo.id)}
                        className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ASSETS */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Artes e banners (Admin)</h3>
            <button
              onClick={() => openCreate("asset")}
              className="text-xs uppercase tracking-[0.2em] text-slate-300 hover:text-white inline-flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Adicionar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">
                    {asset.titulo}{" "}
                    {!asset.ativo ? (
                      <span className="ml-2 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                        Inativo
                      </span>
                    ) : null}
                  </p>
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
                    Link
                  </a>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActive("asset", asset.id)}
                      className="text-xs text-slate-300 hover:text-white"
                    >
                      {asset.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                      onClick={() => copyToClipboard(asset.link)}
                      className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                    >
                      <FiCopy className="w-4 h-4" />
                      Copiar
                    </button>

                    <button
                      onClick={() => openEdit("asset", asset.id)}
                      className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Editar
                    </button>

                    <button
                      onClick={() => removeItem("asset", asset.id)}
                      className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIDEOS */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Videoaulas (Admin)</h3>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <FiClock className="w-4 h-4" />
                Atualize quando quiser
              </div>

              <button
                onClick={() => openCreate("video")}
                className="text-xs uppercase tracking-[0.2em] text-slate-300 hover:text-white inline-flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-white font-semibold">
                    {video.titulo}{" "}
                    {!video.ativo ? (
                      <span className="ml-2 text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                        Inativo
                      </span>
                    ) : null}
                  </p>
                  <span className="text-xs text-slate-400">{video.duracao}</span>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href={video.link}
                    className="inline-flex items-center gap-2 text-sky-300 hover:text-sky-200 text-sm"
                  >
                    <FiPlay className="w-4 h-4" />
                    Link
                  </a>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleActive("video", video.id)}
                      className="text-xs text-slate-300 hover:text-white"
                    >
                      {video.ativo ? "Desativar" : "Ativar"}
                    </button>

                    <button
                      onClick={() => copyToClipboard(video.link)}
                      className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                    >
                      <FiCopy className="w-4 h-4" />
                      Copiar
                    </button>

                    <button
                      onClick={() => openEdit("video", video.id)}
                      className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1"
                    >
                      <FiEdit2 className="w-4 h-4" />
                      Editar
                    </button>

                    <button
                      onClick={() => removeItem("video", video.id)}
                      className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <ModalShell
        open={modal.open}
        title={modalTitle}
        subtitle="Preencha os campos e salve. Depois você integra com a API."
        onClose={closeModal}
      >
        {/* PROMO FORM */}
        {modal.open && modal.type === "promo" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-sm">Título</label>
                <input
                  value={promoForm.titulo}
                  onChange={(e) => setPromoForm((p) => ({ ...p, titulo: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="Ex: Campanha Black"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Validade</label>
                <input
                  value={promoForm.validade}
                  onChange={(e) => setPromoForm((p) => ({ ...p, validade: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="Ex: Válido até 30/11"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm">Descrição</label>
              <textarea
                value={promoForm.descricao}
                onChange={(e) => setPromoForm((p) => ({ ...p, descricao: e.target.value }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500 min-h-[100px]"
                placeholder="Descreva a promoção..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-sm">Bônus</label>
                <input
                  value={promoForm.bonus}
                  onChange={(e) => setPromoForm((p) => ({ ...p, bonus: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="Ex: Comissão +5%"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Link</label>
                <input
                  value={promoForm.link}
                  onChange={(e) => setPromoForm((p) => ({ ...p, link: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={promoForm.ativo}
                onChange={(e) => setPromoForm((p) => ({ ...p, ativo: e.target.checked }))}
              />
              Promo ativa
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={submitModal}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        ) : null}

        {/* ASSET FORM */}
        {modal.open && modal.type === "asset" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-sm">Título</label>
                <input
                  value={assetForm.titulo}
                  onChange={(e) => setAssetForm((a) => ({ ...a, titulo: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="Ex: Kit Social 1080x1080"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Tipo</label>
                <select
                  value={assetForm.tipo}
                  onChange={(e) =>
                    setAssetForm((a) => ({ ...a, tipo: e.target.value as Asset["tipo"] }))
                  }
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                >
                  <option value="Imagens">Imagens</option>
                  <option value="Video">Video</option>
                  <option value="PDF">PDF</option>
                  <option value="Arquivo">Arquivo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-sm">Tamanho</label>
                <input
                  value={assetForm.tamanho}
                  onChange={(e) => setAssetForm((a) => ({ ...a, tamanho: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="Ex: 12 MB"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Link</label>
                <input
                  value={assetForm.link}
                  onChange={(e) => setAssetForm((a) => ({ ...a, link: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm">Tags (separadas por vírgula)</label>
              <input
                value={assetForm.tags.join(", ")}
                onChange={(e) =>
                  setAssetForm((a) => ({
                    ...a,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  }))
                }
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="Instagram, Carrossel, PNG"
              />
            </div>

            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={assetForm.ativo}
                onChange={(e) => setAssetForm((a) => ({ ...a, ativo: e.target.checked }))}
              />
              Asset ativo
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={submitModal}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        ) : null}

        {/* VIDEO FORM */}
        {modal.open && modal.type === "video" ? (
          <div className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm">Título</label>
              <input
                value={videoForm.titulo}
                onChange={(e) => setVideoForm((v) => ({ ...v, titulo: e.target.value }))}
                className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                placeholder="Ex: Como divulgar no Instagram"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-sm">Duração</label>
                <input
                  value={videoForm.duracao}
                  onChange={(e) => setVideoForm((v) => ({ ...v, duracao: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="Ex: 08:12"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Link</label>
                <input
                  value={videoForm.link}
                  onChange={(e) => setVideoForm((v) => ({ ...v, link: e.target.value }))}
                  className="mt-1 w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-slate-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-slate-300 text-sm">
              <input
                type="checkbox"
                checked={videoForm.ativo}
                onChange={(e) => setVideoForm((v) => ({ ...v, ativo: e.target.checked }))}
              />
              Vídeo ativo
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeModal}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FiX className="w-4 h-4" />
                Cancelar
              </button>
              <button
                onClick={submitModal}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                <FiSave className="w-4 h-4" />
                Salvar
              </button>
            </div>
          </div>
        ) : null}
      </ModalShell>
    </section>
  );
}
