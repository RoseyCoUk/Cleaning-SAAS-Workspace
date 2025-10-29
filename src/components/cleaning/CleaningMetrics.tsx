"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, CalenderIcon, GroupIcon, DollarLineIcon, CheckCircleIcon, ShootingStarIcon } from "@/icons";

export const CleaningMetrics = () => {
  // Mock data for one-off cleanings
  const oneOffStats = {
    total: 8,
    deepCleans: 5,
    moveOuts: 2,
    moveIns: 1,
    changeFromLastMonth: 2,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-6">
      {/* Today's Appointments */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl dark:bg-brand-900/20">
          <CalenderIcon className="text-brand-600 size-6 dark:text-brand-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Today&apos;s Cleanings
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              12
            </h4>
            <p className="text-xs text-gray-400 mt-1">3 in progress</p>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            20%
          </Badge>
        </div>
      </div>

      {/* Active Staff */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-fresh-100 rounded-xl dark:bg-fresh-900/20">
          <GroupIcon className="text-fresh-600 size-6 dark:text-fresh-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active Staff
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              8/10
            </h4>
            <p className="text-xs text-gray-400 mt-1">2 on break</p>
          </div>
          <span className="text-sm text-fresh-600 dark:text-fresh-400">
            80%
          </span>
        </div>
      </div>

      {/* Revenue Today */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-xl dark:bg-success-900/20">
          <DollarLineIcon className="text-success-600 size-6 dark:text-success-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Revenue Today
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              $2,845
            </h4>
            <p className="text-xs text-gray-400 mt-1">Target: $2,500</p>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            13.8%
          </Badge>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl dark:bg-orange-900/20">
          <CheckCircleIcon className="text-orange-600 size-6 dark:text-orange-400" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Satisfaction Score
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              4.8/5.0
            </h4>
            <p className="text-xs text-gray-400 mt-1">From 142 reviews</p>
          </div>

          <Badge color="error">
            <ArrowDownIcon className="text-error-500" />
            0.2
          </Badge>
        </div>
      </div>

      {/* One-Off Cleanings This Month */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl dark:bg-purple-900/20">
          <ShootingStarIcon className="text-purple-600 size-6 dark:text-purple-400" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              One-Off Cleanings
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {oneOffStats.total}
            </h4>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            {oneOffStats.changeFromLastMonth}
          </Badge>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Deep Cleans</span>
            <span className="font-medium">{oneOffStats.deepCleans}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">Move-Outs</span>
            <span className="font-medium">{oneOffStats.moveOuts}</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-gray-500">Move-Ins</span>
            <span className="font-medium">{oneOffStats.moveIns}</span>
          </div>
        </div>
      </div>
    </div>
  );
};