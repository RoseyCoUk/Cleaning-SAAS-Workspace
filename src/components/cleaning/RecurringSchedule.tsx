"use client";
import React, { useState } from "react";
import { CalenderIcon, CheckCircleIcon } from "@/icons";

type FrequencyType = "weekly" | "biweekly" | "fourweekly" | "monthly" | "custom";

interface RecurringScheduleProps {
  onScheduleSet?: (schedule: RecurringPattern) => void;
}

interface RecurringPattern {
  frequency: FrequencyType;
  interval?: number;
  daysOfWeek?: number[];
  dayOfMonth?: number;
  endDate?: string | null;
  skipDates?: string[];
}

export const RecurringSchedule: React.FC<RecurringScheduleProps> = () => {
  const [frequency, setFrequency] = useState<FrequencyType>("weekly");
  const [selectedDays, setSelectedDays] = useState<number[]>([1]); // Monday by default
  const [interval, setInterval] = useState(1);
  const [endDate, setEndDate] = useState<string>("");
  const [hasEndDate, setHasEndDate] = useState(false);
  const [skipDates] = useState<string[]>([]);

  const weekDays = [
    { id: 0, name: "Sun", short: "S" },
    { id: 1, name: "Mon", short: "M" },
    { id: 2, name: "Tue", short: "T" },
    { id: 3, name: "Wed", short: "W" },
    { id: 4, name: "Thu", short: "T" },
    { id: 5, name: "Fri", short: "F" },
    { id: 6, name: "Sat", short: "S" },
  ];

  const frequencies = [
    { value: "weekly", label: "Weekly", description: "Every week" },
    { value: "biweekly", label: "Bi-weekly", description: "Every 2 weeks" },
    { value: "fourweekly", label: "Every 4 Weeks", description: "Every 4 weeks" },
    { value: "monthly", label: "Monthly", description: "Every month" },
    { value: "custom", label: "Custom", description: "Custom interval" },
  ];

  const toggleDay = (dayId: number) => {
    setSelectedDays(prev =>
      prev.includes(dayId)
        ? prev.filter(d => d !== dayId)
        : [...prev, dayId]
    );
  };

  const getPatternDescription = () => {
    if (frequency === "weekly") {
      const dayNames = selectedDays
        .sort()
        .map(d => weekDays.find(day => day.id === d)?.name)
        .join(", ");
      return `Every week on ${dayNames || "selected days"}`;
    } else if (frequency === "biweekly") {
      const dayNames = selectedDays
        .sort()
        .map(d => weekDays.find(day => day.id === d)?.name)
        .join(", ");
      return `Every 2 weeks on ${dayNames || "selected days"}`;
    } else if (frequency === "fourweekly") {
      const dayNames = selectedDays
        .sort()
        .map(d => weekDays.find(day => day.id === d)?.name)
        .join(", ");
      return `Every 4 weeks on ${dayNames || "selected days"}`;
    } else if (frequency === "monthly") {
      return `Every month on the same date`;
    } else {
      return `Every ${interval} week(s) on selected days`;
    }
  };

  const getNextOccurrences = (count: number = 5): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    // eslint-disable-next-line prefer-const
    let currentDate = new Date(today);

    while (dates.length < count) {
      if (frequency === "weekly" || frequency === "biweekly" || frequency === "fourweekly" || frequency === "custom") {
        selectedDays.forEach(dayOfWeek => {
          const daysUntilTarget = (dayOfWeek - currentDate.getDay() + 7) % 7;
          const targetDate = new Date(currentDate);
          targetDate.setDate(currentDate.getDate() + daysUntilTarget);

          if (targetDate > today && !skipDates.includes(targetDate.toISOString().split('T')[0])) {
            dates.push(new Date(targetDate));
          }
        });

        const weeksToAdd = frequency === "biweekly" ? 2
                         : frequency === "fourweekly" ? 4
                         : (frequency === "custom" ? interval : 1);
        currentDate.setDate(currentDate.getDate() + (7 * weeksToAdd));
      } else if (frequency === "monthly") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate > today && !skipDates.includes(currentDate.toISOString().split('T')[0])) {
          dates.push(new Date(currentDate));
        }
      }

      // Break if we've gone past the end date
      if (hasEndDate && endDate && currentDate > new Date(endDate)) {
        break;
      }
    }

    return dates.slice(0, count);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Set Recurring Schedule
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Frequency Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Cleaning Frequency
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {frequencies.map(freq => (
              <button
                key={freq.value}
                onClick={() => setFrequency(freq.value as FrequencyType)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  frequency === freq.value
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="text-sm font-medium text-gray-800 dark:text-white">
                  {freq.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {freq.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Interval */}
        {frequency === "custom" && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Repeat every
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="52"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">week(s)</span>
            </div>
          </div>
        )}

        {/* Day Selection */}
        {(frequency === "weekly" || frequency === "biweekly" || frequency === "fourweekly" || frequency === "custom") && (
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
              Select Days
            </label>
            <div className="flex gap-2">
              {weekDays.map(day => (
                <button
                  key={day.id}
                  onClick={() => toggleDay(day.id)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    selectedDays.includes(day.id)
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pattern Description */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <CalenderIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue-300">
                Schedule Pattern
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                {getPatternDescription()}
              </div>
            </div>
          </div>
        </div>

        {/* Duration Settings */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
            Duration
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={!hasEndDate}
                onChange={() => setHasEndDate(false)}
                className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">No end date</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={hasEndDate}
                onChange={() => setHasEndDate(true)}
                className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">End on specific date</span>
            </label>
            {hasEndDate && (
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="ml-7 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            )}
          </div>
        </div>

        {/* Preview Timeline */}
        <div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Next Occurrences
          </div>
          <div className="space-y-2">
            {getNextOccurrences().map((date, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {date.toLocaleDateString('en-US', { year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <CheckCircleIcon className="w-5 h-5 text-fresh-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Cancel
          </button>
          <button className="flex-1 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            Apply Schedule
          </button>
        </div>
      </div>
    </div>
  );
};