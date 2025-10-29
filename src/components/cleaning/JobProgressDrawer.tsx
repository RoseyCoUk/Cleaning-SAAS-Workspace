"use client";
import React, { useState, useEffect } from "react";
import { TimeIcon, GroupIcon, CheckCircleIcon, CloseIcon } from "@/icons";

export interface JobProgress {
  appointmentId: string;
  arrivalTime?: string; // ISO string for consistent parsing
  departureTime?: string; // ISO string for consistent parsing
  actualDuration?: number; // minutes
  crewCount?: number;
  completionNotes?: string;
  status: "scheduled" | "en-route" | "on-site" | "completed";
}

interface JobProgressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    clientName: string;
    time: string;
    address: string;
    serviceType: string;
  };
  initialProgress?: JobProgress; // ← NEW: existing progress to hydrate
  onSave: (progress: JobProgress) => void;
}

export const JobProgressDrawer: React.FC<JobProgressDrawerProps> = ({
  isOpen,
  onClose,
  appointment,
  initialProgress,
  onSave,
}) => {
  const [progress, setProgress] = useState<JobProgress>({
    appointmentId: appointment.id,
    status: "scheduled",
    crewCount: 4, // Default crew count
  });

  // Hydrate state when initialProgress changes (reopening with saved data)
  useEffect(() => {
    if (initialProgress) {
      setProgress(initialProgress);
    } else {
      // Reset to defaults when no initial progress
      setProgress({
        appointmentId: appointment.id,
        status: "scheduled",
        crewCount: 4,
      });
    }
  }, [appointment.id, initialProgress]);

  // Format ISO timestamp for display (e.g., "09:15 AM")
  const formatTimeForDisplay = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkArrived = () => {
    const now = new Date();
    const isoString = now.toISOString(); // Store as ISO for consistent parsing
    setProgress(prev => ({
      ...prev,
      arrivalTime: isoString,
      status: "on-site",
    }));
  };

  const handleMarkDeparted = () => {
    const now = new Date();
    const isoString = now.toISOString();

    // Calculate duration if arrival time exists
    let duration: number | undefined;
    if (progress.arrivalTime) {
      const arrival = new Date(progress.arrivalTime); // Parse ISO string directly
      const departure = new Date(isoString);
      duration = Math.round((departure.getTime() - arrival.getTime()) / 60000); // minutes
    }

    setProgress(prev => ({
      ...prev,
      departureTime: isoString,
      actualDuration: duration,
      status: "completed",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl dark:bg-gray-950">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Job Progress</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="mt-2">
              <div className="font-medium text-gray-800 dark:text-white">{appointment.clientName}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.address}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.serviceType}</div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Status Indicator */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {["scheduled", "en-route", "on-site", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setProgress(prev => ({ ...prev, status: status as JobProgress["status"] }))}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      progress.status === status
                        ? "bg-brand-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Arrival Time */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Arrival Time</label>
              {progress.arrivalTime ? (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <TimeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {formatTimeForDisplay(progress.arrivalTime)}
                    </span>
                  </div>
                  <CheckCircleIcon className="h-5 w-5 text-success-600" />
                </div>
              ) : (
                <button
                  onClick={handleMarkArrived}
                  className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-3 text-white hover:bg-brand-700 transition-colors"
                >
                  Mark Arrived
                </button>
              )}
            </div>

            {/* Departure Time */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Departure Time</label>
              {progress.departureTime ? (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex items-center gap-2">
                    <TimeIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {formatTimeForDisplay(progress.departureTime)}
                    </span>
                  </div>
                  <CheckCircleIcon className="h-5 w-5 text-success-600" />
                </div>
              ) : (
                <button
                  onClick={handleMarkDeparted}
                  disabled={!progress.arrivalTime}
                  className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-3 text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Mark Departed
                </button>
              )}
              {!progress.arrivalTime && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Must mark arrival first
                </p>
              )}
            </div>

            {/* Actual Duration (auto-calculated) */}
            {progress.actualDuration !== undefined && (
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Actual Duration</label>
                <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                  <div className="text-2xl font-bold text-gray-800 dark:text-white">
                    {Math.floor(progress.actualDuration / 60)}h {progress.actualDuration % 60}m
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Auto-calculated from arrival to departure
                  </div>
                </div>
              </div>
            )}

            {/* Crew Count */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Crew Count</label>
              <div className="mt-2 flex items-center gap-3">
                <GroupIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={progress.crewCount || 4}
                  onChange={(e) => setProgress(prev => ({
                    ...prev,
                    crewCount: Number(e.target.value)
                  }))}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">employees</span>
              </div>
            </div>

            {/* Completion Notes */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Completion Notes</label>
              <textarea
                value={progress.completionNotes || ""}
                onChange={(e) => setProgress(prev => ({
                  ...prev,
                  completionNotes: e.target.value
                }))}
                placeholder="Any issues, delays, or special notes..."
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onSave(progress);
                  onClose();
                }}
                className="flex-1 rounded-lg bg-brand-600 py-3 text-white hover:bg-brand-700 transition-colors font-medium"
              >
                Save Progress
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-gray-200 dark:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
