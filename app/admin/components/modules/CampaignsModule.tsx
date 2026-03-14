"use client";

import { useMemo, useState } from "react";
import { FiPlus, FiUpload } from "react-icons/fi";
import { Campaign, CampaignMaterial, CampaignStatus, MaterialType } from "@/types/admin";
import { EmptyState, SectionTitle, StatusBadge } from "../ui";
import { formatDate } from "./formatters";

type Props = {
  campaigns: Campaign[];
  materials: CampaignMaterial[];
  onCreateCampaign: (payload: Omit<Campaign, "id" | "createdAt">) => Promise<void>;
  onUpdateCampaign: (id: string, payload: Partial<Omit<Campaign, "id" | "createdAt">>) => Promise<void>;
  onCreateMaterial: (payload: Omit<CampaignMaterial, "id" | "createdAt">) => Promise<void>;
  onToggleMaterialPublish: (id: string) => Promise<void>;
};

export default function CampaignsModule({
  campaigns,
  materials,
  onCreateCampaign,
  onUpdateCampaign,
  onCreateMaterial,
  onToggleMaterialPublish,
}: Props) {
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    description: "",
    status: "draft" as CampaignStatus,
    startDate: "",
    endDate: "",
  });
  const [materialForm, setMaterialForm] = useState({
    campaignId: "",
    title: "",
    type: "banner" as MaterialType,
    description: "",
    url: "",
    fileName: "",
    isPublished: true,
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [savingMaterial, setSavingMaterial] = useState(false);

  const filteredMaterials = useMemo(() => {
    if (selectedCampaign === "all") return materials;
    return materials.filter((material) => material.campaignId === selectedCampaign);
  }, [materials, selectedCampaign]);

  const saveCampaign = async () => {
    if (!campaignForm.name || !campaignForm.startDate || !campaignForm.endDate) return;
    setSavingCampaign(true);
    await onCreateCampaign(campaignForm);
    setCampaignForm({
      name: "",
      description: "",
      status: "draft",
      startDate: "",
      endDate: "",
    });
    setSavingCampaign(false);
  };

  const saveMaterial = async () => {
    if (!materialForm.title || !materialForm.url || !materialForm.campaignId) return;
    setSavingMaterial(true);
    await onCreateMaterial({
      ...materialForm,
      fileName: materialForm.fileName || undefined,
    });
    setMaterialForm({
      campaignId: "",
      title: "",
      type: "banner",
      description: "",
      url: "",
      fileName: "",
      isPublished: true,
    });
    setSavingMaterial(false);
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Campanhas e Materiais"
        description="Crie campanhas promocionais e publique materiais que aparecem no Dashboard"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Nova campanha</h3>
          <div className="space-y-3">
            <input
              value={campaignForm.name}
              onChange={(event) => setCampaignForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nome da campanha"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
            />
            <textarea
              value={campaignForm.description}
              onChange={(event) =>
                setCampaignForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={3}
              placeholder="Descricao"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <select
                value={campaignForm.status}
                onChange={(event) =>
                  setCampaignForm((prev) => ({
                    ...prev,
                    status: event.target.value as CampaignStatus,
                  }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              >
                <option value="draft">Rascunho</option>
                <option value="active">Ativa</option>
                <option value="paused">Pausada</option>
                <option value="ended">Encerrada</option>
              </select>
              <input
                type="date"
                value={campaignForm.startDate}
                onChange={(event) =>
                  setCampaignForm((prev) => ({ ...prev, startDate: event.target.value }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
              <input
                type="date"
                value={campaignForm.endDate}
                onChange={(event) =>
                  setCampaignForm((prev) => ({ ...prev, endDate: event.target.value }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>

            <button
              onClick={saveCampaign}
              disabled={savingCampaign}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiPlus className="h-4 w-4" />
              {savingCampaign ? "Criando..." : "Criar campanha"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Novo material</h3>
          <div className="space-y-3">
            <select
              value={materialForm.campaignId}
              onChange={(event) =>
                setMaterialForm((prev) => ({ ...prev, campaignId: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
            >
              <option value="">Selecionar campanha</option>
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
            <input
              value={materialForm.title}
              onChange={(event) => setMaterialForm((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Titulo do material"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
            />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <select
                value={materialForm.type}
                onChange={(event) =>
                  setMaterialForm((prev) => ({
                    ...prev,
                    type: event.target.value as MaterialType,
                  }))
                }
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              >
                <option value="banner">Banner</option>
                <option value="link">Link</option>
                <option value="copy">Copy</option>
                <option value="file">Arquivo</option>
                <option value="image">Imagem</option>
              </select>
              <input
                value={materialForm.fileName}
                onChange={(event) =>
                  setMaterialForm((prev) => ({ ...prev, fileName: event.target.value }))
                }
                placeholder="Nome do arquivo (opcional)"
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              />
            </div>
            <input
              value={materialForm.url}
              onChange={(event) => setMaterialForm((prev) => ({ ...prev, url: event.target.value }))}
              placeholder="URL do material"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
            />
            <textarea
              value={materialForm.description}
              onChange={(event) =>
                setMaterialForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={2}
              placeholder="Descricao"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={materialForm.isPublished}
                onChange={(event) =>
                  setMaterialForm((prev) => ({ ...prev, isPublished: event.target.checked }))
                }
              />
              Publicar material
            </label>

            <button
              onClick={saveMaterial}
              disabled={savingMaterial}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiUpload className="h-4 w-4" />
              {savingMaterial ? "Salvando..." : "Cadastrar material"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-white">Campanhas cadastradas</h3>
          <span className="text-xs text-slate-400">{campaigns.length} campanhas</span>
        </div>

        {campaigns.length === 0 ? (
          <EmptyState message="Nenhuma campanha cadastrada." />
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-semibold text-white">{campaign.name}</p>
                  <StatusBadge status={campaign.status} />
                </div>
                <p className="text-sm text-slate-300">{campaign.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(campaign.startDate)} ate {formatDate(campaign.endDate)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["draft", "active", "paused", "ended"] as CampaignStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => onUpdateCampaign(campaign.id, { status })}
                      className="rounded-lg border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-lg font-semibold text-white">Materiais promocionais</h3>
          <select
            value={selectedCampaign}
            onChange={(event) => setSelectedCampaign(event.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="all">Todas as campanhas</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        {filteredMaterials.length === 0 ? (
          <EmptyState message="Nenhum material para esta campanha." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">Titulo</th>
                  <th className="pb-3 pr-3">Campanha</th>
                  <th className="pb-3 pr-3">Tipo</th>
                  <th className="pb-3 pr-3">URL</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredMaterials.map((material) => {
                  const campaign = campaigns.find((item) => item.id === material.campaignId);
                  return (
                    <tr key={material.id} className="text-slate-200">
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-white">{material.title}</p>
                        <p className="text-xs text-slate-400">{formatDate(material.createdAt)}</p>
                      </td>
                      <td className="py-3 pr-3">{campaign?.name ?? "-"}</td>
                      <td className="py-3 pr-3">{material.type}</td>
                      <td className="max-w-xs truncate py-3 pr-3 text-slate-400">{material.url}</td>
                      <td className="py-3 pr-3">
                        {material.isPublished ? (
                          <StatusBadge status="active" />
                        ) : (
                          <StatusBadge status="inactive" />
                        )}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => onToggleMaterialPublish(material.id)}
                          className="rounded-lg border border-slate-600 px-2 py-1 text-xs text-sky-300 hover:bg-slate-700"
                        >
                          {material.isPublished ? "Despublicar" : "Publicar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
