"use client";

import React, { useState } from "react";
import { FiShield, FiTrash2, FiKey } from "react-icons/fi";

type Session = {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
};

export default function AdminSecuritySessions() {
  const [twoFA, setTwoFA] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([
    { id: "s1", device: "Chrome • Windows", location: "Brasil", lastActive: "Agora", current: true },
    { id: "s2", device: "Safari • iPhone", location: "Brasil", lastActive: "Ontem 22:14" },
    { id: "s3", device: "Chrome • Mac", location: "Portugal", lastActive: "Há 7 dias" },
  ]);

  const revoke = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <FiShield className="w-5 h-5 text-emerald-400" />
        Segurança e Sessões
      </h3>

      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-white font-semibold">2FA (autenticação em 2 etapas)</p>
          <p className="text-slate-400 text-sm">
            Recomendado para contas Admin. Pode ser via e-mail (simples) ou app (depois).
          </p>
        </div>
        <button
          onClick={() => setTwoFA((p) => !p)}
          className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
            twoFA
              ? "bg-emerald-500/15 text-emerald-200 border-emerald-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
          }`}
        >
          {twoFA ? "Ativo" : "Inativo"}
        </button>
      </div>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-start justify-between gap-4"
          >
            <div>
              <p className="text-white font-semibold">
                {s.device}{" "}
                {s.current ? (
                  <span className="text-xs ml-2 px-2 py-1 rounded-full bg-sky-500/15 text-sky-200 border border-sky-500/30">
                    atual
                  </span>
                ) : null}
              </p>
              <p className="text-slate-400 text-sm">{s.location}</p>
              <p className="text-slate-500 text-xs mt-1">Última atividade: {s.lastActive}</p>
            </div>

            {!s.current ? (
              <button
                onClick={() => revoke(s.id)}
                className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
              >
                <FiTrash2 className="w-4 h-4" />
                Encerrar
              </button>
            ) : (
              <div className="text-xs text-slate-400 inline-flex items-center gap-1">
                <FiKey className="w-4 h-4" />
                Sessão segura
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-xs mt-4">
        Depois você liga isso na API: listar sessions, revogar, ativar/desativar 2FA.
      </p>
    </div>
  );
}
