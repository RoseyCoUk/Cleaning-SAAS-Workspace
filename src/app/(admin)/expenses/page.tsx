import type { Metadata } from "next";
import { ExpenseTracker } from "@/components/cleaning/ExpenseTracker";
import React from "react";

export const metadata: Metadata = {
  title: "Expense Tracking | Financial Management",
  description: "Track and manage business expenses",
};

export default function ExpensesPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Expense Management
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track business expenses and manage receipts
        </p>
      </div>

      <ExpenseTracker />
    </div>
  );
}