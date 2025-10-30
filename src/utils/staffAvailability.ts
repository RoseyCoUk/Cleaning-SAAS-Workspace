/**
 * Staff Availability Utilities
 *
 * Pure functions for validating staff availability and detecting scheduling conflicts.
 * Used by the drag-and-drop schedule validation and availability calendar.
 */

export interface StaffAvailability {
  day: number; // 0-6 (Sunday-Saturday)
  start: string; // "HH:MM" format (24-hour)
  end: string; // "HH:MM" format (24-hour)
}

export interface StaffMember {
  id: string;
  name: string;
  availability: StaffAvailability[];
  skills?: string[];
}

export interface StaffShift {
  id: string;
  staffId: string;
  start: string; // ISO datetime string
  end: string; // ISO datetime string
}

/**
 * Parse time string to minutes since midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Format minutes since midnight to HH:MM
 */
export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}

/**
 * Validate that a time range is valid (start < end, within business hours)
 */
export function isValidTimeRange(start: string, end: string): boolean {
  const startMins = parseTimeToMinutes(start);
  const endMins = parseTimeToMinutes(end);

  // Start must be before end
  if (startMins >= endMins) return false;

  // Must be within reasonable business hours (6 AM - 10 PM)
  if (startMins < 360 || endMins > 1320) return false;

  return true;
}

/**
 * Check if a staff member is available for a specific time slot
 * Supports multiple availability windows per day (e.g., split shifts)
 */
export function isStaffAvailableForSlot(
  staff: StaffMember,
  startDateTime: string,
  endDateTime: string
): boolean {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);

  const dayOfWeek = start.getDay();

  // Get ALL availability slots for this day of week
  const dayAvailabilities = staff.availability.filter(a => a.day === dayOfWeek);

  if (dayAvailabilities.length === 0) return false;

  // Convert times to minutes for comparison
  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const endMinutes = end.getHours() * 60 + end.getMinutes();

  // Check if the requested time slot fits within ANY of the availability windows
  return dayAvailabilities.some(dayAvail => {
    const availStart = parseTimeToMinutes(dayAvail.start);
    const availEnd = parseTimeToMinutes(dayAvail.end);
    return startMinutes >= availStart && endMinutes <= availEnd;
  });
}

/**
 * Get conflicting shifts for a staff member in a time range
 */
export function getConflictingAssignments(
  staffId: string,
  startDateTime: string,
  endDateTime: string,
  existingShifts: StaffShift[],
  excludeShiftId?: string
): StaffShift[] {
  const start = new Date(startDateTime);
  const end = new Date(endDateTime);
  const startTime = start.getTime();
  const endTime = end.getTime();

  return existingShifts.filter(shift => {
    // Skip the shift we're editing
    if (excludeShiftId && shift.id === excludeShiftId) return false;

    // Only check shifts for this staff member
    if (shift.staffId !== staffId) return false;

    // Check for time overlap using timestamps
    const shiftStart = new Date(shift.start).getTime();
    const shiftEnd = new Date(shift.end).getTime();

    // Shifts overlap if: start < otherEnd AND end > otherStart
    return startTime < shiftEnd && endTime > shiftStart;
  });
}

/**
 * Get list of staff members available for a time slot (no conflicts)
 */
export function getAvailableStaff(
  allStaff: StaffMember[],
  startDateTime: string,
  endDateTime: string,
  existingShifts: StaffShift[]
): StaffMember[] {
  return allStaff.filter(staff => {
    // Check if staff has availability for this time
    if (!isStaffAvailableForSlot(staff, startDateTime, endDateTime)) {
      return false;
    }

    // Check if staff has conflicting assignments
    const conflicts = getConflictingAssignments(
      staff.id,
      startDateTime,
      endDateTime,
      existingShifts
    );

    return conflicts.length === 0;
  });
}

/**
 * Get weekly availability summary for display
 * Handles multiple availability windows per day (e.g., split shifts)
 * When multiple slots exist for a day, shows earliest start, latest end, and total hours
 */
export function getWeeklyAvailabilitySummary(staff: StaffMember): Record<number, { start: string; end: string; hours: number } | null> {
  const summary: Record<number, { start: string; end: string; hours: number } | null> = {
    0: null, // Sunday
    1: null, // Monday
    2: null, // Tuesday
    3: null, // Wednesday
    4: null, // Thursday
    5: null, // Friday
    6: null, // Saturday
  };

  // Group slots by day
  const slotsByDay: Record<number, StaffAvailability[]> = {};
  staff.availability.forEach(avail => {
    if (!slotsByDay[avail.day]) {
      slotsByDay[avail.day] = [];
    }
    slotsByDay[avail.day].push(avail);
  });

  // Calculate summary for each day
  Object.entries(slotsByDay).forEach(([dayStr, slots]) => {
    const day = parseInt(dayStr);

    if (slots.length === 0) return;

    // Find earliest start and latest end across all slots for this day
    const startMinutes = Math.min(...slots.map(s => parseTimeToMinutes(s.start)));
    const endMinutes = Math.max(...slots.map(s => parseTimeToMinutes(s.end)));

    // Calculate total hours across all slots for this day
    const totalHours = slots.reduce((total, slot) => {
      const slotStart = parseTimeToMinutes(slot.start);
      const slotEnd = parseTimeToMinutes(slot.end);
      return total + (slotEnd - slotStart) / 60;
    }, 0);

    // Convert minutes back to time strings
    const startHrs = Math.floor(startMinutes / 60);
    const startMins = startMinutes % 60;
    const endHrs = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;

    summary[day] = {
      start: `${startHrs.toString().padStart(2, '0')}:${startMins.toString().padStart(2, '0')}`,
      end: `${endHrs.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`,
      hours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
    };
  });

  return summary;
}

/**
 * Calculate total weekly hours for a staff member
 */
export function getTotalWeeklyHours(staff: StaffMember): number {
  return staff.availability.reduce((total, avail) => {
    const startMins = parseTimeToMinutes(avail.start);
    const endMins = parseTimeToMinutes(avail.end);
    const hours = (endMins - startMins) / 60;
    return total + hours;
  }, 0);
}

/**
 * Check if availability overlaps with another availability slot for the same day
 */
export function hasAvailabilityOverlap(
  availability: StaffAvailability[],
  day: number,
  start: string,
  end: string,
  excludeIndex?: number
): boolean {
  const newStart = parseTimeToMinutes(start);
  const newEnd = parseTimeToMinutes(end);

  return availability.some((avail, index) => {
    if (avail.day !== day) return false;
    if (excludeIndex !== undefined && index === excludeIndex) return false;

    const existingStart = parseTimeToMinutes(avail.start);
    const existingEnd = parseTimeToMinutes(avail.end);

    // Check for overlap: start < otherEnd AND end > otherStart
    return newStart < existingEnd && newEnd > existingStart;
  });
}

/**
 * Get day name from day number
 */
export function getDayName(day: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day] || "Unknown";
}

/**
 * Get short day name from day number
 */
export function getShortDayName(day: number): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day] || "?";
}
