"use client";
import React from "react";
import { CloseIcon, CalenderIcon, TimeIcon, DollarLineIcon } from "@/icons";

interface DailyHours {
  date: string;
  day: string;
  hours: number;
  jobs: number;
}

export interface PayrollDetail {
  dateRange: string;
  hoursWorked: number;
  jobsCompleted: number;
  hourlyRate: number;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: "pending" | "paid";
  dailyBreakdown: DailyHours[];
}

interface PayrollDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollDetail;
}

export const PayrollDetailModal: React.FC<PayrollDetailModalProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Payroll Details</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{payroll.dateRange}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-lg border border-brand-200 dark:border-brand-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TimeIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Hours</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{payroll.hoursWorked}h</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{payroll.jobsCompleted} jobs completed</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarLineIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Net Pay</span>
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${payroll.netPay.toFixed(2)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      payroll.status === "paid"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {payroll.status === "paid" ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Pay Breakdown</h3>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Hours Worked:</span>
                <span className="font-medium text-gray-900 dark:text-white">{payroll.hoursWorked}h</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                <span className="font-medium text-gray-900 dark:text-white">${payroll.hourlyRate.toFixed(2)}/hr</span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Gross Pay:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${payroll.grossPay.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Deductions (Lunch -30min):</span>
                <span className="font-medium text-red-600 dark:text-red-400">-${payroll.deductions.toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Net Pay:</span>
                  <span className="text-xl font-bold text-brand-600 dark:text-brand-400">${payroll.netPay.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Daily Breakdown</h3>
              <div className="space-y-2">
                {payroll.dailyBreakdown.map((day, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalenderIcon className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{day.day}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{day.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{day.hours}h</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{day.jobs} jobs</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gray-200 dark:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
