"use client";

import { AdminSectionId } from "./navigation";

const sectionMeta: Record<AdminSectionId, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard Admin",
    subtitle: "Resumo geral do programa de afiliados",
  },
  affiliates: {
    title: "Gestao de Afiliados",
    subtitle: "Controle de status, perfil e performance dos afiliados",
  },
  commissions: {
    title: "Gestao de Comissoes",
    subtitle: "Aprovacao, pagamento e historico de comissoes",
  },
  leads: {
    title: "Gestao de Leads",
    subtitle: "Funil de indicacoes com origem, potencial e responsavel",
  },
  campaigns: {
    title: "Campanhas e Materiais",
    subtitle: "Conteudos promocionais publicados para o Dashboard",
  },
  coupons: {
    title: "Cupons e Links",
    subtitle: "Criacao de codigos, links e associacao a afiliados",
  },
  settings: {
    title: "Configuracoes da Plataforma",
    subtitle: "Regras gerais, status do programa e textos institucionais",
  },
  reports: {
    title: "Ranking e Relatorios",
    subtitle: "Performance, ganhos e conversoes por afiliado",
  },
};

export default function AdminHeader({
  section,
  note,
}: {
  section: AdminSectionId;
  note?: string;
}) {
  const meta = sectionMeta[section];

  return (
    <header className="mb-6 rounded-2xl border border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 p-5 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Area Administrativa</p>
          <h1 className="text-2xl font-bold">{meta.title}</h1>
          <p className="text-sm text-slate-300">{meta.subtitle}</p>
        </div>
        <div className="rounded-full border border-slate-600 bg-slate-900/40 px-4 py-2 text-xs text-slate-300">
          {note ?? "Dados sincronizados com o banco"}
        </div>
      </div>
    </header>
  );
}
