"use client";

import { IconType } from "react-icons";
import {
  FiHome,
  FiTag,
  FiUserPlus,
  FiBookOpen,
  FiStar,
  FiSettings,
  FiLogOut,
  FiInbox,
} from "react-icons/fi";

type SidebarProps = {
  className?: string;
  onLogout?: () => void;
  active: string; // seção ativa
  onChange: (id: string) => void; // troca de seção
};

type NavItem = {
  label: string;
  id: string;
  icon: IconType;
};

const navItems: NavItem[] = [
  { label: "Dashboard", id: "dashboard", icon: FiHome },
  { label: "Meu Cupom", id: "cupom", icon: FiTag },
  { label: "Minhas Indicações", id: "indicacoes", icon: FiUserPlus },
  { label: "Materiais Youon", id: "materiais", icon: FiBookOpen },
  { label: "Prêmios", id: "premios", icon: FiStar },
  { label: "Configurações", id: "config", icon: FiSettings },
  { label: "Notificações", id: "notificacoes", icon: FiInbox },
];

export default function Sidebar({
  className = "",
  onLogout,
  active,
  onChange,
}: SidebarProps) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout clicado");
      // depois você coloca a lógica real de logout
    }
  };

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`
          hidden lg:flex
          w-80 pt-6 bg-slate-900 text-slate-100 border-r border-slate-800
          flex-col
          ${className}
        `}
      >
        {/* Topo: logo / nome do painel */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-BlueP">
              YOU ON
            </p>
            <p className="text-sm font-semibold uppercase">
              Painel do Afiliado
            </p>
          </div>
        </div>

        {/* Área do usuário */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold">
            SN
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium uppercase">Seu nome</span>
            <span className="text-xs text-slate-400">seuemail@gmail.com</span>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;

            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  text-left transition-colors
                  ${
                    isActive
                      ? "bg-slate-800 text-sky-400"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-sky-300"
                  }
                `}
              >
                <Icon className="text-lg" />
                <span className="cursor-pointer">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Botão de sair */}
        <div className="px-3 pb-4 pt-2 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              text-red-400 hover:text-red-300 hover:bg-red-500/10
              transition-colors
            "
          >
            <FiLogOut className="text-lg" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* MENU INFERIOR MOBILE: APENAS ÍCONES, SCROLL SÓ NA BARRA */}
      <nav
        className="
          lg:hidden
          fixed bottom-0 inset-x-0
          bg-slate-900/95 border-t border-slate-800
          z-50
          overflow-hidden
        "
      >
        <div
          className="
            flex items-center gap-2
            overflow-x-auto
            px-3 py-2
            w-full
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                aria-label={label}
                className={`
                  flex-none
                  w-12 h-12
                  rounded-full
                  flex items-center justify-center
                  ${
                    isActive
                      ? "text-sky-400 bg-slate-800"
                      : "text-slate-300"
                  }
                `}
              >
                <Icon className="text-xl" />
              </button>
            );
          })}

          {/* Logout como ícone na barra */}
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="
              flex-none
              w-12 h-12
              rounded-full
              flex items-center justify-center
              text-red-400
            "
          >
            <FiLogOut className="text-xl" />
          </button>
        </div>
      </nav>
    </>
  );
}
