import type { Metadata } from "next";
import { CRMMain } from "@/components/cleaning/CRMMain";
import React from "react";

export const metadata: Metadata = {
  title: "CRM Dashboard | Client Management",
  description: "View and manage all your cleaning service clients and reviews",
};

export const dynamic = "force-dynamic";

export default function ClientsPage() {
  return <CRMMain />;
}