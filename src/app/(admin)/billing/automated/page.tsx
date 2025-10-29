import type { Metadata } from "next";
import { AutomatedBilling } from "@/components/cleaning/AutomatedBilling";
import React from "react";

export const metadata: Metadata = {
  title: "Automated Billing | Billing Management",
  description: "Configure automated billing and payment processing",
};

export default function AutomatedBillingPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Automated Billing Setup
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure how and when clients are billed for services
        </p>
      </div>

      <AutomatedBilling />
    </div>
  );
}