import type { Metadata } from "next";
import { PayrollJournal } from "@/components/cleaning/PayrollJournal";
import React from "react";

export const metadata: Metadata = {
  title: "Payroll Journal | Staff Management",
  description: "Generate and manage payroll reports",
};

export default function PayrollPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payroll Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review and approve payroll for your cleaning staff
        </p>
      </div>

      <PayrollJournal />

      {/* Additional Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Next Payroll Date</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-400">Dec 29, 2024</p>
          <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">In 6 days</p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">YTD Payroll</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-400">$186,450</p>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">52 pay periods</p>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Active Employees</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-400">12</p>
          <p className="text-sm text-purple-600 dark:text-purple-500 mt-1">3 full-time, 9 part-time</p>
        </div>
      </div>
    </div>
  );
}