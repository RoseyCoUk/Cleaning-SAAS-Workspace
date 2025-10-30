"use client";
import React, { useState } from "react";
import Calendar from "@/components/calendar/Calendar";
import { BookingsManager } from "@/components/cleaning/BookingsManager";
import { ScheduleCalendar } from "@/components/cleaning/ScheduleCalendar";
import { StaffMember, StaffShift } from "@/utils/staffAvailability";

type ViewMode = "calendar" | "validated" | "bookings";

// Sample staff data matching StaffAvailabilityCalendar
const sampleStaff: StaffMember[] = [
  {
    id: "1",
    name: "Maria Garcia",
    availability: [
      { day: 1, start: "08:00", end: "16:00" },
      { day: 2, start: "08:00", end: "16:00" },
      { day: 3, start: "08:00", end: "16:00" },
      { day: 4, start: "08:00", end: "16:00" },
      { day: 5, start: "08:00", end: "14:00" },
    ],
    skills: ["Regular Clean", "Deep Clean"],
  },
  {
    id: "2",
    name: "John Smith",
    availability: [
      { day: 1, start: "09:00", end: "17:00" },
      { day: 2, start: "09:00", end: "17:00" },
      { day: 4, start: "09:00", end: "17:00" },
      { day: 5, start: "09:00", end: "17:00" },
    ],
    skills: ["Regular Clean", "Move-Out Clean"],
  },
];

// Sample schedule events
const getTodayDate = () => {
  const today = new Date();
  today.setHours(9, 0, 0, 0);
  return today;
};

const sampleEvents = [
  {
    id: "1",
    title: "Sarah Johnson",
    start: new Date(getTodayDate().getTime() + 0).toISOString(),
    end: new Date(getTodayDate().getTime() + 2 * 60 * 60 * 1000).toISOString(),
    extendedProps: {
      assignedStaff: ["1"],
      clientName: "Sarah Johnson",
      service: "Regular Clean",
    },
  },
  {
    id: "2",
    title: "Michael Chen",
    start: new Date(getTodayDate().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    end: new Date(getTodayDate().getTime() + 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    extendedProps: {
      assignedStaff: ["1", "2"],
      clientName: "Michael Chen",
      service: "Deep Clean",
    },
  },
];

// Convert events to shifts for conflict detection
const eventsToShifts = (events: typeof sampleEvents): StaffShift[] => {
  return events.flatMap(event =>
    (event.extendedProps.assignedStaff || []).map(staffId => ({
      id: `${event.id}-${staffId}`,
      staffId,
      start: event.start,
      end: event.end || event.start,
    }))
  );
};

export const ScheduleMain = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [events, setEvents] = useState(sampleEvents);
  const [staff] = useState(sampleStaff);
  const shifts = eventsToShifts(events);

  const handleEventDrop = (eventId: string, newStart: string, newEnd: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, start: newStart, end: newEnd } : event
      )
    );
  };

  const handleEventResize = (eventId: string, newStart: string, newEnd: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, start: newStart, end: newEnd } : event
      )
    );
  };

  const handleEventClick = (event: { id: string; title: string; start: string; end?: string; extendedProps?: any }) => {
    console.log("Event clicked:", event);
    // In production, this would open an event details modal
  };

  const getDescription = () => {
    switch (viewMode) {
      case "validated":
        return "Drag-and-drop calendar with staff availability validation";
      case "bookings":
        return "Manage all bookings - recurring and one-off";
      default:
        return "Calendar view of all jobs and appointments";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header with Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {getDescription()}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
              viewMode === "calendar"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Calendar View
          </button>
          <button
            onClick={() => setViewMode("validated")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "validated"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Validated Schedule
          </button>
          <button
            onClick={() => setViewMode("bookings")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
              viewMode === "bookings"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Bookings Manager
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "calendar" && <Calendar />}
      {viewMode === "validated" && (
        <ScheduleCalendar
          events={events}
          staff={staff}
          shifts={shifts}
          onEventDrop={handleEventDrop}
          onEventResize={handleEventResize}
          onEventClick={handleEventClick}
        />
      )}
      {viewMode === "bookings" && <BookingsManager />}
    </div>
  );
};
