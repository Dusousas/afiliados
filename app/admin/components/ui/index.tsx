import { ReactNode } from "react";

type StatusValue =
  | "active"
  | "pending"
  | "blocked"
  | "approved"
  | "paid"
  | "cancelled"
  | "new"
  | "qualified"
  | "proposal"
  | "won"
  | "lost"
  | "draft"
  | "paused"
  | "ended"
  | "inactive"
  | "maintenance";

const statusClassMap: Record<StatusValue, string> = {
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  blocked: "bg-red-500/15 text-red-300 border-red-500/30",
  approved: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  new: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  qualified: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  proposal: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  won: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  lost: "bg-red-500/15 text-red-300 border-red-500/30",
  draft: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  paused: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  ended: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  inactive: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  maintenance: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const statusLabelMap: Record<StatusValue, string> = {
  active: "Ativo",
  pending: "Pendente",
  blocked: "Bloqueado",
  approved: "Aprovada",
  paid: "Paga",
  cancelled: "Cancelada",
  new: "Novo",
  qualified: "Qualificado",
  proposal: "Proposta",
  won: "Convertido",
  lost: "Perdido",
  draft: "Rascunho",
  paused: "Pausada",
  ended: "Encerrada",
  inactive: "Inativo",
  maintenance: "Manutencao",
};

export function StatusBadge({ status }: { status: StatusValue }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClassMap[status]}`}
    >
      {statusLabelMap[status]}
    </span>
  );
}

export function CardStat({
  label,
  value,
  icon,
  helper,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="text-sky-300">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

export function SectionTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/70 p-6 text-center text-sm text-slate-400">
      {message}
    </div>
  );
}

export function LoadingCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-xl border border-slate-700 bg-slate-800"
        />
      ))}
    </div>
  );
}
