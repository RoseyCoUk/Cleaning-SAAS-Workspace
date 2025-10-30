"use client";
import React, { useState, useRef, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { EventResizeDoneArg } from "@fullcalendar/interaction";
import {
  EventInput,
  EventDropArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { AlertIcon, CheckCircleIcon } from "@/icons";
import {
  StaffMember,
  StaffShift,
  getAvailableStaff,
  getConflictingAssignments,
} from "@/utils/staffAvailability";

interface ScheduleEvent extends EventInput {
  id: string;
  title: string;
  start: string;
  end?: string;
  extendedProps?: {
    assignedStaff?: string[]; // Staff IDs
    clientName?: string;
    service?: string;
  };
}

interface ScheduleCalendarProps {
  events: ScheduleEvent[];
  staff: StaffMember[];
  shifts: StaffShift[];
  onEventDrop?: (eventId: string, newStart: string, newEnd: string) => void;
  onEventResize?: (eventId: string, newStart: string, newEnd: string) => void;
  onEventClick?: (event: ScheduleEvent) => void;
}

interface ValidationWarning {
  type: "unavailable" | "conflict";
  message: string;
}

export const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
  events,
  staff,
  shifts,
  onEventDrop,
  onEventResize,
  onEventClick,
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [validationWarning, setValidationWarning] = useState<ValidationWarning | null>(null);

  /**
   * Validate if a drop/resize is allowed based on staff availability and conflicts
   */
  const validateEventChange = useCallback(
    (eventId: string, newStart: string, newEnd: string, oldStart?: string): ValidationWarning | null => {
      const event = events.find(e => e.id === eventId);
      if (!event || !event.extendedProps?.assignedStaff) return null;

      const assignedStaffIds = event.extendedProps.assignedStaff;
      const warnings: string[] = [];

      // Check each assigned staff member
      for (const staffId of assignedStaffIds) {
        const staffMember = staff.find(s => s.id === staffId);
        if (!staffMember) continue;

        // CRITICAL: Use timestamp comparison to exclude current shift properly
        const oldStartTime = oldStart ? new Date(oldStart).getTime() : null;
        const shiftsToExclude = oldStartTime
          ? shifts.filter(shift =>
              shift.staffId === staffMember.id &&
              new Date(shift.start).getTime() === oldStartTime
            ).map(shift => shift.id)
          : [];

        const rosterExcludingCurrent = shifts.filter(shift =>
          !shiftsToExclude.includes(shift.id)
        );

        // Check availability
        const availableStaffList = getAvailableStaff(
          [staffMember],
          newStart,
          newEnd,
          rosterExcludingCurrent
        );

        if (availableStaffList.length === 0) {
          // Check if it's an availability issue or conflict
          const conflicts = getConflictingAssignments(
            staffMember.id,
            newStart,
            newEnd,
            rosterExcludingCurrent
          );

          if (conflicts.length > 0) {
            warnings.push(`${staffMember.name} has ${conflicts.length} conflicting assignment(s)`);
          } else {
            warnings.push(`${staffMember.name} is not available during this time`);
          }
        }
      }

      if (warnings.length > 0) {
        return {
          type: warnings[0].includes("conflicting") ? "conflict" : "unavailable",
          message: warnings.join("; "),
        };
      }

      return null;
    },
    [events, staff, shifts]
  );

  /**
   * Handle event drop (drag-and-drop)
   */
  const handleEventDrop = useCallback(
    (info: EventDropArg) => {
      const newStart = info.event.start?.toISOString() || "";
      const newEnd = info.event.end?.toISOString() || newStart;
      const oldStart = info.oldEvent.start?.toISOString();

      // Validate the drop
      const warning = validateEventChange(info.event.id, newStart, newEnd, oldStart);

      if (warning) {
        // Revert the drop
        info.revert();
        setValidationWarning(warning);

        // Clear warning after 5 seconds
        setTimeout(() => setValidationWarning(null), 5000);
      } else {
        // Allow the drop
        setValidationWarning(null);
        onEventDrop?.(info.event.id, newStart, newEnd);
      }
    },
    [validateEventChange, onEventDrop]
  );

  /**
   * Handle event resize
   */
  const handleEventResize = useCallback(
    (info: EventResizeDoneArg) => {
      const newStart = info.event.start?.toISOString() || "";
      const newEnd = info.event.end?.toISOString() || newStart;
      const oldStart = info.oldEvent.start?.toISOString();

      // Validate the resize
      const warning = validateEventChange(info.event.id, newStart, newEnd, oldStart);

      if (warning) {
        // Revert the resize
        info.revert();
        setValidationWarning(warning);

        // Clear warning after 5 seconds
        setTimeout(() => setValidationWarning(null), 5000);
      } else {
        // Allow the resize
        setValidationWarning(null);
        onEventResize?.(info.event.id, newStart, newEnd);
      }
    },
    [validateEventChange, onEventResize]
  );

  /**
   * Handle event click
   */
  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const event = events.find(e => e.id === info.event.id);
      if (event && onEventClick) {
        onEventClick(event as ScheduleEvent);
      }
    },
    [events, onEventClick]
  );

  /**
   * Custom event rendering
   */
  const renderEventContent = (eventInfo: EventContentArg) => {
    const hasStaff = eventInfo.event.extendedProps.assignedStaff?.length > 0;

    return (
      <div className="px-1 py-0.5 overflow-hidden">
        <div className="flex items-center gap-1">
          {hasStaff && <CheckCircleIcon className="w-3 h-3 flex-shrink-0" />}
          <span className="text-xs font-medium truncate">{eventInfo.timeText}</span>
        </div>
        <div className="text-xs truncate font-semibold">{eventInfo.event.title}</div>
        {eventInfo.event.extendedProps.service && (
          <div className="text-xs truncate opacity-90">
            {eventInfo.event.extendedProps.service}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Validation Warning Banner */}
      {validationWarning && (
        <div
          className={`absolute top-0 left-0 right-0 z-10 p-4 rounded-lg border ${
            validationWarning.type === "conflict"
              ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
              : "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800"
          }`}
        >
          <div className="flex items-start gap-3">
            <AlertIcon
              className={`w-5 h-5 flex-shrink-0 ${
                validationWarning.type === "conflict"
                  ? "text-red-600 dark:text-red-400"
                  : "text-yellow-600 dark:text-yellow-400"
              }`}
            />
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  validationWarning.type === "conflict"
                    ? "text-red-900 dark:text-red-200"
                    : "text-yellow-900 dark:text-yellow-200"
                }`}
              >
                {validationWarning.type === "conflict"
                  ? "Scheduling Conflict"
                  : "Staff Unavailable"}
              </p>
              <p
                className={`text-sm mt-1 ${
                  validationWarning.type === "conflict"
                    ? "text-red-700 dark:text-red-400"
                    : "text-yellow-700 dark:text-yellow-400"
                }`}
              >
                {validationWarning.message}
              </p>
            </div>
            <button
              onClick={() => setValidationWarning(null)}
              className={`text-sm font-medium ${
                validationWarning.type === "conflict"
                  ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  : "text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300"
              }`}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className={`bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${validationWarning ? "mt-20" : ""}`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          height="auto"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          nowIndicator={true}
          // Styling
          eventClassNames="cursor-pointer transition-opacity hover:opacity-80"
          eventColor="#3b82f6"
        />
      </div>

      {/* Info Panel */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-700 dark:text-blue-400">
          <strong>Drag & Drop Validation:</strong> Events can be dragged and resized. The system
          will automatically check staff availability and prevent conflicts. Assignments that
          violate availability or overlap with existing shifts will be reverted with a warning.
        </p>
      </div>
    </div>
  );
};
