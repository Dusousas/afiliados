export type AffiliateStatus = "active" | "pending" | "blocked";

export type CommissionStatus = "pending" | "approved" | "paid" | "cancelled";

export type LeadStatus = "new" | "qualified" | "proposal" | "won" | "lost";

export type CampaignStatus = "draft" | "active" | "paused" | "ended";

export type MaterialType = "banner" | "link" | "copy" | "file" | "image";

export type CouponStatus = "active" | "inactive";

export type ProgramStatus = "active" | "paused" | "maintenance";

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: AffiliateStatus;
  username?: string;
  hasAccount?: boolean;
  accountActive?: boolean;
  joinedAt: string;
  lastActiveAt: string;
  city: string;
  state: string;
  totalLeads: number;
  totalConversions: number;
  totalCommissions: number;
}

export interface Commission {
  id: string;
  affiliateId: string;
  affiliateName: string;
  leadId: string;
  orderId: string;
  orderValue: number;
  amount: number;
  status: CommissionStatus;
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface Lead {
  id: string;
  affiliateId: string;
  affiliateName: string;
  name: string;
  origin: string;
  status: LeadStatus;
  potentialValue: number;
  createdAt: string;
  updatedAt: string;
  notes: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CampaignMaterial {
  id: string;
  campaignId: string;
  title: string;
  type: MaterialType;
  description: string;
  url: string;
  fileName?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface CouponLink {
  id: string;
  code: string;
  link: string;
  status: CouponStatus;
  affiliateId?: string;
  affiliateName?: string;
  discountPercent: number;
  commissionPercent: number;
  createdAt: string;
  expiresAt?: string;
}

export interface PlatformSettings {
  defaultCommissionPercent: number;
  minPayoutAmount: number;
  programStatus: ProgramStatus;
  rules: string[];
  institutionalTexts: {
    dashboardWelcome: string;
    payoutPolicy: string;
    supportMessage: string;
  };
  visual: {
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface RankingItem {
  affiliateId: string;
  affiliateName: string;
  totalCommissions: number;
  totalLeads: number;
  totalConversions: number;
  conversionRate: number;
}

export interface AdminDashboardMetrics {
  totalAffiliates: number;
  activeAffiliates: number;
  totalCommissions: number;
  pendingCommissions: number;
  paidCommissions: number;
  totalLeads: number;
}

export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}
