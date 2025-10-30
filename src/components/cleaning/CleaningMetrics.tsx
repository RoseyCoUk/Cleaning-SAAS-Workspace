"use client";
import React, { useMemo } from "react";
import { CalenderIcon, DollarLineIcon, GroupIcon } from "@/icons";
import { OutstandingPayments } from "./OutstandingPayments";
import { useClients } from "@/contexts/ClientContext";
import { useInvoices } from "@/contexts/InvoiceContext";

export const CleaningMetrics = () => {
  const { clients } = useClients();
  const { invoices } = useInvoices();

  // GAP-004: Calculate metrics dynamically from real data
  const metrics = useMemo(() => {
    // Active Recurring Clients: Count clients with recurring bookings
    // Note: Using frequency field, not bookingFrequency (field name corrected per Claude's review)
    const activeRecurringClients = clients.filter(
      (client) =>
        client.frequency &&
        client.frequency.toLowerCase() !== "one-off" &&
        client.status === "active"
    ).length;

    // Today's Cleanings: Count from today's appointments
    // Using mock data from UpcomingAppointments component for now
    // TODO: When BookingsContext is created, pull from there instead
    const todaysCleanings = 4; // Currently matches UpcomingAppointments mock data (4 appointments)

    // This Week's Revenue: Sum of paid invoices from this week
    // Note: Using amount field, not total (field name corrected per Claude's review)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeeksRevenue = invoices
      .filter((invoice) => {
        // Parse date string (format: "Dec 15, 2024")
        const invoiceDate = new Date(invoice.issueDate);
        return (
          invoiceDate >= startOfWeek &&
          invoiceDate <= today &&
          invoice.status === "paid"
        );
      })
      .reduce((sum, invoice) => sum + invoice.amount, 0);

    return {
      activeRecurringClients,
      todaysCleanings,
      thisWeeksRevenue,
    };
  }, [clients, invoices]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
      {/* Active Recurring Clients */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-fresh-100 rounded-xl dark:bg-fresh-900/20">
          <GroupIcon className="text-fresh-600 size-6 dark:text-fresh-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active Recurring Clients
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.activeRecurringClients}
            </h4>
          </div>
        </div>
      </div>

      {/* Today's Cleanings */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl dark:bg-brand-900/20">
          <CalenderIcon className="text-brand-600 size-6 dark:text-brand-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Today&apos;s Cleanings
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.todaysCleanings}
            </h4>
          </div>
        </div>
      </div>

      {/* This Week's Revenue */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-xl dark:bg-success-900/20">
          <DollarLineIcon className="text-success-600 size-6 dark:text-success-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              This Week&apos;s Revenue
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              ${metrics.thisWeeksRevenue.toLocaleString()}
            </h4>
          </div>
        </div>
      </div>

      {/* Outstanding Payments */}
      <OutstandingPayments />
    </div>
  );
};