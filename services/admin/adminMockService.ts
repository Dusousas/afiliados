import {
  AdminDashboardMetrics,
  Affiliate,
  AffiliateStatus,
  Campaign,
  CampaignMaterial,
  Commission,
  CommissionStatus,
  CouponLink,
  DateRangeFilter,
  Lead,
  PlatformSettings,
  RankingItem,
} from "@/types/admin";

type AffiliateFilter = {
  search?: string;
  status?: AffiliateStatus | "all";
};

type CommissionFilter = DateRangeFilter & {
  affiliateId?: string;
  status?: CommissionStatus | "all";
};

type LeadFilter = DateRangeFilter & {
  affiliateId?: string;
  status?: Lead["status"] | "all";
  origin?: string | "all";
};

type AdminSnapshot = {
  affiliates: Affiliate[];
  leads: Lead[];
  commissions: Commission[];
  campaigns: Campaign[];
  materials: CampaignMaterial[];
  coupons: CouponLink[];
  settings: PlatformSettings;
  metrics: AdminDashboardMetrics;
  ranking: RankingItem[];
};

type AffiliateDashboardData = {
  affiliate: Affiliate | null;
  leads: Lead[];
  commissions: Commission[];
  coupons: CouponLink[];
  campaigns: Campaign[];
  materials: CampaignMaterial[];
  settings: PlatformSettings;
};

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null);
    throw new Error(errorPayload?.message ?? `Falha na requisicao: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

function isInDateRange(dateValue: string, range?: DateRangeFilter): boolean {
  if (!range?.startDate && !range?.endDate) return true;
  const date = new Date(dateValue);
  if (range.startDate && date < new Date(range.startDate)) return false;
  if (range.endDate && date > new Date(range.endDate)) return false;
  return true;
}

export const adminMockService = {
  async getDashboardMetrics() {
    const snapshot = await this.getAdminSnapshot();
    return snapshot.metrics;
  },

  async getRanking() {
    const snapshot = await this.getAdminSnapshot();
    return snapshot.ranking;
  },

  async getAffiliates(filters?: AffiliateFilter) {
    const snapshot = await this.getAdminSnapshot();
    const search = filters?.search?.trim().toLowerCase() ?? "";

    return snapshot.affiliates.filter((affiliate) => {
      const matchesStatus = !filters?.status || filters.status === "all"
        ? true
        : affiliate.status === filters.status;

      const matchesSearch = !search
        ? true
        : affiliate.name.toLowerCase().includes(search) ||
          affiliate.email.toLowerCase().includes(search) ||
          affiliate.id.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  },

  async updateAffiliate(
    id: string,
    payload: Partial<Pick<Affiliate, "name" | "email" | "phone" | "status" | "city" | "state">>
  ) {
    await requestJson<{ success: boolean }>(`/api/admin/affiliates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const affiliates = await this.getAffiliates();
    return affiliates.find((item) => item.id === id) ?? null;
  },

  async createAffiliate(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    city: string;
    state: string;
    status: AffiliateStatus;
  }) {
    const result = await requestJson<{ success: boolean; affiliateId: string }>("/api/admin/affiliates", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const affiliates = await this.getAffiliates();
    return affiliates.find((item) => item.id === result.affiliateId) ?? null;
  },

  async toggleAffiliateStatus(id: string) {
    await requestJson<{ success: boolean }>(`/api/admin/affiliates/${id}/toggle-status`, {
      method: "POST",
    });
    const affiliates = await this.getAffiliates();
    return affiliates.find((item) => item.id === id) ?? null;
  },

  async getCommissions(filters?: CommissionFilter) {
    const snapshot = await this.getAdminSnapshot();

    return snapshot.commissions.filter((item) => {
      const matchesAffiliate = !filters?.affiliateId || filters.affiliateId === "all"
        ? true
        : item.affiliateId === filters.affiliateId;

      const matchesStatus = !filters?.status || filters.status === "all"
        ? true
        : item.status === filters.status;

      const matchesDate = isInDateRange(item.createdAt, filters);

      return matchesAffiliate && matchesStatus && matchesDate;
    });
  },

  async approveCommission(id: string) {
    await requestJson<{ success: boolean }>(`/api/admin/commissions/${id}/approve`, {
      method: "POST",
    });

    const commissions = await this.getCommissions();
    return commissions.find((item) => item.id === id) ?? null;
  },

  async markCommissionAsPaid(id: string) {
    await requestJson<{ success: boolean }>(`/api/admin/commissions/${id}/mark-paid`, {
      method: "POST",
    });

    const commissions = await this.getCommissions();
    return commissions.find((item) => item.id === id) ?? null;
  },

  async getLeads(filters?: LeadFilter) {
    const snapshot = await this.getAdminSnapshot();

    return snapshot.leads.filter((lead) => {
      const matchesAffiliate = !filters?.affiliateId || filters.affiliateId === "all"
        ? true
        : lead.affiliateId === filters.affiliateId;

      const matchesStatus = !filters?.status || filters.status === "all"
        ? true
        : lead.status === filters.status;

      const matchesOrigin = !filters?.origin || filters.origin === "all"
        ? true
        : lead.origin === filters.origin;

      const matchesDate = isInDateRange(lead.createdAt, filters);

      return matchesAffiliate && matchesStatus && matchesOrigin && matchesDate;
    });
  },

  async updateLead(id: string, payload: Partial<Pick<Lead, "status" | "notes" | "potentialValue">>) {
    await requestJson<{ success: boolean }>(`/api/admin/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const leads = await this.getLeads();
    return leads.find((lead) => lead.id === id) ?? null;
  },

  async createLead(payload: {
    affiliateId: string;
    name: string;
    origin: string;
    potentialValue: number;
    notes?: string;
  }) {
    const result = await requestJson<{ success: boolean; id: string }>("/api/admin/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const leads = await this.getLeads({ affiliateId: payload.affiliateId });
    return leads.find((lead) => lead.id === result.id) ?? null;
  },

  async getCampaigns() {
    const snapshot = await this.getAdminSnapshot();
    return snapshot.campaigns;
  },

  async createCampaign(payload: Omit<Campaign, "id" | "createdAt">) {
    const result = await requestJson<{ success: boolean; id: string }>("/api/admin/campaigns", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const campaigns = await this.getCampaigns();
    return campaigns.find((campaign) => campaign.id === result.id) ?? null;
  },

  async updateCampaign(id: string, payload: Partial<Omit<Campaign, "id" | "createdAt">>) {
    await requestJson<{ success: boolean }>(`/api/admin/campaigns/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const campaigns = await this.getCampaigns();
    return campaigns.find((campaign) => campaign.id === id) ?? null;
  },

  async getCampaignMaterials(campaignId?: string) {
    const snapshot = await this.getAdminSnapshot();
    if (!campaignId) return snapshot.materials;
    return snapshot.materials.filter((item) => item.campaignId === campaignId);
  },

  async createCampaignMaterial(payload: Omit<CampaignMaterial, "id" | "createdAt">) {
    const result = await requestJson<{ success: boolean; id: string }>("/api/admin/materials", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const materials = await this.getCampaignMaterials();
    return materials.find((item) => item.id === result.id) ?? null;
  },

  async toggleCampaignMaterialPublish(id: string) {
    await requestJson<{ success: boolean }>(`/api/admin/materials/${id}/toggle-publish`, {
      method: "POST",
    });

    const materials = await this.getCampaignMaterials();
    return materials.find((item) => item.id === id) ?? null;
  },

  async getCoupons() {
    const snapshot = await this.getAdminSnapshot();
    return snapshot.coupons;
  },

  async createCoupon(payload: Omit<CouponLink, "id" | "createdAt">) {
    const result = await requestJson<{ success: boolean; id: string }>("/api/admin/coupons", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const coupons = await this.getCoupons();
    return coupons.find((coupon) => coupon.id === result.id) ?? null;
  },

  async updateCoupon(id: string, payload: Partial<Omit<CouponLink, "id" | "createdAt">>) {
    await requestJson<{ success: boolean }>(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    const coupons = await this.getCoupons();
    return coupons.find((coupon) => coupon.id === id) ?? null;
  },

  async toggleCouponStatus(id: string) {
    await requestJson<{ success: boolean }>(`/api/admin/coupons/${id}/toggle-status`, {
      method: "POST",
    });

    const coupons = await this.getCoupons();
    return coupons.find((coupon) => coupon.id === id) ?? null;
  },

  async getSettings() {
    const snapshot = await this.getAdminSnapshot();
    return snapshot.settings;
  },

  async updateSettings(payload: Partial<PlatformSettings>) {
    return requestJson<PlatformSettings>("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  async getAdminSnapshot() {
    return requestJson<AdminSnapshot>("/api/admin/snapshot");
  },

  async getAffiliateDashboardData(affiliateId: string) {
    return requestJson<AffiliateDashboardData>(`/api/dashboard/affiliate/${affiliateId}`);
  },
};

export type AdminMockService = typeof adminMockService;
