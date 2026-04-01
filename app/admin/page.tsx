import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminPageClient from "./AdminPageClient";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect(user.role === "affiliate" ? "/dashboard" : "/login");
  }

  return <AdminPageClient currentUser={user} />;
}
