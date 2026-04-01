"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import HomeDashboard from "./components/HomeDashboard";
import Cupon from "./components/Cupon";
import Indicacoes from "./components/Indicacoes";
import Material from "./components/Material";
import Premios from "./components/Premios";
import Config from "./components/configdash/Config";
import Notificacoes from "./components/Notificacoes";
import { AuthUser } from "@/types/auth";
import { authClient } from "@/services/clientApi";

type SectionId =
  | "dashboard"
  | "cupom"
  | "indicacoes"
  | "materiais"
  | "premios"
  | "config"
  | "notificacoes";

type Props = {
  currentUser: AuthUser;
};

export default function DashboardPageClient({ currentUser }: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.logout();
    router.push("/login");
    router.refresh();
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <HomeDashboard />;
      case "cupom":
        return <Cupon />;
      case "indicacoes":
        return <Indicacoes />;
      case "materiais":
        return <Material />;
      case "premios":
        return <Premios />;
      case "config":
        return <Config />;
      case "notificacoes":
        return <Notificacoes />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-Darkgray">
      <Sidebar
        active={activeSection}
        onChange={(id) => setActiveSection(id as SectionId)}
        onLogout={handleLogout}
        userName={currentUser.name}
        userEmail={currentUser.email}
      />

      <main className="flex-1 lg:p-6">{renderSection()}</main>
    </div>
  );
}
