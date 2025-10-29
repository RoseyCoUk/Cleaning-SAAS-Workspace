"use client";
import React, { useState } from "react";
import { UserCircleIcon, TrashBinIcon, CheckCircleIcon, CloseLineIcon, TimeIcon } from "@/icons";
import { useTimeEntries, type StaffTimeEntry } from "@/contexts/TimeEntriesContext";

export const TimeClockDashboard = () => {
  const { timeEntries, setTimeEntries } = useTimeEntries();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleClockIn = (staffId: string) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setTimeEntries(prev => prev.map(entry =>
      entry.id === staffId
        ? { ...entry, clockIn: timeString, status: "clocked_in" as const }
        : entry
    ));
  };

  const handleClockOut = (staffId: string) => {
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setTimeEntries(prev => prev.map(entry => {
      if (entry.id === staffId && entry.clockIn) {
        const [inHour, inMin] = entry.clockIn.split(':').map(Number);
        const [outHour, outMin] = timeString.split(':').map(Number);
        const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

        // Automatic 30-minute lunch deduction
        const lunchDeduction = 0.5; // 30 minutes = 0.5 hours
        const paidHours = Math.max(0, totalHours - lunchDeduction);

        return {
          ...entry,
          clockOut: timeString,
          totalHours,
          lunchDeduction,
          paidHours,
          status: "clocked_out" as const
        };
      }
      return entry;
    }));
  };

  const addStaffEntry = () => {
    const newEntry: StaffTimeEntry = {
      id: Date.now().toString(),
      name: "New Staff Member",
      clockIn: "",
      clockOut: "",
      lunchDeduction: 0.5,
      status: "not_clocked",
      approvalStatus: "pending"
    };
    setTimeEntries(prev => [...prev, newEntry]);
  };

  const removeEntry = (staffId: string) => {
    setTimeEntries(prev => prev.filter(entry => entry.id !== staffId));
  };

  const getStatusButton = (entry: StaffTimeEntry) => {
    if (entry.status === "not_clocked") {
      return (
        <button
          onClick={() => handleClockIn(entry.id)}
          className="px-3 py-1.5 bg-fresh-100 text-fresh-700 dark:bg-fresh-900/20 dark:text-fresh-400 rounded-lg text-sm font-medium hover:bg-fresh-200 dark:hover:bg-fresh-900/30 transition-colors"
        >
          Clock In
        </button>
      );
    } else if (entry.status === "clocked_in") {
      return (
        <button
          onClick={() => handleClockOut(entry.id)}
          className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
        >
          Clock Out
        </button>
      );
    } else {
      return (
        <span className="px-3 py-1.5 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-lg text-sm">
          Complete
        </span>
      );
    }
  };

  const getTotalHours = () => {
    return timeEntries.reduce((sum, entry) => sum + (entry.paidHours || 0), 0).toFixed(1);
  };

  const getApprovalBadge = (entry: StaffTimeEntry) => {
    if (entry.approvalStatus === "approved") {
      return (
        <div className="flex items-center gap-1 text-xs">
          <div className="px-2 py-1 bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400 rounded flex items-center gap-1">
            <CheckCircleIcon className="h-3 w-3" />
            <span>Approved</span>
          </div>
          {entry.approvedBy && (
            <span className="text-gray-500 dark:text-gray-400">by {entry.approvedBy}</span>
          )}
        </div>
      );
    }

    if (entry.approvalStatus === "rejected") {
      return (
        <div className="space-y-1">
          <div className="px-2 py-1 bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400 rounded text-xs flex items-center gap-1">
            <CloseLineIcon className="h-3 w-3" />
            <span>Rejected</span>
          </div>
          {entry.managerNotes && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Reason: {entry.managerNotes}</p>
          )}
        </div>
      );
    }

    return (
      <div className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded text-xs flex items-center gap-1">
        <TimeIcon className="h-3 w-3" />
        <span>Pending Approval</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Clock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Staff Quick Clock */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Today&apos;s Staff
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Quick clock in/out
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {timeEntries.slice(0, 4).map((staff) => (
                  <div
                    key={staff.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                        <UserCircleIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {staff.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {staff.status === "clocked_in"
                            ? `Clocked in at ${staff.clockIn}`
                            : staff.status === "clocked_out"
                            ? `${staff.paidHours}h paid (${staff.totalHours}h - 0.5h lunch)`
                            : "Not clocked in"}
                        </p>
                        {staff.status === "clocked_out" && (
                          <div className="mt-1">
                            {getApprovalBadge(staff)}
                          </div>
                        )}
                      </div>
                    </div>
                    {getStatusButton(staff)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Manual Time Entry Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Manual Time Entry
              </h3>
            </div>

            <div className="p-6">
              {/* Date Selector */}
              <div className="flex gap-4 mb-6">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Copy from Previous Day
                </button>
              </div>

              {/* Time Entries Table */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 px-3">
                  <div className="col-span-2">Staff Member</div>
                  <div className="col-span-2">Clock In</div>
                  <div className="col-span-2">Clock Out</div>
                  <div className="col-span-1 text-center">Total</div>
                  <div className="col-span-1 text-center">Lunch</div>
                  <div className="col-span-1 text-center">Paid</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1"></div>
                </div>

                {timeEntries.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="col-span-2 font-medium text-sm text-gray-900 dark:text-white">
                      {entry.name}
                    </div>
                    <div className="col-span-2">
                      <input
                        type="time"
                        value={entry.clockIn || ""}
                        onChange={(e) => {
                          const newEntries = timeEntries.map(te =>
                            te.id === entry.id ? { ...te, clockIn: e.target.value } : te
                          );
                          setTimeEntries(newEntries);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="time"
                        value={entry.clockOut || ""}
                        onChange={(e) => {
                          const newEntries = timeEntries.map(te => {
                            if (te.id === entry.id && te.clockIn) {
                              const [inHour, inMin] = te.clockIn.split(':').map(Number);
                              const [outHour, outMin] = e.target.value.split(':').map(Number);
                              const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
                              const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

                              // Automatic 30-minute lunch deduction
                              const lunchDeduction = 0.5;
                              const paidHours = Math.max(0, totalHours - lunchDeduction);

                              return { ...te, clockOut: e.target.value, totalHours, lunchDeduction, paidHours };
                            }
                            return te.id === entry.id ? { ...te, clockOut: e.target.value } : te;
                          });
                          setTimeEntries(newEntries);
                        }}
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                    <div className="col-span-1 text-center text-xs text-gray-600 dark:text-gray-400">
                      {entry.totalHours ? `${entry.totalHours}h` : "-"}
                    </div>
                    <div className="col-span-1 text-center text-xs text-gray-500 dark:text-gray-500">
                      {entry.totalHours ? "-0.5h" : "-"}
                    </div>
                    <div className="col-span-1 text-center font-semibold text-sm text-success-600 dark:text-success-400">
                      {entry.paidHours !== undefined ? `${entry.paidHours}h` : "-"}
                    </div>
                    <div className="col-span-2">
                      {entry.status === "clocked_out" && getApprovalBadge(entry)}
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="col-span-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Staff Button */}
              <button
                onClick={addStaffEntry}
                className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
              >
                + Add Staff Member
              </button>

              {/* Summary */}
              <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Paid Hours for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      After 30-minute lunch deduction
                    </p>
                    <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">
                      {getTotalHours()} hours
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      Save Draft
                    </button>
                    <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                      Submit Time
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};