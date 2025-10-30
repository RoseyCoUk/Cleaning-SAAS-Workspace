"use client";
import React, { useState, useEffect } from "react";
import { CloseIcon, PlusIcon, TrashIcon, TimeIcon } from "@/icons";
import {
  StaffMember,
  StaffAvailability,
  getDayName,
  isValidTimeRange,
  hasAvailabilityOverlap,
  getTotalWeeklyHours,
} from "@/utils/staffAvailability";

interface StaffAvailabilityDialogProps {
  isOpen: boolean;
  staff: StaffMember | null;
  onClose: () => void;
  onSave: (staffId: string, availability: StaffAvailability[]) => void;
}

export const StaffAvailabilityDialog: React.FC<StaffAvailabilityDialogProps> = ({
  isOpen,
  staff,
  onClose,
  onSave,
}) => {
  const [availability, setAvailability] = useState<StaffAvailability[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize availability when staff changes
  useEffect(() => {
    if (staff) {
      setAvailability([...staff.availability]);
      setError(null);
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  const totalHours = availability.reduce((total, avail) => {
    const [startH, startM] = avail.start.split(":").map(Number);
    const [endH, endM] = avail.end.split(":").map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    return total + (endMins - startMins) / 60;
  }, 0);

  const handleAddSlot = () => {
    // Find first available day (not already in availability)
    const usedDays = availability.map(a => a.day);
    const availableDay = [1, 2, 3, 4, 5, 6, 0].find(day => !usedDays.includes(day));

    if (availableDay === undefined) {
      setError("All days already have availability slots. Remove a slot to add a different time.");
      return;
    }

    setAvailability([
      ...availability,
      {
        day: availableDay,
        start: "09:00",
        end: "17:00",
      },
    ]);
    setError(null);
  };

  const handleRemoveSlot = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUpdateSlot = (
    index: number,
    field: keyof StaffAvailability,
    value: string | number
  ) => {
    const updated = [...availability];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setAvailability(updated);
    setError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate all slots
    for (let i = 0; i < availability.length; i++) {
      const avail = availability[i];

      // Check valid time range
      if (!isValidTimeRange(avail.start, avail.end)) {
        setError(
          `Invalid time range for ${getDayName(avail.day)}: Start time must be before end time and within business hours (6 AM - 10 PM).`
        );
        return;
      }

      // Check for overlaps with other slots on same day
      if (
        hasAvailabilityOverlap(availability, avail.day, avail.start, avail.end, i)
      ) {
        setError(
          `Time overlap detected for ${getDayName(avail.day)}: ${avail.start} - ${avail.end} conflicts with another slot.`
        );
        return;
      }
    }

    // Save
    onSave(staff.id, availability);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Availability
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{staff.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-brand-50 dark:bg-brand-900/10 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TimeIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Weekly Hours</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {totalHours.toFixed(1)}h
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Days Configured</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {availability.length}/7
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Availability Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Weekly Schedule
              </h3>
              <button
                type="button"
                onClick={handleAddSlot}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                disabled={availability.length >= 7}
              >
                <PlusIcon className="w-4 h-4" />
                Add Time Slot
              </button>
            </div>

            <div className="space-y-3">
              {availability.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No availability configured. Click "Add Time Slot" to begin.
                  </p>
                </div>
              ) : (
                [...availability]
                  .map((avail, index) => ({ ...avail, originalIndex: index }))
                  .sort((a, b) => a.day - b.day)
                  .map(({ day, start, end, originalIndex }) => (
                    <div
                      key={originalIndex}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      {/* Day Selector */}
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Day
                        </label>
                        <select
                          value={day}
                          onChange={e =>
                            handleUpdateSlot(originalIndex, "day", parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        >
                          {[1, 2, 3, 4, 5, 6, 0].map(d => (
                            <option key={d} value={d}>
                              {getDayName(d)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Start Time */}
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={start}
                          onChange={e =>
                            handleUpdateSlot(originalIndex, "start", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      </div>

                      {/* End Time */}
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={end}
                          onChange={e =>
                            handleUpdateSlot(originalIndex, "end", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(originalIndex)}
                        className="sm:mt-5 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        title="Remove this time slot"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Helper Text */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Tip:</strong> Set regular working hours for each day of the week. These
              hours will be used to validate job assignments and prevent double-booking.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              Save Availability
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
