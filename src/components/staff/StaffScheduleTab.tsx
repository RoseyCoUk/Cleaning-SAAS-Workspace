"use client";
import React from "react";
import { CalenderIcon } from "@/icons";

interface ScheduleItem {
  id: string;
  date: string;
  clientName: string;
  service: string;
  time: string;
  duration: string;
}

// Sample schedule data
const schedule: ScheduleItem[] = [
  {
    id: "1",
    date: "Dec 23, 2024",
    clientName: "Sarah Johnson",
    service: "Regular Clean",
    time: "9:00 AM",
    duration: "2 hours",
  },
  {
    id: "2",
    date: "Dec 23, 2024",
    clientName: "Michael Chen",
    service: "Deep Clean",
    time: "11:30 AM",
    duration: "4 hours",
  },
  {
    id: "3",
    date: "Dec 24, 2024",
    clientName: "Emily Davis",
    service: "Regular Clean",
    time: "9:00 AM",
    duration: "2 hours",
  },
  {
    id: "4",
    date: "Dec 26, 2024",
    clientName: "Robert Wilson",
    service: "Move-Out Clean",
    time: "2:00 PM",
    duration: "5 hours",
  },
];

// Group schedule by date
const groupedSchedule = schedule.reduce((acc, item) => {
  if (!acc[item.date]) {
    acc[item.date] = [];
  }
  acc[item.date].push(item);
  return acc;
}, {} as Record<string, ScheduleItem[]>);

export const StaffScheduleTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <CalenderIcon className="w-4 h-4" />
        <span>Your upcoming schedule (view only)</span>
      </div>

      {/* Grouped Schedule */}
      <div className="space-y-6">
        {Object.entries(groupedSchedule).map(([date, items]) => (
          <div key={date}>
            {/* Date Header */}
            <div className="mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">{date}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{items.length} jobs scheduled</p>
            </div>

            {/* Jobs for this date */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{item.clientName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.service}</p>
                    </div>
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                      {item.time}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Duration: {item.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {Object.keys(groupedSchedule).length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <CalenderIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No upcoming jobs scheduled</p>
        </div>
      )}
    </div>
  );
};
