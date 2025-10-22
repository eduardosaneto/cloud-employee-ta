import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Database } from "@/lib/supabase/database.types";
import Dashboard from "../components/dashboard";

export type ProspectWithQualification =
  Database["public"]["Tables"]["prospects"]["Row"] & {
    qualifications: (
      | Database["public"]["Tables"]["qualifications"]["Row"]
      | null
    )[];
  };

export type IcpWithPersonas = Database["public"]["Tables"]["icps"]["Row"] & {
  buyer_personas: Database["public"]["Tables"]["buyer_personas"]["Row"][];
};

async function getDashboardData(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await (await supabase).auth.getUser();
  if (!user) redirect("/login");

  const { data: company } = await (
    await supabase
  )
    .from("companies")
    .select(
      `
      id,
      icps (
        *,
        buyer_personas (*)
      )
    `
    )
    .eq("user_id", user.id)
    .single();

  if (
    !company ||
    !company.icps ||
    (Array.isArray(company.icps) && company.icps.length === 0)
  ) {
    redirect("/onboarding");
  }

  const icp = (
    Array.isArray(company.icps) ? company.icps[0] : company.icps
  ) as IcpWithPersonas;

  if (!icp) {
    redirect("/onboarding");
  }

  const { data: prospects } = await (
    await supabase
  )
    .from("prospects")
    .select(
      `
      *,
      qualifications (*)
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return {
    icp,
    prospects: (prospects as ProspectWithQualification[]) || [],
  };
}

export default async function DashboardPage() {
  const supabase = createClient();
  const { icp, prospects } = await getDashboardData(supabase);

  return <Dashboard icp={icp} prospects={prospects} />;
}
