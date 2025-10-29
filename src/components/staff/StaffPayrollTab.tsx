"use client";
import React, { useState } from "react";
import { DollarLineIcon, TimeIcon, CheckCircleIcon } from "@/icons";
import { PayrollDetailModal, PayrollDetail } from "./PayrollDetailModal";

interface PayrollEntry {
  date: string;
  hoursWorked: number;
  jobsCompleted: number;
  grossPay: number;
  status: "pending" | "paid";
}

// Sample payroll data
const payrollData: PayrollEntry[] = [
  {
    date: "Dec 16-22, 2024",
    hoursWorked: 38.5,
    jobsCompleted: 18,
    grossPay: 962.50,
    status: "paid",
  },
  {
    date: "Dec 9-15, 2024",
    hoursWorked: 40,
    jobsCompleted: 20,
    grossPay: 1000,
    status: "paid",
  },
  {
    date: "Dec 2-8, 2024",
    hoursWorked: 36,
    jobsCompleted: 17,
    grossPay: 900,
    status: "paid",
  },
];

// Detailed payroll data for modal
const detailedPayrollData: Record<string, PayrollDetail> = {
  "Dec 16-22, 2024": {
    dateRange: "Dec 16-22, 2024",
    hoursWorked: 38.5,
    jobsCompleted: 18,
    hourlyRate: 25.00,
    grossPay: 962.50,
    deductions: 12.50,
    netPay: 950.00,
    status: "paid",
    dailyBreakdown: [
      { date: "Dec 16", day: "Monday", hours: 7.5, jobs: 4 },
      { date: "Dec 17", day: "Tuesday", hours: 8.0, jobs: 4 },
      { date: "Dec 18", day: "Wednesday", hours: 7.0, jobs: 3 },
      { date: "Dec 19", day: "Thursday", hours: 8.0, jobs: 4 },
      { date: "Dec 20", day: "Friday", hours: 8.0, jobs: 3 },
    ],
  },
  "Dec 9-15, 2024": {
    dateRange: "Dec 9-15, 2024",
    hoursWorked: 40,
    jobsCompleted: 20,
    hourlyRate: 25.00,
    grossPay: 1000,
    deductions: 12.50,
    netPay: 987.50,
    status: "paid",
    dailyBreakdown: [
      { date: "Dec 9", day: "Monday", hours: 8.0, jobs: 4 },
      { date: "Dec 10", day: "Tuesday", hours: 8.0, jobs: 4 },
      { date: "Dec 11", day: "Wednesday", hours: 8.0, jobs: 4 },
      { date: "Dec 12", day: "Thursday", hours: 8.0, jobs: 4 },
      { date: "Dec 13", day: "Friday", hours: 8.0, jobs: 4 },
    ],
  },
  "Dec 2-8, 2024": {
    dateRange: "Dec 2-8, 2024",
    hoursWorked: 36,
    jobsCompleted: 17,
    hourlyRate: 25.00,
    grossPay: 900,
    deductions: 12.50,
    netPay: 887.50,
    status: "paid",
    dailyBreakdown: [
      { date: "Dec 2", day: "Monday", hours: 7.5, jobs: 3 },
      { date: "Dec 3", day: "Tuesday", hours: 7.5, jobs: 4 },
      { date: "Dec 4", day: "Wednesday", hours: 7.0, jobs: 3 },
      { date: "Dec 5", day: "Thursday", hours: 7.0, jobs: 4 },
      { date: "Dec 6", day: "Friday", hours: 7.0, jobs: 3 },
    ],
  },
};

// Current period stats
const currentPeriod = {
  hoursWorked: 24.5,
  jobsCompleted: 12,
  estimatedPay: 612.50,
  periodEnd: "Dec 29, 2024",
};

export const StaffPayrollTab = () => {
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenPayrollDetail = (dateRange: string) => {
    const detail = detailedPayrollData[dateRange];
    if (detail) {
      setSelectedPayroll(detail);
      setModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Period Summary */}
      <div className="bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-lg border border-brand-200 dark:border-brand-800 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Current Pay Period</h3>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <TimeIcon className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Hours</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPeriod.hoursWorked}h</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <CheckCircleIcon className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Jobs</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{currentPeriod.jobsCompleted}</p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <DollarLineIcon className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-600 dark:text-gray-400">Est. Pay</span>
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">${currentPeriod.estimatedPay}</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Pay period ends: {currentPeriod.periodEnd}
        </p>
      </div>

      {/* Payroll History */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payroll History</h3>
        <div className="space-y-3">
          {payrollData.map((entry, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleOpenPayrollDetail(entry.date)}
              className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{entry.date}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    <span>{entry.hoursWorked}h worked</span>
                    <span>•</span>
                    <span>{entry.jobsCompleted} jobs</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    ${entry.grossPay.toFixed(2)}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      entry.status === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                    }`}
                  >
                    {entry.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400">Click for details →</p>
            </button>
          ))}
        </div>
      </div>

      {/* Hourly Rate Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Your Hourly Rate:</span>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">$25.00/hr</span>
        </div>
      </div>

      {/* Payroll Detail Modal */}
      {selectedPayroll && (
        <PayrollDetailModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedPayroll(null);
          }}
          payroll={selectedPayroll}
        />
      )}
    </div>
  );
};
