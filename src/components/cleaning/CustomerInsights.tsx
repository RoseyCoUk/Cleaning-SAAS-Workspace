"use client";
import React, { useState } from "react";
import { CheckCircleIcon } from "@/icons";

interface CustomerSegment {
  name: string;
  count: number;
  percentage: number;
  avgValue: number;
  color: string;
}

interface CustomerMetric {
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  churned: number;
  avgLifetimeValue: number;
  avgMonthlyValue: number;
  retentionRate: number;
  satisfactionScore: number;
}

export const CustomerInsights = () => {
  const [timeframe, setTimeframe] = useState<string>("month");

  const metrics: CustomerMetric = {
    totalCustomers: 248,
    activeCustomers: 187,
    newCustomers: 23,
    churned: 8,
    avgLifetimeValue: 2847,
    avgMonthlyValue: 285,
    retentionRate: 89.5,
    satisfactionScore: 4.7
  };

  const customerSegments: CustomerSegment[] = [
    {
      name: "Premium Clients",
      count: 45,
      percentage: 18.1,
      avgValue: 650,
      color: "bg-purple-500"
    },
    {
      name: "Regular Customers",
      count: 98,
      percentage: 39.5,
      avgValue: 320,
      color: "bg-blue-500"
    },
    {
      name: "Occasional Users",
      count: 72,
      percentage: 29.0,
      avgValue: 180,
      color: "bg-green-500"
    },
    {
      name: "New Customers",
      count: 33,
      percentage: 13.3,
      avgValue: 145,
      color: "bg-yellow-500"
    }
  ];

  const topCustomers = [
    {
      id: "1",
      name: "Johnson Corporation",
      type: "Commercial",
      totalSpent: 12500,
      lastService: "Dec 20, 2024",
      services: 24,
      rating: 4.9,
      status: "active"
    },
    {
      id: "2",
      name: "Smith Family",
      type: "Residential",
      totalSpent: 8900,
      lastService: "Dec 18, 2024",
      services: 31,
      rating: 4.8,
      status: "active"
    },
    {
      id: "3",
      name: "Downtown Office Complex",
      type: "Commercial",
      totalSpent: 15600,
      lastService: "Dec 19, 2024",
      services: 18,
      rating: 4.7,
      status: "active"
    },
    {
      id: "4",
      name: "Brown Residence",
      type: "Residential",
      totalSpent: 6700,
      lastService: "Dec 15, 2024",
      services: 22,
      rating: 4.9,
      status: "active"
    },
    {
      id: "5",
      name: "Tech Startup Office",
      type: "Commercial",
      totalSpent: 9800,
      lastService: "Dec 21, 2024",
      services: 15,
      rating: 4.6,
      status: "active"
    }
  ];

  const allSatisfactionTrends = [
    { month: "Jan", score: 4.3, week: 1, day: "Dec 23" },
    { month: "Feb", score: 4.4, week: 2, day: "Dec 24" },
    { month: "Mar", score: 4.4, week: 3, day: "Dec 25" },
    { month: "Apr", score: 4.5, week: 4, day: "Dec 26" },
    { month: "May", score: 4.5, week: 5, day: "Dec 27" },
    { month: "Jun", score: 4.5, week: 6, day: "Dec 28" },
    { month: "Jul", score: 4.5, week: 7, day: "Dec 29" },
    { month: "Aug", score: 4.6, week: 8, day: "Jan 1" },
    { month: "Sep", score: 4.6, week: 9, day: "Jan 2" },
    { month: "Oct", score: 4.7, week: 10, day: "Jan 3" },
    { month: "Nov", score: 4.7, week: 11, day: "Jan 4" },
    { month: "Dec", score: 4.7, week: 12, day: "Jan 5" }
  ];

  // GAP-023: Filter satisfaction trends based on timeframe
  const getSatisfactionTrends = () => {
    switch (timeframe) {
      case "week":
        // Show last 7 days
        return allSatisfactionTrends.slice(-7).map(t => ({ month: t.day, score: t.score }));
      case "month":
        // Show last 4 weeks
        return allSatisfactionTrends.slice(-4).map(t => ({ month: `Week ${t.week}`, score: t.score }));
      case "quarter":
        // Show last 3 months
        return allSatisfactionTrends.slice(-3).map(t => ({ month: t.month, score: t.score }));
      case "year":
        // Show all 12 months
        return allSatisfactionTrends.map(t => ({ month: t.month, score: t.score }));
      default:
        return allSatisfactionTrends.slice(-6).map(t => ({ month: t.month, score: t.score }));
    }
  };

  const satisfactionTrends = getSatisfactionTrends();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "inactive":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "churned":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (rating >= 4.5) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analyze customer behavior and satisfaction metrics
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Customers
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics.totalCustomers}
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                +{metrics.newCustomers} this month
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
                Active Customers
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.activeCustomers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {Math.round((metrics.activeCustomers / metrics.totalCustomers) * 100)}% of total
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
                Avg Lifetime Value
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${metrics.avgLifetimeValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                ${metrics.avgMonthlyValue}/month avg
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
                Retention Rate
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {metrics.retentionRate}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {metrics.satisfactionScore}/5.0 satisfaction
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Segments and Satisfaction Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Segments
          </h3>
          <div className="space-y-4">
            {customerSegments.map((segment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {segment.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {segment.count} customers ({segment.percentage}%)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    ${segment.avgValue}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    avg monthly
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Satisfaction Trend */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Satisfaction Trend
          </h3>
          <div className="space-y-4">
            {satisfactionTrends.map((trend, index) => {
              const maxScore = 5;
              const barWidth = (trend.score / maxScore) * 100;
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 text-sm text-gray-600 dark:text-gray-400">
                    {trend.month}
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                    <div
                      className="bg-yellow-500 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${barWidth}%` }}
                    >
                      <span className="text-white text-xs font-medium">
                        {trend.score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Current satisfaction score: <span className="font-bold">{metrics.satisfactionScore}/5.0</span>
            </p>
          </div>
        </div>
      </div>

      {/* Top Customers Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Customers
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {customer.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.services}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(customer.rating)}`}>
                      {customer.rating} ★
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {customer.lastService}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Customer Acquisition
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Referrals</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">65%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Online Search</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">25%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Social Media</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">10%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Churn Risk Analysis
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-red-800 dark:text-red-200">High Risk</span>
                <span className="text-sm font-bold text-red-800 dark:text-red-200">12 customers</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                No service in 45+ days
              </p>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Medium Risk</span>
                <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">28 customers</span>
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Declining frequency
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-green-800 dark:text-green-200">Low Risk</span>
                <span className="text-sm font-bold text-green-800 dark:text-green-200">208 customers</span>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Regular engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};