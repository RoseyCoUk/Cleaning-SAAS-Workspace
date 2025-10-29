import type { Metadata} from "next";
import { TeamMain } from "@/components/cleaning/TeamMain";
import React from "react";

export const metadata: Metadata = {
  title: "Team Management | Staff Overview",
  description: "Manage your cleaning team, schedule, and payroll",
};

export const dynamic = "force-dynamic";

export default function TeamPage() {
  return <TeamMain />;
}