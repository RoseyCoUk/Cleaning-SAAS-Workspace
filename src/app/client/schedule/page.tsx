"use client";
import { useState, useEffect, useRef } from "react";
import { CalenderIcon, CloseIcon } from "@/icons";

const upcomingCleanings = [
  { id: "1", date: "Nov 1, 2025", time: "9:00 AM", type: "Regular Clean", team: "Team A", status: "confirmed" },
  { id: "2", date: "Nov 15, 2025", time: "9:00 AM", type: "Regular Clean", team: "Team A", status: "confirmed" },
  { id: "3", date: "Nov 29, 2025", time: "9:00 AM", type: "Regular Clean", team: "Team B", status: "confirmed" },
  { id: "4", date: "Dec 13, 2025", time: "9:00 AM", type: "Deep Clean", team: "Team A", status: "scheduled" },
  { id: "5", date: "Dec 27, 2025", time: "9:00 AM", type: "Regular Clean", team: "Team A", status: "scheduled" },
];

const pastCleanings = [
  { date: "Oct 18, 2025", type: "Regular Clean", rating: 5, team: "Team A" },
  { date: "Oct 4, 2025", type: "Regular Clean", rating: 5, team: "Team A" },
  { date: "Sep 20, 2025", type: "Deep Clean", rating: 5, team: "Team B" },
  { date: "Sep 6, 2025", type: "Regular Clean", rating: 4, team: "Team A" },
  { date: "Aug 23, 2025", type: "Regular Clean", rating: 5, team: "Team A" },
  { date: "Aug 9, 2025", type: "Regular Clean", rating: 5, team: "Team A" },
];

type ViewMode = "list" | "calendar";

export default function ClientSchedulePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Form state
  const [serviceType, setServiceType] = useState("Regular Clean");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (8 AM - 12 PM)");
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In production, this would send to API
    console.log("Service request submitted:", {
      serviceType,
      preferredDate,
      preferredTime,
      specialInstructions,
    });

    // Show success state
    setRequestSubmitted(true);

    // Auto-close after 2 seconds and reset form
    timeoutRef.current = setTimeout(() => {
      setRequestSubmitted(false);
      setShowRequestModal(false);
      setServiceType("Regular Clean");
      setPreferredDate("");
      setPreferredTime("Morning (8 AM - 12 PM)");
      setSpecialInstructions("");
      timeoutRef.current = null;
    }, 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Upcoming Cleanings */}
      <div>
        <div className="mb-3 flex items-center justify-between sm:mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">
            Upcoming Cleanings
          </h2>

          {/* View Toggle */}
          <div className="flex gap-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors sm:text-sm ${
                viewMode === "list"
                  ? "bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors sm:text-sm ${
                viewMode === "calendar"
                  ? "bg-white text-brand-600 shadow-sm dark:bg-gray-700 dark:text-brand-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Calendar
            </button>
          </div>
        </div>

        {viewMode === "list" ? (
          <div className="space-y-3">
            {upcomingCleanings.map((cleaning, idx) => (
              <div
                key={cleaning.id}
                className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                        {cleaning.date}
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          cleaning.status === "confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {cleaning.status === "confirmed" ? "Confirmed" : "Scheduled"}
                      </span>
                    </div>
                    <div className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                      {cleaning.time} • {cleaning.type} • {cleaning.team}
                    </div>
                  </div>

                  {idx === 0 && (
                    <button className="flex-shrink-0 text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 sm:text-sm">
                      Reschedule
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            {/* Simple Calendar View */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                November - December 2025
              </h3>
            </div>

            <div className="space-y-3">
              {upcomingCleanings.map((cleaning) => (
                <div
                  key={cleaning.id}
                  className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800"
                >
                  <div className="flex-shrink-0">
                    <CalenderIcon className="h-5 w-5 text-brand-600 dark:text-brand-400 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
                        {cleaning.date} at {cleaning.time}
                      </div>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                          cleaning.status === "confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {cleaning.status === "confirmed" ? "Confirmed" : "Scheduled"}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
                      {cleaning.type} - {cleaning.team}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowRequestModal(true)}
          className="mt-3 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 sm:mt-4 sm:text-base"
        >
          Request Additional Service →
        </button>
      </div>

      {/* Request Service Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
            onClick={() => setShowRequestModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Request Additional Service
              </h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {!requestSubmitted ? (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Service Type
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>Regular Clean</option>
                    <option>Deep Clean</option>
                    <option>Move-In/Out Clean</option>
                    <option>Post-Construction Clean</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Preferred Time
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  >
                    <option>Morning (8 AM - 12 PM)</option>
                    <option>Afternoon (12 PM - 4 PM)</option>
                    <option>Evening (4 PM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="Any specific requests or areas to focus on..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white hover:bg-brand-700 active:scale-98 dark:bg-brand-500 dark:hover:bg-brand-600"
                >
                  Submit Request
                </button>
              </form>
            ) : (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100 dark:bg-success-900/30">
                  <svg
                    className="h-8 w-8 text-success-600 dark:text-success-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  Request Submitted!
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We&apos;ll review your request and get back to you shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Service History */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white sm:mb-4 sm:text-xl">
          Service History
        </h2>
        <div className="space-y-3">
          {pastCleanings.map((cleaning, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                    {cleaning.date}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {cleaning.type} • {cleaning.team}
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-0.5 text-sm text-yellow-500 sm:gap-1 sm:text-base">
                  {"★".repeat(cleaning.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
