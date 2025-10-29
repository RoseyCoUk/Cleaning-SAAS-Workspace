"use client";
import React, { useState, useRef, useEffect } from "react";
import { CloseIcon, CalenderIcon, TimeIcon, TaskIcon } from "@/icons";

interface RescheduleRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBooking: {
    date: string;
    time: string;
    type: string;
    team: string;
  };
  onSubmit: (data: { newDate: string; newTime: string; reason: string }) => void;
}

export const RescheduleRequestModal: React.FC<RescheduleRequestModalProps> = ({
  isOpen,
  onClose,
  currentBooking,
  onSubmit,
}) => {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ newDate, newTime, reason });
    setSubmitted(true);

    // Auto-close after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
      setNewDate("");
      setNewTime("");
      setReason("");
      onClose();
      timeoutRef.current = null;
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1001] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg">
        <div className="bg-white dark:bg-gray-950 rounded-xl shadow-2xl">
          {submitted ? (
            // Success State
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Request Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We&apos;ll review your reschedule request and get back to you shortly.
              </p>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Request Reschedule</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <CloseIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
                {/* Current Booking Info */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Current Booking</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CalenderIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{currentBooking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TimeIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{currentBooking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TaskIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{currentBooking.type}</span>
                    </div>
                  </div>
                </div>

                {/* New Date */}
                <div>
                  <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred New Date
                  </label>
                  <input
                    type="date"
                    id="newDate"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* New Time */}
                <div>
                  <label htmlFor="newTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Time
                  </label>
                  <select
                    id="newTime"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select a time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                </div>

                {/* Reason */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Reschedule
                  </label>
                  <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    rows={3}
                    placeholder="Please let us know why you need to reschedule..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-brand-600 py-3 text-white hover:bg-brand-700 transition-colors font-medium"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg bg-gray-200 dark:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
