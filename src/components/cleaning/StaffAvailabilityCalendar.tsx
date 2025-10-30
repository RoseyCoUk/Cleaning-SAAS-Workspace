"use client";
import React, { useState } from "react";
import { CalenderIcon, TimeIcon, UserIcon, EditIcon } from "@/icons";
import { StaffMember, getWeeklyAvailabilitySummary, getTotalWeeklyHours, getDayName } from "@/utils/staffAvailability";

interface StaffAvailabilityCalendarProps {
  staff: StaffMember[];
  onEditAvailability: (staff: StaffMember) => void;
}

export const StaffAvailabilityCalendar: React.FC<StaffAvailabilityCalendarProps> = ({
  staff,
  onEditAvailability,
}) => {

  const [selectedStaff, setSelectedStaff] = useState<string | null>(
    staff.length > 0 ? staff[0].id : null
  );

  const currentStaff = staff.find(s => s.id === selectedStaff);

  if (!currentStaff) {
    return (
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
        <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-gray-500 dark:text-gray-400">No staff members available</p>
      </div>
    );
  }

  const weeklyAvailability = getWeeklyAvailabilitySummary(currentStaff);
  const totalHours = getTotalWeeklyHours(currentStaff);

  // Time slots for the grid (6 AM to 10 PM)
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 6); // 6-22 (6 AM - 10 PM)

  // Check if staff is available at a specific day and hour
  const isAvailableAt = (day: number, hour: number): boolean => {
    const dayAvail = weeklyAvailability[day];
    if (!dayAvail) return false;

    const [startHour, startMin] = dayAvail.start.split(":").map(Number);
    const [endHour, endMin] = dayAvail.end.split(":").map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const currentMinutes = hour * 60;

    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  return (
    <div className="space-y-6">
      {/* Header with Staff Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Staff Availability Calendar
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View and manage team member availability schedules
          </p>
        </div>

        {/* Staff Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="staff-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Team Member:
          </label>
          <select
            id="staff-select"
            value={selectedStaff || ""}
            onChange={e => setSelectedStaff(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            {staff.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Staff Info Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Hours */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <TimeIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Hours</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{totalHours.toFixed(1)}h</p>
            </div>
          </div>
        </div>

        {/* Days Available */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CalenderIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Days Available</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStaff.availability.length}/7
              </p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <UserIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStaff.skills?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Availability Summary */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Schedule</h3>
          <button
            onClick={() => onEditAvailability(currentStaff)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <EditIcon className="w-4 h-4" />
            Edit Availability
          </button>
        </div>

        <div className="space-y-3">
          {[...currentStaff.availability]
            .sort((a, b) => a.day - b.day)
            .map((avail, index) => {
              const dayData = weeklyAvailability[avail.day];
              if (!dayData) return null;

              return (
                <div
                  key={`${avail.day}-${index}`}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20">
                      <p className="font-medium text-gray-900 dark:text-white">{getDayName(avail.day)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <TimeIcon className="w-4 h-4" />
                      <span>
                        {dayData.start} - {dayData.end}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-brand-600 dark:text-brand-400">
                    {dayData.hours}h
                  </div>
                </div>
              );
            })}

          {currentStaff.availability.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No availability set for this team member</p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Grid View */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Availability Grid</h3>

        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-1 mb-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 p-2">Time</div>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="text-xs font-medium text-gray-900 dark:text-white text-center p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="space-y-1">
            {timeSlots.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 p-2">
                  {hour.toString().padStart(2, "0")}:00
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map(day => (
                  <div
                    key={`${day}-${hour}`}
                    className={`h-8 rounded transition-colors ${
                      isAvailableAt(day, hour)
                        ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                        : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    }`}
                    title={
                      isAvailableAt(day, hour)
                        ? `Available on ${getDayName(day)} at ${hour}:00`
                        : `Not available`
                    }
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded" />
            <span>Not Available</span>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      {currentStaff.skills && currentStaff.skills.length > 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills & Services</h3>
          <div className="flex flex-wrap gap-2">
            {currentStaff.skills.map(skill => (
              <span
                key={skill}
                className="px-3 py-1 bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
