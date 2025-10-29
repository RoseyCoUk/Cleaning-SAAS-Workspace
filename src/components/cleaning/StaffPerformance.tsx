"use client";
import React, { useState } from "react";
import { CheckCircleIcon } from "@/icons";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stats: {
    servicesCompleted: number;
    hoursWorked: number;
    customerRating: number;
    revenue: number;
    efficiency: number;
    onTimeRate: number;
  };
  recentPerformance: {
    month: string;
    services: number;
    hours: number;
    rating: number;
  }[];
}

export const StaffPerformance = () => {
  const [timeframe, setTimeframe] = useState<string>("month");
  const [sortBy, setSortBy] = useState<string>("rating");

  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "Senior Cleaner",
      avatar: "/avatars/sarah.jpg",
      stats: {
        servicesCompleted: 89,
        hoursWorked: 156,
        customerRating: 4.9,
        revenue: 12450,
        efficiency: 94,
        onTimeRate: 98
      },
      recentPerformance: [
        { month: "Oct", services: 28, hours: 52, rating: 4.8 },
        { month: "Nov", services: 32, hours: 56, rating: 4.9 },
        { month: "Dec", services: 29, hours: 48, rating: 4.9 }
      ]
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      role: "Commercial Specialist",
      avatar: "/avatars/mike.jpg",
      stats: {
        servicesCompleted: 76,
        hoursWorked: 168,
        customerRating: 4.7,
        revenue: 15200,
        efficiency: 88,
        onTimeRate: 95
      },
      recentPerformance: [
        { month: "Oct", services: 24, hours: 58, rating: 4.6 },
        { month: "Nov", services: 26, hours: 62, rating: 4.7 },
        { month: "Dec", services: 26, hours: 48, rating: 4.8 }
      ]
    },
    {
      id: "3",
      name: "Emily Chen",
      role: "Residential Cleaner",
      avatar: "/avatars/emily.jpg",
      stats: {
        servicesCompleted: 94,
        hoursWorked: 142,
        customerRating: 4.8,
        revenue: 10800,
        efficiency: 92,
        onTimeRate: 96
      },
      recentPerformance: [
        { month: "Oct", services: 30, hours: 48, rating: 4.7 },
        { month: "Nov", services: 34, hours: 46, rating: 4.8 },
        { month: "Dec", services: 30, hours: 48, rating: 4.9 }
      ]
    },
    {
      id: "4",
      name: "David Wilson",
      role: "Deep Clean Specialist",
      avatar: "/avatars/david.jpg",
      stats: {
        servicesCompleted: 52,
        hoursWorked: 134,
        customerRating: 4.6,
        revenue: 8900,
        efficiency: 85,
        onTimeRate: 92
      },
      recentPerformance: [
        { month: "Oct", services: 16, hours: 45, rating: 4.5 },
        { month: "Nov", services: 18, hours: 44, rating: 4.6 },
        { month: "Dec", services: 18, hours: 45, rating: 4.7 }
      ]
    },
    {
      id: "5",
      name: "Lisa Martinez",
      role: "Team Lead",
      avatar: "/avatars/lisa.jpg",
      stats: {
        servicesCompleted: 67,
        hoursWorked: 148,
        customerRating: 4.9,
        revenue: 11300,
        efficiency: 96,
        onTimeRate: 99
      },
      recentPerformance: [
        { month: "Oct", services: 22, hours: 48, rating: 4.8 },
        { month: "Nov", services: 23, hours: 52, rating: 4.9 },
        { month: "Dec", services: 22, hours: 48, rating: 5.0 }
      ]
    }
  ];

  const sortedStaff = [...staffMembers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.stats.customerRating - a.stats.customerRating;
      case "services":
        return b.stats.servicesCompleted - a.stats.servicesCompleted;
      case "revenue":
        return b.stats.revenue - a.stats.revenue;
      case "efficiency":
        return b.stats.efficiency - a.stats.efficiency;
      default:
        return 0;
    }
  });

  const totalServices = staffMembers.reduce((sum, staff) => sum + staff.stats.servicesCompleted, 0);
  const avgRating = staffMembers.reduce((sum, staff) => sum + staff.stats.customerRating, 0) / staffMembers.length;
  const totalRevenue = staffMembers.reduce((sum, staff) => sum + staff.stats.revenue, 0);
  const avgEfficiency = staffMembers.reduce((sum, staff) => sum + staff.stats.efficiency, 0) / staffMembers.length;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (rating >= 4.5) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (efficiency >= 80) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Staff Performance
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor team performance and productivity metrics
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
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
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
                Total Services
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalServices}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Across {staffMembers.length} staff members
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
                Avg Rating
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {avgRating.toFixed(1)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Out of 5.0 stars
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
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Generated by team
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
                Avg Efficiency
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round(avgEfficiency)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Team average
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Sort by:</span>
          {[
            { value: "rating", label: "Rating" },
            { value: "services", label: "Services" },
            { value: "revenue", label: "Revenue" },
            { value: "efficiency", label: "Efficiency" }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  On-Time Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedStaff.map((staff, index) => (
                <tr key={staff.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {staff.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {staff.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {staff.stats.servicesCompleted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {staff.stats.hoursWorked}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRatingColor(staff.stats.customerRating)}`}>
                      {staff.stats.customerRating.toFixed(1)} ★
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${staff.stats.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEfficiencyColor(staff.stats.efficiency)}`}>
                      {staff.stats.efficiency}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {staff.stats.onTimeRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performers - Monthly Trends
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sortedStaff.slice(0, 3).map((staff, index) => (
            <div key={staff.id} className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {staff.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {staff.stats.customerRating.toFixed(1)} ★ rating
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {staff.recentPerformance.map((perf, perfIndex) => (
                  <div key={perfIndex} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{perf.month}</span>
                    <div className="flex space-x-4">
                      <span className="text-gray-900 dark:text-white">{perf.services} services</span>
                      <span className="text-green-600 dark:text-green-400">{perf.rating} ★</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};