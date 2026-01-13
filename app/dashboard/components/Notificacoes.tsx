"use client";

import React, { useMemo, useState } from "react";
import {
  FiAward,
  FiBell,
  FiGift,
  FiInfo,
  FiMail,
  FiShield,
  FiTag,
  FiZap,
} from "react-icons/fi";

type NotificationType = "promo" | "premio" | "sistema" | "suporte";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  badge?: string;
};

const initialNotifications: Notification[] = [
  {
    id: "n1",
    title: "Parabens! Premio enviado",
    message:
      "Seu resgate do fone JBL foi aprovado e sera enviado em ate 3 dias uteis.",
    time: "Ha 15 min",
    type: "premio",
    read: false,
    badge: "Novo",
  },
  {
    id: "n2",
    title: "Campanha relampago do fim de semana",
    message:
      "Comissao aumentada para 25% em vendas feitas ate domingo 23h59. Aproveite!",
    time: "Ha 1 hora",
    type: "promo",
    read: false,
    badge: "Urgente",
  },
  {
    id: "n3",
    title: "Material novo liberado",
    message:
      "Baixe o kit de artes para stories e reels com CTA direto para o seu cupom.",
    time: "Ha 4 horas",
    type: "promo",
    read: true,
  },
  {
    id: "n4",
    title: "Validamos 3 novas vendas",
    message:
      "Suas vendas do dia foram validadas e somaram R$ 420,00 em comissao.",
    time: "Ontem",
    type: "sistema",
    read: true,
  },
  {
    id: "n5",
    title: "Suporte respondeu seu ticket",
    message:
      "Atualizamos o status do chamado #2831 sobre o prazo de pagamento.",
    time: "Ontem",
    type: "suporte",
    read: false,
  },
  {
    id: "n6",
    title: "Aviso de seguranca",
    message:
      "Novo login detectado em Sao Paulo - Chrome. Se nao foi voce, troque a senha.",
    time: "2 dias atras",
    type: "sistema",
    read: true,
  },
];

const categoryFilters: { id: "todas" | NotificationType; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "promo", label: "Promocoes" },
  { id: "premio", label: "Premios" },
  { id: "sistema", label: "Sistema" },
  { id: "suporte", label: "Suporte" },
];

const typeIcon: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  promo: FiZap,
  premio: FiAward,
  sistema: FiShield,
  suporte: FiInfo,
};

const typeColor: Record<NotificationType, string> = {
  promo: "text-amber-300",
  premio: "text-emerald-300",
  sistema: "text-sky-300",
  suporte: "text-indigo-300",
};

export default function Notificacoes() {
  const [filter, setFilter] = useState<"todas" | NotificationType>("todas");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications
  );

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesType = filter === "todas" ? true : n.type === filter;
      const matchesRead = unreadOnly ? !n.read : true;
      return matchesType && matchesRead;
    });
  }, [filter, unreadOnly, notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const archive = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const badgeColor = (badge?: string) => {
    if (!badge) return "bg-slate-800 text-slate-200 border-slate-700";
    if (badge.toLowerCase() === "urgente")
      return "bg-red-500/10 text-red-200 border-red-500/30";
    if (badge.toLowerCase() === "novo")
      return "bg-emerald-500/10 text-emerald-200 border-emerald-500/30";
    return "bg-slate-800 text-slate-200 border-slate-700";
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-6 border border-slate-700 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-sky-500/20 text-sky-200 flex items-center justify-center">
                <FiMail className="text-2xl" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-sky-300">
                  Caixa de entrada
                </p>
                <h1 className="text-3xl font-bold text-white">
                  Notificacoes do painel
                </h1>
                <p className="text-sm text-slate-300">
                  Promocoes, premios, avisos de seguranca e respostas de
                  suporte em um lugar so.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-700 text-slate-200 text-sm">
                <FiBell className="text-amber-300" />
                <span>{unreadCount} nao lidas</span>
              </div>
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 text-sm rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold transition"
              >
                Marcar todas como lidas
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {categoryFilters.map(({ id, label }) => {
            const active = filter === id;
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-4 py-2 rounded-lg border text-sm transition ${
                  active
                    ? "border-sky-500 bg-sky-500/10 text-sky-200"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
                }`}
              >
                {label}
              </button>
            );
          })}

          <button
            onClick={() => setUnreadOnly((prev) => !prev)}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition ${
              unreadOnly
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-200"
                : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                unreadOnly ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            Apenas nao lidas
          </button>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => {
            const Icon = typeIcon[item.type];
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border bg-slate-900/80 flex gap-4 transition ${
                  item.read
                    ? "border-slate-800"
                    : "border-sky-600/40 ring-1 ring-sky-900/40"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center ${typeColor[item.type]}`}
                  >
                    <Icon />
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-white font-semibold">{item.title}</p>
                    {item.badge && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${badgeColor(
                          item.badge
                        )}`}
                      >
                        <FiTag />
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300">{item.message}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="inline-flex items-center gap-1">
                      <FiMail />
                      {item.time}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 ${typeColor[item.type]}`}
                    >
                      <FiInfo />
                      {item.type === "promo" && "Promocao"}
                      {item.type === "premio" && "Premio"}
                      {item.type === "sistema" && "Sistema"}
                      {item.type === "suporte" && "Suporte"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {!item.read && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-sm text-sky-300 hover:text-sky-200 px-3 py-2 rounded-lg hover:bg-sky-500/10 transition"
                    >
                      Marcar como lida
                    </button>
                  )}
                  <button
                    onClick={() => archive(item.id)}
                    className="text-sm text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                  >
                    Arquivar
                  </button>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-6 text-center border border-slate-800 bg-slate-900/70 rounded-xl text-slate-300">
              Nenhuma notificacao para esse filtro.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
