"use client";

import React from "react";
import { FiCheck, FiClock, FiCpu, FiLogOut, FiMapPin } from "react-icons/fi";

type Session = {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  status: "current" | "recent";
};

const sessions: Session[] = [
  {
    id: "current",
    device: "MacBook Pro · Chrome",
    location: "Sao Paulo, BR",
    lastSeen: "Ativo agora",
    status: "current",
  },
  {
    id: "mobile",
    device: "iPhone 14 · Safari",
    location: "Sao Paulo, BR",
    lastSeen: "Ha 2 horas",
    status: "recent",
  },
  {
    id: "office",
    device: "Windows · Edge",
    location: "Campinas, BR",
    lastSeen: "Ontem",
    status: "recent",
  },
];

export default function SecuritySessions() {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur h-full">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
            Seguranca
          </p>
          <h3 className="text-2xl font-semibold text-white mt-1">
            Dispositivos e sessoes
          </h3>
          <p className="text-sm text-slate-400">
            Controle quem esta logado e encerre acessos suspeitos.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <FiCheck />
          <span>2FA via email habilitado</span>
        </div>
      </div>

      <div className="space-y-3">
        {sessions.map(({ id, device, location, lastSeen, status }) => (
          <div
            key={id}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/60"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
              <FiCpu />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{device}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <FiMapPin />
                  {location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiClock />
                  {lastSeen}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status === "current" ? (
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  Sessao atual
                </span>
              ) : (
                <button className="text-sm text-red-300 hover:text-red-200 inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition">
                  <FiLogOut />
                  Sair
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
