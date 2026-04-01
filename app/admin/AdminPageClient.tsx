"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminMockService } from "@/services/admin/adminMockService";
import { authClient } from "@/services/clientApi";
import { Affiliate, Campaign, CampaignMaterial, CouponLink, Lead, PlatformSettings } from "@/types/admin";
import { AuthUser } from "@/types/auth";
import { AdminHeader, AdminSectionId, AdminSidebar } from "./components/layout";
import {
  AdminDashboardModule,
  AffiliatesModule,
  CampaignsModule,
  CommissionsModule,
  CouponsModule,
  LeadsModule,
  ReportsModule,
  SettingsModule,
} from "./components/modules";
import { LoadingCards } from "./components/ui";

type AdminSnapshot = Awaited<ReturnType<typeof adminMockService.getAdminSnapshot>>;

type Props = {
  currentUser: AuthUser;
};

export default function AdminPageClient({ currentUser }: Props) {
  const [activeSection, setActiveSection] = useState<AdminSectionId>("dashboard");
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    adminMockService.getAdminSnapshot().then((data) => {
      if (!mounted) return;
      setSnapshot(data);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const refreshAfterAction = useCallback(async () => {
    const data = await adminMockService.getAdminSnapshot();
    setSnapshot(data);
  }, []);

  const handleLogout = useCallback(async () => {
    await authClient.logout();
    router.push("/login");
    router.refresh();
  }, [router]);

  const actions = useMemo(
    () => ({
      updateAffiliate: async (
        id: string,
        payload: Partial<Pick<Affiliate, "name" | "email" | "phone" | "status" | "city" | "state">>
      ) => {
        await adminMockService.updateAffiliate(id, payload);
        await refreshAfterAction();
      },
      createAffiliate: async (payload: {
        name: string;
        email: string;
        phone: string;
        password: string;
        city: string;
        state: string;
        status: Affiliate["status"];
      }) => {
        await adminMockService.createAffiliate(payload);
        await refreshAfterAction();
      },
      toggleAffiliate: async (id: string) => {
        await adminMockService.toggleAffiliateStatus(id);
        await refreshAfterAction();
      },
      approveCommission: async (id: string) => {
        await adminMockService.approveCommission(id);
        await refreshAfterAction();
      },
      payCommission: async (id: string) => {
        await adminMockService.markCommissionAsPaid(id);
        await refreshAfterAction();
      },
      updateLead: async (
        id: string,
        payload: Partial<Pick<Lead, "status" | "notes" | "potentialValue">>
      ) => {
        await adminMockService.updateLead(id, payload);
        await refreshAfterAction();
      },
      createCampaign: async (payload: Omit<Campaign, "id" | "createdAt">) => {
        await adminMockService.createCampaign(payload);
        await refreshAfterAction();
      },
      updateCampaign: async (
        id: string,
        payload: Partial<Omit<Campaign, "id" | "createdAt">>
      ) => {
        await adminMockService.updateCampaign(id, payload);
        await refreshAfterAction();
      },
      createMaterial: async (payload: Omit<CampaignMaterial, "id" | "createdAt">) => {
        await adminMockService.createCampaignMaterial(payload);
        await refreshAfterAction();
      },
      toggleMaterialPublish: async (id: string) => {
        await adminMockService.toggleCampaignMaterialPublish(id);
        await refreshAfterAction();
      },
      createCoupon: async (payload: Omit<CouponLink, "id" | "createdAt">) => {
        await adminMockService.createCoupon(payload);
        await refreshAfterAction();
      },
      updateCoupon: async (
        id: string,
        payload: Partial<Omit<CouponLink, "id" | "createdAt">>
      ) => {
        await adminMockService.updateCoupon(id, payload);
        await refreshAfterAction();
      },
      toggleCouponStatus: async (id: string) => {
        await adminMockService.toggleCouponStatus(id);
        await refreshAfterAction();
      },
      updateSettings: async (payload: Partial<PlatformSettings>) => {
        await adminMockService.updateSettings(payload);
        await refreshAfterAction();
      },
    }),
    [refreshAfterAction]
  );

  return (
    <div className="flex min-h-screen bg-Darkgray">
      <AdminSidebar
        active={activeSection}
        onChange={setActiveSection}
        onLogout={handleLogout}
        userName={currentUser.name}
        userEmail={currentUser.email}
      />

      <main className="flex-1 px-4 py-6 pb-24 lg:p-6">
        <AdminHeader section={activeSection} />

        {loading || !snapshot ? (
          <LoadingCards />
        ) : (
          <>
            {activeSection === "dashboard" ? (
              <AdminDashboardModule
                metrics={snapshot.metrics}
                ranking={snapshot.ranking}
                commissions={snapshot.commissions}
                leads={snapshot.leads}
              />
            ) : null}

            {activeSection === "affiliates" ? (
              <AffiliatesModule
                affiliates={snapshot.affiliates}
                onCreateAffiliate={actions.createAffiliate}
                onUpdateAffiliate={actions.updateAffiliate}
                onToggleAffiliateStatus={actions.toggleAffiliate}
              />
            ) : null}

            {activeSection === "commissions" ? (
              <CommissionsModule
                commissions={snapshot.commissions}
                affiliates={snapshot.affiliates}
                onApproveCommission={actions.approveCommission}
                onMarkCommissionAsPaid={actions.payCommission}
              />
            ) : null}

            {activeSection === "leads" ? (
              <LeadsModule
                leads={snapshot.leads}
                affiliates={snapshot.affiliates}
                onUpdateLead={actions.updateLead}
              />
            ) : null}

            {activeSection === "campaigns" ? (
              <CampaignsModule
                campaigns={snapshot.campaigns}
                materials={snapshot.materials}
                onCreateCampaign={actions.createCampaign}
                onUpdateCampaign={actions.updateCampaign}
                onCreateMaterial={actions.createMaterial}
                onToggleMaterialPublish={actions.toggleMaterialPublish}
              />
            ) : null}

            {activeSection === "coupons" ? (
              <CouponsModule
                coupons={snapshot.coupons}
                affiliates={snapshot.affiliates}
                onCreateCoupon={actions.createCoupon}
                onUpdateCoupon={actions.updateCoupon}
                onToggleCouponStatus={actions.toggleCouponStatus}
              />
            ) : null}

            {activeSection === "settings" ? (
              <SettingsModule
                settings={snapshot.settings}
                onUpdateSettings={actions.updateSettings}
              />
            ) : null}

            {activeSection === "reports" ? (
              <ReportsModule
                ranking={snapshot.ranking}
                commissions={snapshot.commissions}
                leads={snapshot.leads}
              />
            ) : null}
          </>
        )}
      </main>
    </div>
  );
}
