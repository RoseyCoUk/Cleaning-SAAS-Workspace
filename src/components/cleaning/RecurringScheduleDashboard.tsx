"use client";
import { RecurringSchedule } from "@/components/cleaning/RecurringSchedule";
import React, { useState } from "react";

// Sample recurring clients data
const recurringClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    frequency: "Weekly",
    nextService: "Mon, Dec 23",
    time: "9:00 AM",
    duration: "2 hours",
    status: "active",
  },
  {
    id: "2",
    name: "Michael Chen",
    frequency: "Bi-weekly",
    nextService: "Wed, Dec 25",
    time: "10:00 AM",
    duration: "3 hours",
    status: "active",
  },
  {
    id: "3",
    name: "Emily Davis",
    frequency: "Monthly",
    nextService: "Fri, Jan 3",
    time: "2:00 PM",
    duration: "4 hours",
    status: "active",
  },
  {
    id: "4",
    name: "Robert Wilson",
    frequency: "Weekly",
    nextService: "Thu, Dec 26",
    time: "11:00 AM",
    duration: "2 hours",
    status: "paused",
  },
];

// One-off services data
const oneOffServices = [
  {
    id: "1",
    name: "Emma Rodriguez",
    serviceType: "Deep Clean",
    scheduledDate: "Nov 2, 2024",
    time: "9:00 AM",
    duration: "4 hours",
    status: "scheduled",
  },
  {
    id: "2",
    name: "David Kim",
    serviceType: "Move-Out Clean",
    scheduledDate: "Nov 5, 2024",
    time: "10:30 AM",
    duration: "5 hours",
    status: "scheduled",
  },
  {
    id: "3",
    name: "Lisa Martinez",
    serviceType: "Move-In Clean",
    scheduledDate: "Nov 8, 2024",
    time: "2:00 PM",
    duration: "4 hours",
    status: "scheduled",
  },
];

export const RecurringScheduleDashboard = () => {
  const [viewMode, setViewMode] = useState<"one-off" | "recurring">("one-off");

  return (
    <div className="space-y-6">
      {/* Page Header with Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {viewMode === "one-off" ? "One-Off & Special Services" : "Recurring Schedules"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {viewMode === "one-off"
              ? "Deep cleans, move-outs, and one-time services"
              : "Manage automated recurring bookings for regular clients"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setViewMode("one-off")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === "one-off"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              One-Off
            </button>
            <button
              onClick={() => setViewMode("recurring")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l transition-colors ${
                viewMode === "recurring"
                  ? "bg-brand-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300"
              }`}
            >
              Recurring
            </button>
          </div>

          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            + New {viewMode === "one-off" ? "One-Off Service" : "Recurring Booking"}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {viewMode === "one-off" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">5</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Deep Cleans</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
          </div>
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Move-Outs</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
          </div>
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Move-Ins</div>
            <div className="text-xs text-gray-400 mt-1">This month</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">48</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Active Recurring</div>
          </div>
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">32</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Weekly Clients</div>
          </div>
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Bi-weekly</div>
          </div>
          <div className="p-4 bg-white dark:bg-white/[0.03] rounded-lg border border-gray-200 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">4</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monthly</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recurring Schedule Component */}
        <div className="lg:col-span-2">
          <RecurringSchedule />
        </div>

        {/* Services List */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {viewMode === "one-off" ? "Upcoming One-Off Services" : "Recurring Clients"}
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {viewMode === "one-off"
                  ? oneOffServices.map((service) => (
                      <div
                        key={service.id}
                        className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {service.serviceType} • {service.time}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {service.scheduledDate}
                            </p>
                          </div>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))
                  : recurringClients.map((client) => (
                      <div
                        key={client.id}
                        className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {client.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {client.frequency} • {client.time}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Next: {client.nextService}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              client.status === "active"
                                ? "bg-fresh-100 text-fresh-700 dark:bg-fresh-900/20 dark:text-fresh-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                            }`}
                          >
                            {client.status}
                          </span>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
