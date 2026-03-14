import { IconType } from "react-icons";
import {
  FiActivity,
  FiBarChart2,
  FiCreditCard,
  FiGift,
  FiGrid,
  FiLink,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

export type AdminSectionId =
  | "dashboard"
  | "affiliates"
  | "commissions"
  | "leads"
  | "campaigns"
  | "coupons"
  | "settings"
  | "reports";

export interface AdminNavItem {
  id: AdminSectionId;
  label: string;
  icon: IconType;
}

export const adminNavItems: AdminNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: FiGrid },
  { id: "affiliates", label: "Afiliados", icon: FiUsers },
  { id: "commissions", label: "Comissoes", icon: FiCreditCard },
  { id: "leads", label: "Leads", icon: FiActivity },
  { id: "campaigns", label: "Campanhas", icon: FiGift },
  { id: "coupons", label: "Cupons e Links", icon: FiLink },
  { id: "settings", label: "Configuracoes", icon: FiSettings },
  { id: "reports", label: "Ranking e Relatorios", icon: FiBarChart2 },
];
