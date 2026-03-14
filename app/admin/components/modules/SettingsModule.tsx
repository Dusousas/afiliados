"use client";

import { useState } from "react";
import { FiSave } from "react-icons/fi";
import { PlatformSettings, ProgramStatus } from "@/types/admin";
import { SectionTitle, StatusBadge } from "../ui";

type Props = {
  settings: PlatformSettings;
  onUpdateSettings: (payload: Partial<PlatformSettings>) => Promise<void>;
};

export default function SettingsModule({ settings, onUpdateSettings }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    defaultCommissionPercent: String(settings.defaultCommissionPercent),
    minPayoutAmount: String(settings.minPayoutAmount),
    programStatus: settings.programStatus,
    dashboardWelcome: settings.institutionalTexts.dashboardWelcome,
    payoutPolicy: settings.institutionalTexts.payoutPolicy,
    supportMessage: settings.institutionalTexts.supportMessage,
    rules: settings.rules.join("\n"),
    primaryColor: settings.visual.primaryColor,
    secondaryColor: settings.visual.secondaryColor,
  });

  const saveSettings = async () => {
    setSaving(true);
    await onUpdateSettings({
      defaultCommissionPercent: Number(form.defaultCommissionPercent) || 0,
      minPayoutAmount: Number(form.minPayoutAmount) || 0,
      programStatus: form.programStatus,
      rules: form.rules
        .split("\n")
        .map((rule) => rule.trim())
        .filter(Boolean),
      institutionalTexts: {
        dashboardWelcome: form.dashboardWelcome,
        payoutPolicy: form.payoutPolicy,
        supportMessage: form.supportMessage,
      },
      visual: {
        primaryColor: form.primaryColor,
        secondaryColor: form.secondaryColor,
      },
    });
    setSaving(false);
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Configuracoes Gerais"
        description="Comissao padrao, regras, status do programa e textos da plataforma"
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Parametros principais</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <LabeledField
              label="Comissao padrao (%)"
              value={form.defaultCommissionPercent}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, defaultCommissionPercent: value }))
              }
            />
            <LabeledField
              label="Payout minimo (R$)"
              value={form.minPayoutAmount}
              onChange={(value) => setForm((prev) => ({ ...prev, minPayoutAmount: value }))}
            />
            <div className="md:col-span-2">
              <label className="text-xs text-slate-400">Status do programa</label>
              <select
                value={form.programStatus}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    programStatus: event.target.value as ProgramStatus,
                  }))
                }
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
              >
                <option value="active">Ativo</option>
                <option value="paused">Pausado</option>
                <option value="maintenance">Manutencao</option>
              </select>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900 p-3">
            <p className="mb-2 text-xs text-slate-400">Status atual da plataforma</p>
            <StatusBadge status={form.programStatus} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-3 text-lg font-semibold text-white">Visual simples</h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <LabeledField
              label="Cor primaria"
              value={form.primaryColor}
              onChange={(value) => setForm((prev) => ({ ...prev, primaryColor: value }))}
            />
            <LabeledField
              label="Cor secundaria"
              value={form.secondaryColor}
              onChange={(value) => setForm((prev) => ({ ...prev, secondaryColor: value }))}
            />
          </div>

          <div
            className="mt-4 rounded-xl border border-slate-700 p-4"
            style={{
              background: `linear-gradient(120deg, ${form.secondaryColor}, ${form.primaryColor})`,
            }}
          >
            <p className="text-sm font-semibold text-white">Preview visual do programa</p>
            <p className="text-xs text-white/80">
              Este bloco simula configuracao de identidade visual para o dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-lg font-semibold text-white">Regras e textos institucionais</h3>
        <div className="space-y-3">
          <TextAreaField
            label="Texto de boas-vindas"
            value={form.dashboardWelcome}
            onChange={(value) => setForm((prev) => ({ ...prev, dashboardWelcome: value }))}
            rows={2}
          />
          <TextAreaField
            label="Politica de pagamento"
            value={form.payoutPolicy}
            onChange={(value) => setForm((prev) => ({ ...prev, payoutPolicy: value }))}
            rows={2}
          />
          <TextAreaField
            label="Mensagem de suporte"
            value={form.supportMessage}
            onChange={(value) => setForm((prev) => ({ ...prev, supportMessage: value }))}
            rows={2}
          />
          <TextAreaField
            label="Regras do programa (uma por linha)"
            value={form.rules}
            onChange={(value) => setForm((prev) => ({ ...prev, rules: value }))}
            rows={5}
          />
        </div>

        <button
          onClick={saveSettings}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiSave className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar configuracoes"}
        </button>
      </div>
    </section>
  );
}

function LabeledField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-slate-400">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <div>
      <label className="text-xs text-slate-400">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
      />
    </div>
  );
}
