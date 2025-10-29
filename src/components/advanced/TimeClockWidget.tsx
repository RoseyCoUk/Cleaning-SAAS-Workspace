"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  TimeIcon,
  CheckCircleIcon,
  PlusIcon,
  CloseIcon,
  ArrowRightIcon,
  BellIcon,
  UserCircleIcon,
  CalenderIcon,
} from "@/icons";
import { cn } from "@/lib/utils/cn";

// Types and interfaces
export interface TimeEntry {
  id: string;
  type: "clock_in" | "clock_out" | "break_start" | "break_end";
  timestamp: Date;
  location?: string;
  notes?: string;
}

export interface ShiftData {
  id: string;
  employeeId: string;
  startTime: Date;
  endTime?: Date;
  breaks: Array<{
    id: string;
    startTime: Date;
    endTime?: Date;
    duration?: number; // in minutes
    type: "lunch" | "short" | "other";
  }>;
  totalHours?: number;
  status: "active" | "completed" | "on_break";
  location?: string;
  notes?: string;
}

export interface EmployeeStats {
  dailyHours: number;
  weeklyHours: number;
  monthlyHours: number;
  overtimeHours: number;
  breaksToday: number;
  avgDailyHours: number;
}

export interface TimeClockWidgetProps {
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  currentShift?: ShiftData;
  stats?: EmployeeStats;
  allowBreaks?: boolean;
  allowNotes?: boolean;
  allowLocationTracking?: boolean;
  maxBreakDuration?: number; // in minutes
  overtimeThreshold?: number; // in hours
  autoBreakReminder?: boolean;
  variant?: "default" | "compact" | "detailed";
  className?: string;
  onClockIn?: (data: { timestamp: Date; location?: string; notes?: string }) => void;
  onClockOut?: (data: { timestamp: Date; location?: string; notes?: string }) => void;
  onBreakStart?: (data: { timestamp: Date; type: "lunch" | "short" | "other"; notes?: string }) => void;
  onBreakEnd?: (data: { timestamp: Date; breakId: string; notes?: string }) => void;
  onNotificationClick?: () => void;
}

/**
 * Staff Time Clock Widget Component
 * Features: clock in/out buttons, current shift timer, break management, quick stats
 */
