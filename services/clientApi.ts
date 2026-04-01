import { AccountProfile, AuthResponse, AuthUser } from "@/types/auth";
import { Campaign, CampaignMaterial, Commission, CouponLink, Lead, PlatformSettings } from "@/types/admin";

export type AffiliateDashboardData = {
  affiliate: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: "active" | "pending" | "blocked";
    joinedAt: string;
    lastActiveAt: string;
    city: string;
    state: string;
    totalLeads: number;
    totalConversions: number;
    totalCommissions: number;
  } | null;
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

export const authClient = {
  async login(payload: { email: string; password: string }) {
    return requestJson<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async register(payload: { name: string; email: string; password: string; phone?: string }) {
    return requestJson<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async logout() {
    return requestJson<{ success: boolean }>("/api/auth/logout", {
      method: "POST",
    });
  },

  async getCurrentUser() {
    const response = await requestJson<{ user: AuthUser | null }>("/api/auth/me");
    return response.user;
  },

  async getProfile() {
    return requestJson<AccountProfile>("/api/account/profile");
  },

  async updateProfile(payload: Partial<Pick<AccountProfile, "name" | "email" | "username" | "phone">>) {
    return requestJson<AccountProfile>("/api/account/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};

export const affiliateDashboardClient = {
  async getMyDashboard() {
    return requestJson<AffiliateDashboardData>("/api/dashboard/me");
  },

  async createLead(payload: { name: string; origin: string; potentialValue: number; notes?: string }) {
    return requestJson<{ success: boolean; id: string }>("/api/dashboard/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async updateLead(
    id: string,
    payload: Partial<Pick<Lead, "status" | "notes" | "potentialValue">>
  ) {
    return requestJson<{ success: boolean }>(`/api/dashboard/leads/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
};
