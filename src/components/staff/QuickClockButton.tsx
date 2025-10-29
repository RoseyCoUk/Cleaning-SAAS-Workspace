"use client";
import React, { useState, useEffect } from "react";
import { TimeIcon } from "@/icons";

export const QuickClockButton = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClock = () => {
    if (!isClockedIn) {
      setClockInTime(currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    } else {
      // Clock out - reset for next day
      setClockInTime(null);
    }
    setIsClockedIn(!isClockedIn);
  };

  const getElapsedHours = () => {
    if (!clockInTime) return "0.0";

    // Parse clock in time
    const [time, period] = clockInTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let clockInHour = hours;
    if (period === 'PM' && hours !== 12) clockInHour += 12;
    if (period === 'AM' && hours === 12) clockInHour = 0;

    const clockInMinutes = clockInHour * 60 + minutes;
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const elapsed = (currentMinutes - clockInMinutes) / 60;
    return Math.max(0, elapsed).toFixed(1);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white shadow-lg dark:border-gray-800">
      <div className="text-center">
        {/* Current Time Display */}
        <div className="flex items-center justify-center gap-2">
          <TimeIcon className="h-8 w-8 text-brand-100" />
          <div className="text-4xl font-bold tabular-nums">
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>

        {/* Current Date */}
        <div className="text-brand-100 mt-2 text-sm">
          {currentTime.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>

        {/* Clock In/Out Button */}
        <button
          onClick={handleClock}
          className={`mt-6 w-full rounded-xl py-4 text-lg font-semibold transition-all ${
            isClockedIn
              ? "bg-red-500 hover:bg-red-600 active:scale-95"
              : "bg-white text-brand-600 hover:bg-gray-100 active:scale-95"
          }`}
        >
          {isClockedIn ? "Clock Out" : "Clock In"}
        </button>

        {/* Status Display */}
        {isClockedIn && clockInTime && (
          <div className="mt-4 rounded-lg bg-white/10 px-4 py-3 text-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-brand-100">Clocked in at</span>
              <span className="font-semibold">{clockInTime}</span>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2">
              <span className="text-brand-100">Hours today</span>
              <span className="text-xl font-bold">{getElapsedHours()}h</span>
            </div>
          </div>
        )}

        {!isClockedIn && (
          <p className="mt-4 text-sm text-brand-100">
            Tap to clock in and start your day
          </p>
        )}
      </div>
    </div>
  );
};
