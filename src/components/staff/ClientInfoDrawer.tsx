"use client";
import React from "react";
import { CloseIcon, UserIcon, EnvelopeIcon, FolderIcon, TaskIcon, CreditCardIcon } from "@/icons";

export interface ClientInfo {
  id: string;
  name: string;
  phone: string;
  address: string;
  specialInstructions: string;
  paymentMethod: string;
  jobHistory: {
    date: string;
    service: string;
    duration: string;
    status: "completed" | "cancelled";
  }[];
}

interface ClientInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientInfo;
}

export const ClientInfoDrawer: React.FC<ClientInfoDrawerProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl dark:bg-gray-950">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Client Information</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Client Name */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Name</label>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <span className="font-semibold text-gray-800 dark:text-white">{client.name}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <EnvelopeIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <a
                  href={`tel:${client.phone}`}
                  className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {client.phone}
                </a>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FolderIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <span className="text-gray-800 dark:text-white">{client.address}</span>
              </div>
            </div>

            {/* Special Instructions */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TaskIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Instructions</label>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <p className="text-sm text-gray-800 dark:text-white whitespace-pre-wrap">
                  {client.specialInstructions || "No special instructions"}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCardIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                <span className="text-gray-800 dark:text-white">{client.paymentMethod}</span>
              </div>
            </div>

            {/* Job History */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Job History</label>
              <div className="space-y-2">
                {client.jobHistory.length > 0 ? (
                  client.jobHistory.map((job, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800 dark:text-white">{job.service}</span>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            job.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span>{job.date}</span>
                        <span>•</span>
                        <span>{job.duration}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">No job history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
            <button
              onClick={onClose}
              className="w-full rounded-lg bg-gray-200 dark:bg-gray-800 px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
