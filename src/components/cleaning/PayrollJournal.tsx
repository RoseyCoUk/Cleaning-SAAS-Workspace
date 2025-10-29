"use client";
import React, { useState } from "react";
import { FileIcon } from "@/icons";
import { exportToCSV, prepareDataForExport } from "@/utils/exportUtils";

interface PayrollEntry {
  id: string;
  employeeName: string;
  period: string;
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  hourlyRate: number;  // Base rate
  effectiveRate?: number;  // Actual rate used (may differ if override active)
  rateOverride?: boolean;  // Flag to show if override was applied
  regularPay: number;
  overtimePay: number;
  grossPay: number;
}

export const PayrollJournal = () => {
  const [period, setPeriod] = useState("current_week");
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" });

  const [payrollData] = useState<PayrollEntry[]>([
    {
      id: "1",
      employeeName: "Maria Garcia",
      period: "Dec 16-22",
      regularHours: 40,
      overtimeHours: 5,
      totalHours: 45,
      hourlyRate: 18,
      regularPay: 720,
      overtimePay: 135,
      grossPay: 855,
    },
    {
      id: "2",
      employeeName: "John Davis",
      period: "Dec 16-22",
      regularHours: 38,
      overtimeHours: 0,
      totalHours: 38,
      hourlyRate: 18,  // Base rate
      effectiveRate: 19,  // Temporary rate override
      rateOverride: true,
      regularPay: 722,  // 38 * 19 = 722
      overtimePay: 0,
      grossPay: 722,
    },
    {
      id: "3",
      employeeName: "Anna Smith",
      period: "Dec 16-22",
      regularHours: 40,
      overtimeHours: 8,
      totalHours: 48,
      hourlyRate: 20,
      regularPay: 800,
      overtimePay: 240,
      grossPay: 1040,
    },
    {
      id: "4",
      employeeName: "Mike Wilson",
      period: "Dec 16-22",
      regularHours: 32,
      overtimeHours: 0,
      totalHours: 32,
      hourlyRate: 17,
      regularPay: 544,
      overtimePay: 0,
      grossPay: 544,
    },
    {
      id: "5",
      employeeName: "Sarah Lee",
      period: "Dec 16-22",
      regularHours: 40,
      overtimeHours: 2.5,
      totalHours: 42.5,
      hourlyRate: 19,
      regularPay: 760,
      overtimePay: 71.25,
      grossPay: 831.25,
    },
  ]);

  const totals = payrollData.reduce(
    (acc, entry) => ({
      regularHours: acc.regularHours + entry.regularHours,
      overtimeHours: acc.overtimeHours + entry.overtimeHours,
      totalHours: acc.totalHours + entry.totalHours,
      regularPay: acc.regularPay + entry.regularPay,
      overtimePay: acc.overtimePay + entry.overtimePay,
      grossPay: acc.grossPay + entry.grossPay,
    }),
    {
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      regularPay: 0,
      overtimePay: 0,
      grossPay: 0,
    }
  );

  const exportCSV = () => {
    // Prepare data with relevant fields for export
    const exportData = payrollData.map(entry => ({
      Employee: entry.employeeName,
      Period: entry.period,
      "Regular Hours": entry.regularHours,
      "Overtime Hours": entry.overtimeHours,
      "Total Hours": entry.totalHours,
      "Hourly Rate": entry.effectiveRate || entry.hourlyRate,
      "Rate Override": entry.rateOverride ? "Yes" : "No",
      "Regular Pay": `$${entry.regularPay.toFixed(2)}`,
      "Overtime Pay": `$${entry.overtimePay.toFixed(2)}`,
      "Gross Pay": `$${entry.grossPay.toFixed(2)}`,
    }));

    const filename = `payroll_${period}_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(exportData, filename);
  };

  const generateReport = () => {
    // Report generation logic would go here
    alert("Generating payroll report...");
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header with Controls */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payroll Journal
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Period Selector */}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="current_week">Current Week</option>
              <option value="last_week">Last Week</option>
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Export Options */}
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <FileIcon className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Custom Date Range */}
        {period === "custom" && (
          <div className="flex gap-3 mt-4">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <span className="self-center text-gray-500 dark:text-gray-400">to</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Hours</p>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
              {totals.totalHours.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Regular Hours</p>
            <p className="text-2xl font-bold text-green-900 dark:text-green-300">
              {totals.regularHours}
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Overtime</p>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">
              {totals.overtimeHours.toFixed(1)}
            </p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Total Payroll</p>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
              ${totals.grossPay.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Period
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Regular
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  OT
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total Hours
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Rate
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Gross Pay
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {payrollData.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {entry.employeeName}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {entry.period}
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                    {entry.regularHours}
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                    {entry.overtimeHours > 0 ? entry.overtimeHours : "-"}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-medium text-gray-900 dark:text-white">
                    {entry.totalHours}
                  </td>
                  <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                    {entry.rateOverride ? (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500 dark:text-gray-500 line-through">
                          ${entry.hourlyRate}/hr
                        </div>
                        <div className="font-semibold text-orange-600 dark:text-orange-400 flex items-center justify-end gap-1">
                          ${entry.effectiveRate}/hr
                          <span className="text-[10px] px-1 py-0.5 bg-orange-100 dark:bg-orange-900/30 rounded">TEMP</span>
                        </div>
                      </div>
                    ) : (
                      `$${entry.hourlyRate}/hr`
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-right font-bold text-gray-900 dark:text-white">
                    ${entry.grossPay.toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* Totals Row */}
              <tr className="bg-gray-100 dark:bg-gray-800 font-bold">
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">TOTAL</td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                  {totals.regularHours}
                </td>
                <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                  {totals.overtimeHours.toFixed(1)}
                </td>
                <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                  {totals.totalHours.toFixed(1)}
                </td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 text-sm text-right text-gray-900 dark:text-white">
                  ${totals.grossPay.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            View Time Entries
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              Save Draft
            </button>
            <button className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700">
              Approve Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};