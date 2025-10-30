"use client";
import React, { useState } from "react";
import { CheckCircleIcon, CloseIcon } from "@/icons";
import { exportToCSV } from "@/utils/exportUtils";

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  services: number;
}

export const RevenueAnalytics = () => {
  const [timeframe, setTimeframe] = useState<string>("6months");
  const [selectedMonth, setSelectedMonth] = useState<RevenueData | null>(null); // GAP-024: Modal state

  const allRevenueData: RevenueData[] = [
    { month: "Jan 2024", revenue: 15500, expenses: 8200, profit: 7300, services: 89 },
    { month: "Feb 2024", revenue: 17200, expenses: 9100, profit: 8100, services: 102 },
    { month: "Mar 2024", revenue: 19800, expenses: 10500, profit: 9300, services: 118 },
    { month: "Apr 2024", revenue: 22100, expenses: 11200, profit: 10900, services: 131 },
    { month: "May 2024", revenue: 24500, expenses: 12800, profit: 11700, services: 145 },
    { month: "Jun 2024", revenue: 26300, expenses: 13500, profit: 12800, services: 158 },
    { month: "Jul 2024", revenue: 28900, expenses: 14200, profit: 14700, services: 172 },
    { month: "Aug 2024", revenue: 31200, expenses: 15100, profit: 16100, services: 186 },
    { month: "Sep 2024", revenue: 29800, expenses: 14800, profit: 15000, services: 178 },
    { month: "Oct 2024", revenue: 32500, expenses: 16200, profit: 16300, services: 195 },
    { month: "Nov 2024", revenue: 34100, expenses: 17000, profit: 17100, services: 203 },
    { month: "Dec 2024", revenue: 37800, expenses: 18500, profit: 19300, services: 225 }
  ];

  // GAP-023: Filter data based on timeframe selection
  const getMonthsToShow = () => {
    switch (timeframe) {
      case "3months": return 3;
      case "6months": return 6;
      case "12months": return 12;
      default: return 6;
    }
  };

  const revenueData = allRevenueData.slice(-getMonthsToShow());

  const currentMonthData = revenueData[revenueData.length - 1];
  const previousMonthData = revenueData[revenueData.length - 2];

  const revenueGrowth = ((currentMonthData.revenue - previousMonthData.revenue) / previousMonthData.revenue * 100).toFixed(1);
  const profitGrowth = ((currentMonthData.profit - previousMonthData.profit) / previousMonthData.profit * 100).toFixed(1);

  const totalRevenue = revenueData.reduce((sum, data) => sum + data.revenue, 0);
  const totalExpenses = revenueData.reduce((sum, data) => sum + data.expenses, 0);
  const totalProfit = revenueData.reduce((sum, data) => sum + data.profit, 0);
  const totalServices = revenueData.reduce((sum, data) => sum + data.services, 0);

  const avgRevenuePerService = totalRevenue / totalServices;

  const serviceTypes = [
    { name: "House Cleaning", revenue: 145200, percentage: 38.4, color: "bg-blue-500" },
    { name: "Office Cleaning", revenue: 126800, percentage: 33.6, color: "bg-green-500" },
    { name: "Deep Cleaning", revenue: 67300, percentage: 17.8, color: "bg-purple-500" },
    { name: "Window Cleaning", revenue: 25100, percentage: 6.6, color: "bg-yellow-500" },
    { name: "Carpet Cleaning", revenue: 13600, percentage: 3.6, color: "bg-red-500" }
  ];

  const handleExportReport = () => {
    // Prepare revenue data for export
    const exportData = revenueData.map(data => ({
      Month: data.month,
      Revenue: `$${data.revenue.toLocaleString()}`,
      Expenses: `$${data.expenses.toLocaleString()}`,
      Profit: `$${data.profit.toLocaleString()}`,
      "Services Completed": data.services,
      "Avg Revenue per Service": `$${(data.revenue / data.services).toFixed(2)}`,
    }));

    const filename = `revenue_report_${timeframe}_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(exportData, filename);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Revenue Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track revenue trends and financial performance
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          >
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="12months">Last 12 Months</option>
          </select>
          <button
            onClick={handleExportReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +{revenueGrowth}% from last month
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Profit
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalProfit.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +{profitGrowth}% from last month
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg per Service
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${Math.round(avgRevenuePerService)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {totalServices} total services
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Profit Margin
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round((totalProfit / totalRevenue) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Industry avg: 15%
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Trend
          </h3>
          <div className="space-y-4">
            {revenueData.map((data, index) => {
              const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
              const barWidth = (data.revenue / maxRevenue) * 100;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
                    {data.month.split(' ')[0]}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                    <div
                      className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Revenue Breakdown */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue by Service Type
          </h3>
          <div className="space-y-4">
            {serviceTypes.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${service.color}`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${service.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {service.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monthly Breakdown
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {revenueData.map((data, index) => (
                <tr
                  key={index}
                  onClick={() => setSelectedMonth(data)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-colors"
                  title="Click to view detailed breakdown"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {data.month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${data.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${data.expenses.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                    ${data.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {data.services}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {Math.round((data.profit / data.revenue) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GAP-024: Monthly Detail Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedMonth.month} - Detailed Breakdown
              </h2>
              <button
                onClick={() => setSelectedMonth(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    ${selectedMonth.revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    ${Math.round(selectedMonth.revenue / selectedMonth.services).toLocaleString()} per service
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Net Profit</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    ${selectedMonth.profit.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {Math.round((selectedMonth.profit / selectedMonth.revenue) * 100)}% margin
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                    ${selectedMonth.expenses.toLocaleString()}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    ${Math.round(selectedMonth.expenses / selectedMonth.services).toLocaleString()} per service
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Services Completed</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {selectedMonth.services}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Total jobs completed
                  </p>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Estimated Expense Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Labor Costs</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${Math.round(selectedMonth.expenses * 0.60).toLocaleString()} (60%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Supplies & Equipment</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${Math.round(selectedMonth.expenses * 0.20).toLocaleString()} (20%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transportation</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${Math.round(selectedMonth.expenses * 0.10).toLocaleString()} (10%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Other Operating Costs</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${Math.round(selectedMonth.expenses * 0.10).toLocaleString()} (10%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Performance Metrics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Revenue/Service</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${Math.round(selectedMonth.revenue / selectedMonth.services)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg Profit/Service</p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ${Math.round(selectedMonth.profit / selectedMonth.services)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Revenue Growth</p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {revenueData.indexOf(selectedMonth) > 0
                        ? `${((selectedMonth.revenue - revenueData[revenueData.indexOf(selectedMonth) - 1].revenue) / revenueData[revenueData.indexOf(selectedMonth) - 1].revenue * 100).toFixed(1)}%`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Profit Margin</p>
                    <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                      {Math.round((selectedMonth.profit / selectedMonth.revenue) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedMonth(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};