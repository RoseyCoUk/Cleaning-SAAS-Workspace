"use client";
import React from "react";
import { TimeIcon } from "@/icons";

interface StaffMember {
  id: string;
  name: string;
  initials: string;
  status: "active" | "break" | "offline";
  location?: string;
  clockInTime?: string;
  currentTask?: string;
}

const staffMembers: StaffMember[] = [
  {
    id: "1",
    name: "Maria Garcia",
    initials: "MG",
    status: "active",
    location: "123 Oak Street",
    clockInTime: "8:00 AM",
    currentTask: "Deep Clean",
  },
  {
    id: "2",
    name: "John Davis",
    initials: "JD",
    status: "active",
    location: "456 Pine Ave",
    clockInTime: "8:30 AM",
    currentTask: "Regular Clean",
  },
  {
    id: "3",
    name: "Anna Smith",
    initials: "AS",
    status: "break",
    clockInTime: "7:45 AM",
  },
  {
    id: "4",
    name: "Mike Wilson",
    initials: "MW",
    status: "active",
    location: "789 Elm Street",
    clockInTime: "9:00 AM",
    currentTask: "Office Clean",
  },
  {
    id: "5",
    name: "Sarah Lee",
    initials: "SL",
    status: "offline",
  },
];

export const StaffStatus = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-fresh-500";
      case "break":
        return "bg-orange-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const activeCount = staffMembers.filter(m => m.status === "active").length;
  const totalCount = staffMembers.length;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Staff Status
          </h3>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {activeCount}/{totalCount} Active
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {staffMembers.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      {member.initials}
                    </span>
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${getStatusColor(member.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white truncate">
                    {member.name}
                  </h4>
                  {member.status === "active" && member.currentTask && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {member.currentTask}
                    </p>
                  )}
                  {member.status === "break" && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                      On break
                    </p>
                  )}
                  {member.status === "offline" && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Not clocked in
                    </p>
                  )}
                  {member.clockInTime && (
                    <div className="flex items-center gap-1 mt-1">
                      <TimeIcon className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {member.clockInTime}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium">
          View Full Team Schedule
        </button>
      </div>
    </div>
  );
};