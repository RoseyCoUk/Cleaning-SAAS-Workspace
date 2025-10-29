"use client";
import React, { useState } from "react";
import Calendar from "@/components/calendar/Calendar";
import { BookingsManager } from "@/components/cleaning/BookingsManager";

type ViewMode = "calendar" | "bookings";

export const ScheduleMain = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  return (
    <div className="space-y-6">
      {/* Page Header with Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {viewMode === "calendar"
              ? "Calendar view of all jobs and appointments"
              : "Manage all bookings - recurring and one-off"}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
              viewMode === "calendar"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode("bookings")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
              viewMode === "bookings"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Bookings Manager
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "calendar" ? <Calendar /> : <BookingsManager />}
    </div>
  );
};
