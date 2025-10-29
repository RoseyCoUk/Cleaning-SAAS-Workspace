"use client";
import React, { useState } from "react";
import { AllClients } from "@/components/cleaning/AllClients";
import { ReviewsTab } from "@/components/cleaning/ReviewsTab";

type TabType = "clients" | "reviews";

export const CRMMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>("clients");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          CRM Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your clients and reviews
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("clients")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "clients"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Clients
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "reviews"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Reviews
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "clients" ? <AllClients /> : <ReviewsTab />}
    </div>
  );
};
