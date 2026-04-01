import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DashboardPageClient from "./DashboardPageClient";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "affiliate" || !user.affiliateId) {
    redirect(user.role === "admin" ? "/admin" : "/login");
  }

  return <DashboardPageClient currentUser={user} />;
}
