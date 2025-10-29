"use client";
import { useState, useEffect } from "react";
import { TimeIcon, CloseIcon } from "@/icons";

export const BreakTimer = () => {
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOnBreak && breakStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - breakStartTime.getTime()) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnBreak, breakStartTime]);

  const handleToggleBreak = () => {
    if (!isOnBreak) {
      // Start break
      setBreakStartTime(new Date());
      setIsOnBreak(true);
      setElapsedSeconds(0);
    } else {
      // End break
      setIsOnBreak(false);
      setBreakStartTime(null);
      setElapsedSeconds(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreakStatus = () => {
    if (elapsedSeconds >= 1800) { // 30 minutes
      return {
        text: "Break complete",
        color: "text-success-600 dark:text-success-400",
        bgColor: "bg-success-50 dark:bg-success-900/20",
        borderColor: "border-success-200 dark:border-success-900",
      };
    } else if (elapsedSeconds >= 1500) { // 25 minutes
      return {
        text: "Almost done",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-orange-200 dark:border-orange-900",
      };
    } else {
      return {
        text: "On break",
        color: "text-brand-600 dark:text-brand-400",
        bgColor: "bg-brand-50 dark:bg-brand-900/20",
        borderColor: "border-brand-200 dark:border-brand-900",
      };
    }
  };

  if (!isOnBreak) {
    return (
      <button
        onClick={handleToggleBreak}
        className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-brand-300 hover:bg-brand-50/50 active:scale-98 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-brand-900/10"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <CloseIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 dark:text-white">Start Lunch Break</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              30-minute break recommended
            </div>
          </div>
        </div>
      </button>
    );
  }

  const status = getBreakStatus();

  return (
    <div className={`rounded-xl border p-4 ${status.bgColor} ${status.borderColor}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <TimeIcon className={`h-5 w-5 ${status.color}`} />
            <span className={`text-sm font-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            Started at {breakStartTime?.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-4 text-center">
        <div className="text-4xl font-bold tabular-nums text-gray-900 dark:text-white">
          {formatTime(elapsedSeconds)}
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {elapsedSeconds < 1800 ? `${Math.floor((1800 - elapsedSeconds) / 60)} min remaining` : 'Break exceeded 30 min'}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className={`h-full transition-all duration-1000 ${
            elapsedSeconds >= 1800
              ? 'bg-success-500'
              : elapsedSeconds >= 1500
              ? 'bg-orange-500'
              : 'bg-brand-500'
          }`}
          style={{ width: `${Math.min((elapsedSeconds / 1800) * 100, 100)}%` }}
        />
      </div>

      {/* End Break Button */}
      <button
        onClick={handleToggleBreak}
        className="w-full rounded-lg bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 active:scale-98 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        End Break
      </button>
    </div>
  );
};
