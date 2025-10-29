"use client";
import React, { useState } from "react";
import { CheckCircleIcon, CloseLineIcon, PencilIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import { useTimeEntries } from "@/contexts/TimeEntriesContext";

export const ManagerApprovalQueue = () => {
  const { timeEntries, approveEntry, rejectEntry, editEntryTimes } = useTimeEntries();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTimes, setEditedTimes] = useState<{clockIn: string; clockOut: string} | null>(null);

  const handleApprove = (entryId: string) => {
    approveEntry(entryId, "Manager");
  };

  const handleReject = (entryId: string, reason: string) => {
    rejectEntry(entryId, reason);
  };

  const handleEdit = (entryId: string, newClockIn: string, newClockOut: string) => {
    editEntryTimes(entryId, newClockIn, newClockOut);
    setEditingId(null);
    setEditedTimes(null);
  };

  const pendingEntries = timeEntries.filter(e => e.approvalStatus === "pending" && e.status === "clocked_out");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Pending Time Entry Approvals
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pendingEntries.length} {pendingEntries.length === 1 ? 'entry' : 'entries'} waiting for approval
            </p>
          </div>

          {pendingEntries.length > 0 && (
            <Badge color="warning">
              {pendingEntries.length} Pending
            </Badge>
          )}
        </div>
      </div>

      {pendingEntries.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p>No pending approvals</p>
          <p className="text-sm mt-1">All time entries have been reviewed</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {pendingEntries.map(entry => (
            <div key={entry.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02]">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-800 dark:text-white">
                      {entry.name}
                    </p>
                    <Badge color="warning">Pending</Badge>
                  </div>

                  {editingId === entry.id ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-3 items-center">
                        <input
                          type="time"
                          value={editedTimes?.clockIn || entry.clockIn}
                          onChange={(e) => setEditedTimes(prev => ({
                            clockIn: e.target.value,
                            clockOut: prev?.clockOut || entry.clockOut || ''
                          }))}
                          className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-500 dark:text-gray-400">to</span>
                        <input
                          type="time"
                          value={editedTimes?.clockOut || entry.clockOut}
                          onChange={(e) => setEditedTimes(prev => ({
                            clockIn: prev?.clockIn || entry.clockIn || '',
                            clockOut: e.target.value
                          }))}
                          className="rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(
                            entry.id,
                            editedTimes?.clockIn || entry.clockIn || '',
                            editedTimes?.clockOut || entry.clockOut || ''
                          )}
                          className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-sm hover:bg-brand-700 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditedTimes(null);
                          }}
                          className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Clock In:</span>
                        <span>{entry.clockIn}</span>
                        <span className="text-gray-400 dark:text-gray-600">→</span>
                        <span className="font-medium">Clock Out:</span>
                        <span>{entry.clockOut}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Total: </span>
                          <span className="font-medium text-gray-800 dark:text-white">{entry.totalHours}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Lunch: </span>
                          <span className="font-medium text-gray-800 dark:text-white">-0.5h</span>
                        </div>
                        <div>
                          <span className="text-success-600 dark:text-success-400 font-semibold">Paid: </span>
                          <span className="text-success-600 dark:text-success-400 font-semibold">{entry.paidHours}h</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {editingId !== entry.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(entry.id)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                      title="Edit times"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleApprove(entry.id)}
                      className="px-4 py-2 bg-success-500 text-white rounded-lg text-sm hover:bg-success-600 flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt("Reason for rejection:");
                        if (reason) handleReject(entry.id, reason);
                      }}
                      className="px-4 py-2 bg-error-500 text-white rounded-lg text-sm hover:bg-error-600 flex items-center gap-1.5 transition-colors"
                    >
                      <CloseLineIcon className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
