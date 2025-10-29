"use client";
import { useState, useMemo, useCallback } from "react";

export interface RecurringSchedule {
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "custom";
  interval: number;
  daysOfWeek?: number[]; // 0 = Sunday, 6 = Saturday
  dayOfMonth?: number; // 1-31
  startDate: Date;
  endDate?: Date;
  skipDates?: Date[];
  maxOccurrences?: number;
}

export interface ScheduleOccurrence {
  date: Date;
  isSkipped: boolean;
  index: number;
}

/**
 * useRecurringSchedule - Manages recurring schedule patterns and calculations
 * @param initialSchedule - Initial schedule configuration
 * @returns Schedule management functions and computed occurrences
 */
export const useRecurringSchedule = (initialSchedule?: Partial<RecurringSchedule>) => {
  const [schedule, setSchedule] = useState<RecurringSchedule>({
    frequency: "weekly",
    interval: 1,
    daysOfWeek: [1], // Monday by default
    startDate: new Date(),
    skipDates: [],
    ...initialSchedule,
  });

  /**
   * Calculate next occurrences based on the schedule
   */
  const getOccurrences = useCallback(
    (count = 10): ScheduleOccurrence[] => {
      const occurrences: ScheduleOccurrence[] = [];
      let currentDate = new Date(schedule.startDate);
      let occurrenceIndex = 0;

      while (occurrences.length < count) {
        // Check if we've reached the end date
        if (schedule.endDate && currentDate > schedule.endDate) {
          break;
        }

        // Check if we've reached max occurrences
        if (schedule.maxOccurrences && occurrenceIndex >= schedule.maxOccurrences) {
          break;
        }

        let shouldAdd = false;

        switch (schedule.frequency) {
          case "daily":
            shouldAdd = true;
            currentDate.setDate(currentDate.getDate() + schedule.interval);
            break;

          case "weekly":
          case "biweekly":
            if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
              // Find next occurrence for each selected day
              for (const dayOfWeek of schedule.daysOfWeek) {
                const tempDate = new Date(currentDate);
                const daysUntil = (dayOfWeek - tempDate.getDay() + 7) % 7 || 7;
                tempDate.setDate(tempDate.getDate() + daysUntil);

                if (tempDate >= schedule.startDate) {
                  const isSkipped = schedule.skipDates?.some(
                    skipDate => skipDate.toDateString() === tempDate.toDateString()
                  ) || false;

                  occurrences.push({
                    date: new Date(tempDate),
                    isSkipped,
                    index: occurrenceIndex++,
                  });
                }
              }
              // Move to next week(s)
              const weeksToAdd = schedule.frequency === "biweekly" ? 2 : 1;
              currentDate.setDate(currentDate.getDate() + (7 * weeksToAdd * schedule.interval));
            }
            continue;

          case "monthly":
            if (schedule.dayOfMonth) {
              currentDate.setMonth(currentDate.getMonth() + schedule.interval);
              currentDate.setDate(schedule.dayOfMonth);
              shouldAdd = true;
            }
            break;

          case "custom":
            // Custom logic - for now, treat as daily with interval
            shouldAdd = true;
            currentDate.setDate(currentDate.getDate() + schedule.interval);
            break;
        }

        if (shouldAdd && currentDate >= schedule.startDate) {
          const isSkipped = schedule.skipDates?.some(
            skipDate => skipDate.toDateString() === currentDate.toDateString()
          ) || false;

          occurrences.push({
            date: new Date(currentDate),
            isSkipped,
            index: occurrenceIndex++,
          });
        }
      }

      return occurrences;
    },
    [schedule]
  );

  /**
   * Update schedule frequency
   */
  const setFrequency = useCallback((frequency: RecurringSchedule["frequency"]) => {
    setSchedule(prev => ({ ...prev, frequency }));
  }, []);

  /**
   * Update interval
   */
  const setInterval = useCallback((interval: number) => {
    setSchedule(prev => ({ ...prev, interval: Math.max(1, interval) }));
  }, []);

  /**
   * Toggle a day of week
   */
  const toggleDayOfWeek = useCallback((day: number) => {
    setSchedule(prev => {
      const daysOfWeek = prev.daysOfWeek || [];
      const index = daysOfWeek.indexOf(day);

      if (index > -1) {
        return { ...prev, daysOfWeek: daysOfWeek.filter(d => d !== day) };
      } else {
        return { ...prev, daysOfWeek: [...daysOfWeek, day].sort() };
      }
    });
  }, []);

  /**
   * Add a skip date
   */
  const addSkipDate = useCallback((date: Date) => {
    setSchedule(prev => ({
      ...prev,
      skipDates: [...(prev.skipDates || []), date],
    }));
  }, []);

  /**
   * Remove a skip date
   */
  const removeSkipDate = useCallback((date: Date) => {
    setSchedule(prev => ({
      ...prev,
      skipDates: prev.skipDates?.filter(
        d => d.toDateString() !== date.toDateString()
      ),
    }));
  }, []);

  /**
   * Set end date
   */
  const setEndDate = useCallback((date: Date | undefined) => {
    setSchedule(prev => ({ ...prev, endDate: date }));
  }, []);

  /**
   * Get next occurrence date
   */
  const nextOccurrence = useMemo(() => {
    const occurrences = getOccurrences(1);
    return occurrences.find(o => !o.isSkipped)?.date || null;
  }, [getOccurrences]);

  /**
   * Count total occurrences in a date range
   */
  const countOccurrences = useCallback(
    (startDate: Date, endDate: Date): number => {
      const occurrences = getOccurrences(365); // Get many occurrences
      return occurrences.filter(o => {
        return o.date >= startDate && o.date <= endDate && !o.isSkipped;
      }).length;
    },
    [getOccurrences]
  );

  return {
    schedule,
    setSchedule,
    setFrequency,
    setInterval,
    toggleDayOfWeek,
    addSkipDate,
    removeSkipDate,
    setEndDate,
    getOccurrences,
    nextOccurrence,
    countOccurrences,
  };
};

// Example usage:
// const {
//   schedule,
//   setFrequency,
//   toggleDayOfWeek,
//   getOccurrences,
//   nextOccurrence
// } = useRecurringSchedule({
//   frequency: "weekly",
//   daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
//   startDate: new Date(),
// });
//
// const next10 = getOccurrences(10);
// console.log("Next appointment:", nextOccurrence);