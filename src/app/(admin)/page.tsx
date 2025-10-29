import type { Metadata } from "next";
import { CleaningMetrics } from "@/components/cleaning/CleaningMetrics";
import { UpcomingAppointments } from "@/components/cleaning/UpcomingAppointments";
import { QuickActions } from "@/components/cleaning/QuickActions";
import { StaffStatus } from "@/components/cleaning/StaffStatus";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import React from "react";

export const metadata: Metadata = {
  title: "Cleaning Company Dashboard | Professional Cleaning Management System",
  description: "Manage your cleaning business with our comprehensive dashboard",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Top Metrics Row */}
      <div className="col-span-12">
        <CleaningMetrics />
      </div>

      {/* Main Content Area */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <UpcomingAppointments />
        <MonthlySalesChart />
      </div>

      {/* Sidebar Content */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <QuickActions />
        <StaffStatus />
      </div>
    </div>
  );
}
