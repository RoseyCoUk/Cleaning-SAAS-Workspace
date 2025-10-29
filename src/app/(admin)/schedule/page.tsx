import type { Metadata } from "next";
import { ScheduleMain } from "@/components/cleaning/ScheduleMain";
import React from "react";

export const metadata: Metadata = {
  title: "Schedule | Cleaning Management System",
  description: "Manage your cleaning schedule - calendar and bookings",
};

export const dynamic = "force-dynamic";

export default function SchedulePage() {
  return <ScheduleMain />;
}
