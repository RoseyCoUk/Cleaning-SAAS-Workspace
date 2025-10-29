"use client";
import React, { useState, useEffect } from "react";
import { CloseIcon, TimeIcon, CheckCircleIcon } from "@/icons";

interface StaffCheckinModalProps {
  onClose: () => void;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  isClockedIn: boolean;
  clockInTime?: string;
}

export const StaffCheckinModal: React.FC<StaffCheckinModalProps> = ({ onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { id: "1", name: "Maria Garcia", role: "Cleaner", isClockedIn: false },
    { id: "2", name: "John Smith", role: "Cleaner", isClockedIn: false },
    { id: "3", name: "Lisa Chen", role: "Supervisor", isClockedIn: false },
    { id: "4", name: "Carlos Rodriguez", role: "Cleaner", isClockedIn: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockToggle = (staffId: string) => {
    setStaffMembers((prev) =>
      prev.map((staff) => {
        if (staff.id === staffId) {
          return {
            ...staff,
            isClockedIn: !staff.isClockedIn,
            clockInTime: !staff.isClockedIn
              ? currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : undefined,
          };
        }
        return staff;
      })
    );
  };

  const clockedInCount = staffMembers.filter((s) => s.isClockedIn).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Staff Check-In
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {clockedInCount} of {staffMembers.length} staff clocked in
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <CloseIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Current Time Display */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-brand-50 p-4 dark:bg-brand-900/10">
            <TimeIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            <div className="text-3xl font-bold tabular-nums text-brand-600 dark:text-brand-400">
              {currentTime.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentTime.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Staff List */}
        <div className="max-h-[500px] overflow-y-auto p-6">
          <div className="space-y-3">
            {staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      staff.isClockedIn
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {staff.isClockedIn ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {staff.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {staff.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {staff.role}
                      </p>
                      {staff.isClockedIn && staff.clockInTime && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Clocked in at {staff.clockInTime}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleClockToggle(staff.id)}
                  className={`rounded-lg px-6 py-2 font-medium transition-colors ${
                    staff.isClockedIn
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {staff.isClockedIn ? "Clock Out" : "Clock In"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
