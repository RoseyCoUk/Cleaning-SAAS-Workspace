import type { Metadata } from "next";
import { TimeClockDashboard } from "@/components/cleaning/TimeClockDashboard";
import React from "react";

export const metadata: Metadata = {
  title: "Time Clock | Staff Management",
  description: "Track staff time and attendance",
};

export default function TimeClockPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Time Clock System
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track employee hours and manage time entries
        </p>
      </div>

      <TimeClockDashboard />
    </div>
  );
}