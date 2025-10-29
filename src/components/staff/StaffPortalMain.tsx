"use client";
import React, { useState } from "react";
import { StaffTodayTab } from "@/components/staff/StaffTodayTab";
import { StaffScheduleTab } from "@/components/staff/StaffScheduleTab";
import { StaffPayrollTab } from "@/components/staff/StaffPayrollTab";

type TabType = "today" | "schedule" | "payroll";

export const StaffPortalMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>("today");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-4">
          <button
            onClick={() => setActiveTab("today")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "today"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab("schedule")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "schedule"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            Schedule
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "payroll"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400"
            }`}
          >
            Payroll
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "today" && <StaffTodayTab />}
      {activeTab === "schedule" && <StaffScheduleTab />}
      {activeTab === "payroll" && <StaffPayrollTab />}
    </div>
  );
};
