"use client";
import React, { useState } from "react";
import { TeamOverview } from "@/components/cleaning/TeamOverview";
import { ManagerApprovalQueue } from "@/components/cleaning/ManagerApprovalQueue";
import { TeamScheduleTab } from "@/components/cleaning/TeamScheduleTab";
import { PayrollJournal } from "@/components/cleaning/PayrollJournal";

type TabType = "overview" | "schedule" | "payroll";

export const TeamMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Team Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your team, schedule, and payroll
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "overview"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Team Overview
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "schedule"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "payroll"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Payroll
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <ManagerApprovalQueue />
          <TeamOverview />
        </div>
      )}
      {activeTab === "schedule" && <TeamScheduleTab />}
      {activeTab === "payroll" && <PayrollJournal />}
    </div>
  );
};
