"use client";
import React, { useState, useRef, useEffect } from "react";
import { CloseIcon } from "@/icons";

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    date: string;
    type: string;
  };
  onSubmit: (issueType: string, description: string) => void;
}

export const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  isOpen,
  onClose,
  service,
  onSubmit,
}) => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const issueTypes = [
    "Incomplete Service",
    "Damaged Item",
    "Missed Area",
    "Scheduling Issue",
    "Staff Behavior",
    "Other",
  ];

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
    onSubmit(issueType, description);
    setSubmitted(true);

    // Auto-close after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setSubmitted(false);
      setIssueType("");
      setDescription("");
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
                Report Submitted
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We&apos;ll review your report and contact you shortly to resolve this issue.
              </p>
            </div>
          ) : (
            // Form State
            <>
              {/* Header */}
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Report Issue</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {service.type} - {service.date}
                    </p>
                  </div>
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
                {/* Issue Type */}
                <div>
                  <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What type of issue did you experience?
                  </label>
                  <select
                    id="issueType"
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select an issue type</option>
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Please describe the issue
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                    placeholder="Provide as much detail as possible about what happened..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-lg bg-brand-600 py-3 text-white hover:bg-brand-700 transition-colors font-medium"
                  >
                    Submit Report
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
