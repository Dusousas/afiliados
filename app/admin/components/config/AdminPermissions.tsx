"use client";

import React, { useState } from "react";
import { FiUsers, FiPlus, FiTrash2, FiCheckCircle } from "react-icons/fi";

type Role = {
  id: string;
  name: string;
  permissions: {
    manageAffiliates: boolean;
    manageLeads: boolean;
    managePayouts: boolean;
    managePrizes: boolean;
    manageSettings: boolean;
  };
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function AdminPermissions() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "r1",
      name: "Admin Master",
      permissions: {
        manageAffiliates: true,
        manageLeads: true,
        managePayouts: true,
        managePrizes: true,
        manageSettings: true,
      },
    },
    {
      id: "r2",
      name: "Suporte",
      permissions: {
        manageAffiliates: true,
        manageLeads: true,
        managePayouts: false,
        managePrizes: true,
        manageSettings: false,
      },
    },
  ]);

  const addRole = () => {
    setRoles((prev) => [
      ...prev,
      {
        id: uid(),
        name: `Novo role ${prev.length + 1}`,
        permissions: {
          manageAffiliates: false,
          manageLeads: false,
          managePayouts: false,
          managePrizes: false,
          manageSettings: false,
        },
      },
    ]);
  };

  const removeRole = (id: string) => setRoles((prev) => prev.filter((r) => r.id !== id));

  const toggle = (roleId: string, key: keyof Role["permissions"]) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? { ...r, permissions: { ...r.permissions, [key]: !r.permissions[key] } }
          : r
      )
    );
  };

  const permLabel: Record<keyof Role["permissions"], string> = {
    manageAffiliates: "Afiliados",
    manageLeads: "Leads",
    managePayouts: "Pagamentos",
    managePrizes: "Prêmios",
    manageSettings: "Config do sistema",
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <FiUsers className="w-5 h-5 text-sky-400" />
          Roles e Permissões
        </h3>

        <button
          onClick={addRole}
          className="inline-flex items-center gap-2 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Criar role
        </button>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <div key={role.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-semibold">{role.name}</p>
                <p className="text-slate-500 text-xs mt-1">
                  Controle de acesso por módulo (mock).
                </p>
              </div>
              <button
                onClick={() => removeRole(role.id)}
                className="text-xs text-red-300 hover:text-red-200 inline-flex items-center gap-1"
              >
                <FiTrash2 className="w-4 h-4" />
                Remover
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {(Object.keys(role.permissions) as (keyof Role["permissions"])[]).map((k) => (
                <button
                  key={k}
                  onClick={() => toggle(role.id, k)}
                  className={`text-left rounded-lg px-3 py-2 border transition-colors ${
                    role.permissions[k]
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200 text-sm">{permLabel[k]}</span>
                    {role.permissions[k] ? (
                      <FiCheckCircle className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <span className="text-xs text-slate-400">off</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-slate-500 text-xs mt-4">
        Depois você liga isso na API: roles, permissions e guards por rota.
      </p>
    </div>
  );
}
