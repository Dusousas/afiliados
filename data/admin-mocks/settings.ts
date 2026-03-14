import { PlatformSettings } from "@/types/admin";

export const adminPlatformSettingsMock: PlatformSettings = {
  defaultCommissionPercent: 20,
  minPayoutAmount: 300,
  programStatus: "active",
  rules: [
    "Comissao liberada apos confirmacao de pagamento do cliente.",
    "Cancelamentos em ate 7 dias invalidam a comissao.",
    "Saque minimo de R$ 300 por afiliado.",
    "Links e cupons devem respeitar politica de anuncios.",
  ],
  institutionalTexts: {
    dashboardWelcome: "Bem-vindo ao programa de afiliados You On.",
    payoutPolicy: "Pagamentos processados toda segunda e quinta-feira.",
    supportMessage: "Suporte comercial via WhatsApp em horario comercial.",
  },
  visual: {
    primaryColor: "#0bb0e6",
    secondaryColor: "#151518",
  },
};
