"use client";
import React, { useState } from "react";
import { CloseIcon } from "@/icons";

interface NewBookingModalProps {
  onSave: (booking: {
    clientName: string;
    service: string;
    frequency: string;
    date: string;
    time: string;
    assignedStaff: string;
  }) => void;
  onClose: () => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({ onSave, onClose }) => {
  const [bookingType, setBookingType] = useState<"one-off" | "recurring">("recurring");
  const [lastRecurringFrequency, setLastRecurringFrequency] = useState<string>("Weekly");
  const [formData, setFormData] = useState({
    clientName: "",
    service: "Regular Clean",
    frequency: "Weekly",
    date: "",
    time: "",
    assignedStaff: "Team A",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For one-off bookings, ensure frequency is set to "One-Off"
    const bookingData = {
      ...formData,
      frequency: bookingType === "one-off" ? "One-Off" : formData.frequency
    };
    onSave(bookingData);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Remember recurring frequency selections
    if (name === "frequency" && bookingType === "recurring" && value !== "One-Off") {
      setLastRecurringFrequency(value);
    }
  };

  const handleBookingTypeChange = (type: "one-off" | "recurring") => {
    setBookingType(type);
    // Auto-set frequency based on type
    if (type === "one-off") {
      setFormData({ ...formData, frequency: "One-Off" });
    } else {
      // Restore last recurring frequency when switching back
      setFormData({ ...formData, frequency: lastRecurringFrequency });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1001] flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            New Booking
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-lg h-11 w-11 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <CloseIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Booking Type Toggle */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Booking Type
              </label>
              <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-700 p-1 bg-gray-50 dark:bg-gray-800/50">
                <button
                  type="button"
                  onClick={() => handleBookingTypeChange("one-off")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    bookingType === "one-off"
                      ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  One-Off Service
                </button>
                <button
                  type="button"
                  onClick={() => handleBookingTypeChange("recurring")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    bookingType === "recurring"
                      ? "bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  Recurring Booking
                </button>
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                placeholder="Enter or search client name"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Service Type
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Regular Clean">Regular Clean</option>
                <option value="Deep Clean">Deep Clean</option>
                <option value="Move-Out">Move-Out</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Recurring Details (only show for recurring bookings) */}
            {bookingType === "recurring" && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Recurring Schedule
                </h3>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Frequency
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="4-Week">4-Week</option>
                  </select>
                </div>
              </div>
            )}

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>

            {/* Assigned Staff */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Assign to Team
              </label>
              <select
                name="assignedStaff"
                value={formData.assignedStaff}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                <option value="Team A">Team A</option>
                <option value="Team B">Team B</option>
                <option value="Team C">Team C</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
