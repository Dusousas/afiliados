"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomeDashboard from "./components/HomeDashboard";
import Cupon from "./components/Cupon";
import Indicacoes from "./components/Indicacoes";
import Material from "./components/Material";
import Premios from "./components/Premios";
import Config from "./components/configdash/Config";
import Notificacoes from "./components/Notificacoes";

type SectionId =
  | "dashboard"
  | "cupom"
  | "indicacoes"
  | "materiais"
  | "premios"
  | "config"
  | "notificacoes"
  ;

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <HomeDashboard />;

      case "cupom":
        return <Cupon />;

      case "indicacoes":
        return <Indicacoes />;

      case "materiais":
        return (
          <Material />
        );

      case "premios":
        return (
          <Premios />
        );

      case "config":
        return <Config />;

          case "notificacoes":
        return <Notificacoes/>;

      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen  flex bg-Darkgray">
      <Sidebar
        active={activeSection}
        onChange={(id) => setActiveSection(id as SectionId)}
      />

      <main className="flex-1 lg:p-6">{renderSection()}</main>
    </div>
  );
}
