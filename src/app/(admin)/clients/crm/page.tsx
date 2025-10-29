import type { Metadata } from "next";
import { CRMDashboard } from "@/components/cleaning/CRMDashboard";
import React from "react";

export const metadata: Metadata = {
  title: "CRM Dashboard | Client Management",
  description: "Manage your cleaning service clients and relationships",
};

export default function CRMPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customer Relationship Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track client information, preferences, and service history
        </p>
      </div>

      <CRMDashboard />
    </div>
  );
}