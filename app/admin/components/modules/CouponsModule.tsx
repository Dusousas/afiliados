"use client";

import { useState } from "react";
import { FiLink, FiPlus } from "react-icons/fi";
import { Affiliate, CouponLink } from "@/types/admin";
import { EmptyState, SectionTitle, StatusBadge } from "../ui";
import { formatDate } from "./formatters";

type Props = {
  coupons: CouponLink[];
  affiliates: Affiliate[];
  onCreateCoupon: (payload: Omit<CouponLink, "id" | "createdAt">) => Promise<void>;
  onUpdateCoupon: (id: string, payload: Partial<Omit<CouponLink, "id" | "createdAt">>) => Promise<void>;
  onToggleCouponStatus: (id: string) => Promise<void>;
};

export default function CouponsModule({
  coupons,
  affiliates,
  onCreateCoupon,
  onUpdateCoupon,
  onToggleCouponStatus,
}: Props) {
  const [form, setForm] = useState({
    code: "",
    link: "",
    status: "active" as CouponLink["status"],
    affiliateId: "",
    discountPercent: "10",
    commissionPercent: "20",
    expiresAt: "",
  });
  const [saving, setSaving] = useState(false);

  const saveCoupon = async () => {
    if (!form.code || !form.link) return;
    setSaving(true);
    const affiliate = affiliates.find((item) => item.id === form.affiliateId);

    await onCreateCoupon({
      code: form.code.toUpperCase().replace(/\s+/g, ""),
      link: form.link,
      status: form.status,
      affiliateId: affiliate?.id,
      affiliateName: affiliate?.name,
      discountPercent: Number(form.discountPercent) || 0,
      commissionPercent: Number(form.commissionPercent) || 0,
      expiresAt: form.expiresAt || undefined,
    });

    setForm({
      code: "",
      link: "",
      status: "active",
      affiliateId: "",
      discountPercent: "10",
      commissionPercent: "20",
      expiresAt: "",
    });
    setSaving(false);
  };

  return (
    <section className="space-y-6">
      <SectionTitle
        title="Cupons e Links de Indicacao"
        description="Crie codigos, associe afiliados e ative/desative rapidamente"
      />

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-lg font-semibold text-white">Novo cupom/link</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={form.code}
            onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value }))}
            placeholder="Codigo"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
          <input
            value={form.link}
            onChange={(event) => setForm((prev) => ({ ...prev, link: event.target.value }))}
            placeholder="URL do link"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
          <select
            value={form.affiliateId}
            onChange={(event) => setForm((prev) => ({ ...prev, affiliateId: event.target.value }))}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="">Sem afiliado especifico</option>
            {affiliates.map((affiliate) => (
              <option key={affiliate.id} value={affiliate.id}>
                {affiliate.name}
              </option>
            ))}
          </select>
          <select
            value={form.status}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, status: event.target.value as CouponLink["status"] }))
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          >
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
          <input
            value={form.discountPercent}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, discountPercent: event.target.value }))
            }
            placeholder="Desconto %"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
          <input
            value={form.commissionPercent}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, commissionPercent: event.target.value }))
            }
            placeholder="Comissao %"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
          <input
            type="date"
            value={form.expiresAt}
            onChange={(event) => setForm((prev) => ({ ...prev, expiresAt: event.target.value }))}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-sky-500"
          />
        </div>

        <button
          onClick={saveCoupon}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiPlus className="h-4 w-4" />
          {saving ? "Salvando..." : "Criar cupom"}
        </button>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-lg font-semibold text-white">Lista de cupons e links</h3>

        {coupons.length === 0 ? (
          <EmptyState message="Nenhum cupom cadastrado." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-3 pr-3">Codigo</th>
                  <th className="pb-3 pr-3">Link</th>
                  <th className="pb-3 pr-3">Afiliado</th>
                  <th className="pb-3 pr-3">Comissao / Desconto</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="text-slate-200">
                    <td className="py-3 pr-3 font-semibold text-white">
                      {coupon.code}
                      <p className="text-xs text-slate-500">Criado em {formatDate(coupon.createdAt)}</p>
                    </td>
                    <td className="max-w-xs truncate py-3 pr-3 text-slate-300">{coupon.link}</td>
                    <td className="py-3 pr-3">{coupon.affiliateName ?? "Nao associado"}</td>
                    <td className="py-3 pr-3">
                      {coupon.commissionPercent}% / {coupon.discountPercent}%
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge status={coupon.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onToggleCouponStatus(coupon.id)}
                          className="rounded-lg border border-slate-600 px-2 py-1 text-xs text-sky-300 hover:bg-slate-700"
                        >
                          {coupon.status === "active" ? "Desativar" : "Ativar"}
                        </button>
                        <select
                          value={coupon.affiliateId ?? ""}
                          onChange={(event) => {
                            const affiliate = affiliates.find((item) => item.id === event.target.value);
                            onUpdateCoupon(coupon.id, {
                              affiliateId: affiliate?.id,
                              affiliateName: affiliate?.name,
                            });
                          }}
                          className="rounded-lg border border-slate-600 bg-slate-900 px-2 py-1 text-xs text-slate-200 outline-none"
                        >
                          <option value="">Nao associado</option>
                          {affiliates.map((affiliate) => (
                            <option key={affiliate.id} value={affiliate.id}>
                              {affiliate.name}
                            </option>
                          ))}
                        </select>
                        <a
                          href={coupon.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-600 px-2 py-1 text-xs text-emerald-300 hover:bg-slate-700"
                        >
                          <FiLink className="h-3.5 w-3.5" />
                          Abrir
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
