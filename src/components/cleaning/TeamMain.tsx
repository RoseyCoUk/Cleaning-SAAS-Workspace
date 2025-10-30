"use client";
import React, { useState } from "react";
import { TeamOverview } from "@/components/cleaning/TeamOverview";
import { ManagerApprovalQueue } from "@/components/cleaning/ManagerApprovalQueue";
import { TeamScheduleTab } from "@/components/cleaning/TeamScheduleTab";
import { PayrollJournal } from "@/components/cleaning/PayrollJournal";
import { StaffAvailabilityCalendar } from "@/components/cleaning/StaffAvailabilityCalendar";
import { StaffAvailabilityDialog } from "@/components/cleaning/StaffAvailabilityDialog";
import { StaffMember, StaffAvailability } from "@/utils/staffAvailability";

type TabType = "overview" | "schedule" | "availability" | "payroll";

// Sample staff data - in production this would come from API/database
const initialStaff: StaffMember[] = [
  {
    id: "1",
    name: "Maria Garcia",
    availability: [
      { day: 1, start: "08:00", end: "16:00" }, // Monday
      { day: 2, start: "08:00", end: "16:00" }, // Tuesday
      { day: 3, start: "08:00", end: "16:00" }, // Wednesday
      { day: 4, start: "08:00", end: "16:00" }, // Thursday
      { day: 5, start: "08:00", end: "14:00" }, // Friday (half day)
    ],
    skills: ["Regular Clean", "Deep Clean"],
  },
  {
    id: "2",
    name: "John Smith",
    availability: [
      { day: 1, start: "09:00", end: "17:00" }, // Monday
      { day: 2, start: "09:00", end: "17:00" }, // Tuesday
      { day: 4, start: "09:00", end: "17:00" }, // Thursday
      { day: 5, start: "09:00", end: "17:00" }, // Friday
    ],
    skills: ["Regular Clean", "Move-Out Clean"],
  },
  {
    id: "3",
    name: "Sarah Williams",
    availability: [
      { day: 1, start: "07:00", end: "15:00" }, // Monday
      { day: 2, start: "07:00", end: "15:00" }, // Tuesday
      { day: 3, start: "07:00", end: "15:00" }, // Wednesday
      { day: 4, start: "07:00", end: "15:00" }, // Thursday
      { day: 5, start: "07:00", end: "15:00" }, // Friday
      { day: 6, start: "08:00", end: "12:00" }, // Saturday (half day)
    ],
    skills: ["Regular Clean", "Deep Clean", "Office Clean"],
  },
  {
    id: "4",
    name: "Michael Brown",
    availability: [
      { day: 2, start: "10:00", end: "18:00" }, // Tuesday
      { day: 3, start: "10:00", end: "18:00" }, // Wednesday
      { day: 4, start: "10:00", end: "18:00" }, // Thursday
      { day: 5, start: "10:00", end: "18:00" }, // Friday
      { day: 6, start: "10:00", end: "16:00" }, // Saturday
    ],
    skills: ["Regular Clean", "Office Clean"],
  },
  {
    id: "5",
    name: "Emily Davis",
    availability: [
      { day: 0, start: "09:00", end: "13:00" }, // Sunday
      { day: 1, start: "08:00", end: "16:00" }, // Monday
      { day: 3, start: "08:00", end: "16:00" }, // Wednesday
      { day: 5, start: "08:00", end: "16:00" }, // Friday
    ],
    skills: ["Regular Clean", "Deep Clean"],
  },
];

export const TeamMain = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);

  const handleEditAvailability = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setShowAvailabilityDialog(true);
  };

  const handleSaveAvailability = (staffId: string, availability: StaffAvailability[]) => {
    setStaff(prevStaff => {
      // Check if staff member exists
      const exists = prevStaff.some(s => s.id === staffId);

      if (exists) {
        // Update existing staff member
        return prevStaff.map(s => (s.id === staffId ? { ...s, availability } : s));
      } else {
        // This shouldn't happen in normal flow, but handle it defensively
        return prevStaff;
      }
    });
    setShowAvailabilityDialog(false);
    setEditingStaff(null);
  };

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
            onClick={() => setActiveTab("availability")}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "availability"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            Availability
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
      {activeTab === "availability" && (
        <StaffAvailabilityCalendar staff={staff} onEditAvailability={handleEditAvailability} />
      )}
      {activeTab === "payroll" && <PayrollJournal />}

      {/* Availability Dialog */}
      <StaffAvailabilityDialog
        isOpen={showAvailabilityDialog}
        staff={editingStaff}
        onClose={() => {
          setShowAvailabilityDialog(false);
          setEditingStaff(null);
        }}
        onSave={handleSaveAvailability}
      />
    </div>
  );
};