export const TimeClockWidget: React.FC<TimeClockWidgetProps> = ({
  employeeId,
  employeeName,
  employeeAvatar,
  currentShift,
  stats,
  allowBreaks = true,
  allowNotes = false,
  allowLocationTracking = false,
  maxBreakDuration = 60,
  overtimeThreshold = 8,
  autoBreakReminder = true,
  variant = "default",
  className,
  onClockIn,
  onClockOut,
  onBreakStart,
  onBreakEnd,
  onNotificationClick,
}) => {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [selectedBreakType, setSelectedBreakType] = useState<"lunch" | "short" | "other">("short");
  const [showBreakOptions, setShowBreakOptions] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto break reminder
  useEffect(() => {
    if (!autoBreakReminder || !currentShift || currentShift.status !== "active") return;

    const workDuration = (currentTime.getTime() - currentShift.startTime.getTime()) / (1000 * 60 * 60);
    const totalBreakTime = currentShift.breaks
      .filter(b => b.endTime)
      .reduce((total, b) => total + (b.duration || 0), 0) / 60;

    if (workDuration >= 4 && totalBreakTime < 0.5 && !notifications.includes("break_reminder")) {
      setNotifications(prev => [...prev, "break_reminder"]);
    }
  }, [currentTime, currentShift, autoBreakReminder, notifications]);

  // Helper functions
  const getCurrentShiftDuration = useCallback(() => {
    if (!currentShift) return 0;
    const endTime = currentShift.endTime || currentTime;
    return (endTime.getTime() - currentShift.startTime.getTime()) / (1000 * 60 * 60);
  }, [currentShift, currentTime]);

  const getCurrentBreakDuration = useCallback(() => {
    if (!currentShift || currentShift.status !== "on_break") return 0;
    const activeBreak = currentShift.breaks.find(b => !b.endTime);
    if (!activeBreak) return 0;
    return (currentTime.getTime() - activeBreak.startTime.getTime()) / (1000 * 60);
  }, [currentShift, currentTime]);

  const getTotalBreakTime = useCallback(() => {
    if (!currentShift) return 0;
    return currentShift.breaks
      .filter(b => b.endTime)
      .reduce((total, b) => total + (b.duration || 0), 0);
  }, [currentShift]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  // Event handlers
  const handleClockIn = () => {
    const data = {
      timestamp: new Date(),
      location: allowLocationTracking ? location : undefined,
      notes: allowNotes ? notes : undefined,
    };
    onClockIn?.(data);
    setNotes("");
    setLocation("");
    setShowNotes(false);
  };

  const handleClockOut = () => {
    const data = {
      timestamp: new Date(),
      location: allowLocationTracking ? location : undefined,
      notes: allowNotes ? notes : undefined,
    };
    onClockOut?.(data);
    setNotes("");
    setLocation("");
    setShowNotes(false);
  };

  const handleBreakStart = () => {
    const data = {
      timestamp: new Date(),
      type: selectedBreakType,
      notes: allowNotes ? notes : undefined,
    };
    onBreakStart?.(data);
    setNotes("");
    setShowBreakOptions(false);
  };

  const handleBreakEnd = () => {
    const activeBreak = currentShift?.breaks.find(b => !b.endTime);
    if (!activeBreak) return;

    const data = {
      timestamp: new Date(),
      breakId: activeBreak.id,
      notes: allowNotes ? notes : undefined,
    };
    onBreakEnd?.(data);
    setNotes("");
  };

  const dismissNotification = (notification: string) => {
    setNotifications(prev => prev.filter(n => n !== notification));
  };

  const isOvertime = getCurrentShiftDuration() > overtimeThreshold;
  const isLongBreak = getCurrentBreakDuration() > maxBreakDuration;

  const getStatusColor = () => {
    if (!currentShift) return "text-gray-500 dark:text-gray-400";
    switch (currentShift.status) {
      case "active":
        return isOvertime ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400";
      case "on_break":
        return isLongBreak ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getStatusText = () => {
    if (!currentShift) return "Clocked Out";
    switch (currentShift.status) {
      case "active":
        return isOvertime ? "Working (Overtime)" : "Working";
      case "on_break":
        return isLongBreak ? "On Break (Long)" : "On Break";
      default:
        return "Clocked Out";
    }
  };

  return (
    <div className={cn(
      "bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-6",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {employeeAvatar ? (
            <img
              src={employeeAvatar}
              alt={employeeName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
              <UserCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {employeeName}
            </h3>
            <p className={cn("text-sm font-medium", getStatusColor())}>
              {getStatusText()}
            </p>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="relative">
            <button
              onClick={onNotificationClick}
              className="p-2 text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
          </div>
        )}
      </div>

      {/* Current Time */}
      <div className="text-center mb-6">
        <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
          {formatTime(currentTime)}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentTime.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Current Shift Info */}
      {currentShift && (
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Shift Started</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatTime(currentShift.startTime)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDuration(getCurrentShiftDuration())}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Breaks Taken</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {currentShift.breaks.filter(b => b.endTime).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Break Time</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatMinutes(getTotalBreakTime())}
              </p>
            </div>
          </div>

          {/* Current Break Timer */}
          {currentShift.status === "on_break" && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Break Time: {formatMinutes(getCurrentBreakDuration())}
                </span>
                {isLongBreak && (
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    Exceeds limit
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      {stats && variant === "detailed" && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDuration(stats.dailyHours)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDuration(stats.weeklyHours)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.breaksToday}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Breaks</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatDuration(stats.overtimeHours)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Overtime</p>
          </div>
        </div>
      )}

      {/* Notes and Location Input */}
      {showNotes && (
        <div className="mb-4 space-y-3">
          {allowNotes && (
            <input
              type="text"
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          )}
          {allowLocationTracking && (
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          )}
        </div>
      )}

      {/* Break Type Selection */}
      {showBreakOptions && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Select break type:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {["short", "lunch", "other"].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBreakType(type as "lunch" | "short" | "other")}
                className={cn(
                  "px-3 py-2 text-sm rounded-lg border transition-colors",
                  selectedBreakType === type
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {!currentShift ? (
          // Clock In
          <button
            onClick={() => {
              if (allowNotes || allowLocationTracking) {
                setShowNotes(true);
              } else {
                handleClockIn();
              }
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Clock In
          </button>
        ) : currentShift.status === "on_break" ? (
          // End Break
          <button
            onClick={() => {
              if (allowNotes) {
                setShowNotes(true);
              } else {
                handleBreakEnd();
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRightIcon className="w-5 h-5" />
            End Break
          </button>
        ) : (
          // Working - Show break and clock out options
          <div className="space-y-2">
            {allowBreaks && (
              <button
                onClick={() => {
                  if (allowNotes) {
                    setShowNotes(true);
                    setShowBreakOptions(true);
                  } else {
                    handleBreakStart();
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <TimeIcon className="w-5 h-5" />
                Start Break
              </button>
            )}
            <button
              onClick={() => {
                if (allowNotes || allowLocationTracking) {
                  setShowNotes(true);
                } else {
                  handleClockOut();
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CloseIcon className="w-5 h-5" />
              Clock Out
            </button>
          </div>
        )}

        {/* Confirm/Cancel buttons when showing notes */}
        {showNotes && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (!currentShift) {
                  handleClockIn();
                } else if (currentShift.status === "on_break") {
                  handleBreakEnd();
                } else if (showBreakOptions) {
                  handleBreakStart();
                } else {
                  handleClockOut();
                }
              }}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={() => {
                setShowNotes(false);
                setShowBreakOptions(false);
                setNotes("");
                setLocation("");
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mt-4 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification}
              className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"
            >
              <span className="text-sm text-orange-700 dark:text-orange-300">
                {notification === "break_reminder" && "Consider taking a break"}
              </span>
              <button
                onClick={() => dismissNotification(notification)}
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example usage:
// const currentShift: ShiftData = {
//   id: "shift-123",
//   employeeId: "emp-456",
//   startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
//   breaks: [
//     {
//       id: "break-1",
//       startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
//       endTime: new Date(Date.now() - 105 * 60 * 1000),
//       duration: 15,
//       type: "short"
//     }
//   ],
//   status: "active"
// };
//
// const stats: EmployeeStats = {
//   dailyHours: 6.5,
//   weeklyHours: 32.5,
//   monthlyHours: 140,
//   overtimeHours: 4.5,
//   breaksToday: 2,
//   avgDailyHours: 7.2
// };
//
// <TimeClockWidget
//   employeeId="emp-456"
//   employeeName="John Doe"
//   currentShift={currentShift}
//   stats={stats}
//   allowBreaks={true}
//   allowNotes={true}
//   onClockIn={(data) => console.log("Clock in:", data)}
//   onClockOut={(data) => console.log("Clock out:", data)}
//   onBreakStart={(data) => console.log("Break start:", data)}
//   onBreakEnd={(data) => console.log("Break end:", data)}
// />