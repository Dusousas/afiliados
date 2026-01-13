"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import HomeDashboard from "./components/HomeDashboard";
import MaterialAdmin from "./components/MaterialAdmin";
import CuponsAdmin from "./components/CuponsAdmin";
import PremiosAdmin from "./components/PremiosAdmin";
import IndicacoesAdmin from "./components/IndicacoesAdmin";
import ConfigAdmin from "./components/config/ConfigAdmin";

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

            case "materiais":
                return <MaterialAdmin />;

            case "premios":
                return (
                    <PremiosAdmin />
                );
            case "cupom":
                return < CuponsAdmin />;
            case "indicacoes":
                return <IndicacoesAdmin />
            case "config":
                return <ConfigAdmin />;


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
