import type { Metadata } from "next";
import { QuotesManager } from "@/components/cleaning/QuotesManager";
import React from "react";

export const metadata: Metadata = {
  title: "Quotes & Proposals | CleanPro",
  description: "Manage client quotes and proposals",
};

export const dynamic = "force-dynamic";

export default function QuotesPage() {
  return <QuotesManager />;
}
