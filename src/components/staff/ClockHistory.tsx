"use client";
import { CheckCircleIcon, TimeIcon, CloseLineIcon } from "@/icons";

interface ClockEntry {
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  paidHours: number;
  lunchDeduction: number;
  status: "approved" | "pending" | "rejected";
  approvedBy?: string;
  notes?: string;
}

const mockEntries: ClockEntry[] = [
  {
    date: "Oct 25",
    clockIn: "8:00 AM",
    clockOut: "4:30 PM",
    hours: 8.0,
    paidHours: 7.5,
    lunchDeduction: 0.5,
    status: "approved",
    approvedBy: "Manager",
  },
  {
    date: "Oct 24",
    clockIn: "8:15 AM",
    clockOut: "4:15 PM",
    hours: 7.5,
    paidHours: 7.0,
    lunchDeduction: 0.5,
    status: "approved",
    approvedBy: "Manager",
  },
  {
    date: "Oct 23",
    clockIn: "8:00 AM",
    clockOut: "4:00 PM",
    hours: 7.5,
    paidHours: 7.0,
    lunchDeduction: 0.5,
    status: "pending",
  },
  {
    date: "Oct 22",
    clockIn: "7:45 AM",
    clockOut: "4:15 PM",
    hours: 8.0,
    paidHours: 7.5,
    lunchDeduction: 0.5,
    status: "approved",
    approvedBy: "Manager",
  },
  {
    date: "Oct 21",
    clockIn: "8:30 AM",
    clockOut: "4:30 PM",
    hours: 7.5,
    paidHours: 7.0,
    lunchDeduction: 0.5,
    status: "approved",
    approvedBy: "Manager",
  },
];

export const ClockHistory = () => {
  const getStatusBadge = (entry: ClockEntry) => {
    switch (entry.status) {
      case "approved":
        return (
          <div className="flex items-center gap-1">
            <CheckCircleIcon className="h-4 w-4 text-success-600 dark:text-success-400" />
            <span className="text-xs font-medium text-success-600 dark:text-success-400">
              Approved
            </span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1">
            <TimeIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
              Pending
            </span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1">
            <CloseLineIcon className="h-4 w-4 text-error-600 dark:text-error-400" />
            <span className="text-xs font-medium text-error-600 dark:text-error-400">
              Rejected
            </span>
          </div>
        );
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Entries
      </h2>

      <div className="space-y-3">
        {mockEntries.map((entry, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 transition-colors ${
              entry.status === "approved"
                ? "border-success-200 bg-success-50/30 dark:border-success-900 dark:bg-success-900/10"
                : entry.status === "pending"
                ? "border-orange-200 bg-orange-50/30 dark:border-orange-900 dark:bg-orange-900/10"
                : "border-error-200 bg-error-50/30 dark:border-error-900 dark:bg-error-900/10"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {entry.date}
                  </div>
                  {getStatusBadge(entry)}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TimeIcon className="h-4 w-4" />
                    <span>
                      {entry.clockIn} - {entry.clockOut}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>Total: {entry.hours}h</span>
                    <span>Lunch: -{entry.lunchDeduction}h</span>
                    <span className="font-semibold text-success-600 dark:text-success-400">
                      Paid: {entry.paidHours}h
                    </span>
                  </div>
                </div>

                {entry.approvedBy && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Approved by {entry.approvedBy}
                  </div>
                )}

                {entry.notes && (
                  <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 italic">
                    Note: {entry.notes}
                  </div>
                )}
              </div>

              <div className="ml-4 text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
                  {entry.paidHours}h
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">This Week</div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900 dark:text-white">Total Paid Hours</span>
          <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">
            {mockEntries.reduce((sum, entry) => sum + entry.paidHours, 0).toFixed(1)}h
          </span>
        </div>
      </div>
    </div>
  );
};
