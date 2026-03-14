"use client";

import { FiLogOut } from "react-icons/fi";
import { AdminSectionId, adminNavItems } from "./navigation";

type Props = {
  active: AdminSectionId;
  onChange: (section: AdminSectionId) => void;
};

export default function AdminSidebar({ active, onChange }: Props) {
  return (
    <>
      <aside className="hidden w-80 flex-col border-r border-slate-800 bg-slate-900 pt-6 text-slate-100 lg:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-BlueP">YOU ON</p>
            <p className="text-sm font-semibold uppercase">Painel Admin</p>
          </div>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-semibold">
            AD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase">Admin Master</span>
            <span className="text-xs text-slate-400">admin@youon.com</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {adminNavItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-slate-800 text-sky-400"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-sky-300"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="text-lg" />
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 px-3 pb-4 pt-2">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300">
            <FiLogOut className="text-lg" />
            Sair
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-900/95 lg:hidden">
        <div className="flex w-full items-center gap-2 overflow-x-auto px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adminNavItems.map(({ id, label, icon: Icon }) => {
            const isActive = id === active;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-label={label}
                className={`flex h-12 w-12 flex-none items-center justify-center rounded-full ${
                  isActive ? "bg-slate-800 text-sky-400" : "text-slate-300"
                }`}
              >
                <Icon className="text-xl" />
              </button>
            );
          })}
          <button
            aria-label="Sair"
            className="flex h-12 w-12 flex-none items-center justify-center rounded-full text-red-400"
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </nav>
    </>
  );
}
