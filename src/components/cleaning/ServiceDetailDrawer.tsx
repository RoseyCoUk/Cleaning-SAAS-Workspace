"use client";
import React, { useState } from "react";
import {
  CloseIcon,
  UserCircleIcon,
  CalenderIcon,
  TimeIcon,
  DollarLineIcon,
  PencilIcon,
  CheckCircleIcon,
  CloseLineIcon,
  UserIcon,
  MailIcon,
} from "@/icons";

export interface ServiceDetail {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  service: string;
  frequency: string;
  date: string;
  time: string;
  duration: string;
  assignedStaff: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  price: number;
  notes?: string;
  instructions?: string;
  lastCompleted?: string;
  nextScheduled?: string;
}

interface ServiceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceDetail;
  onEdit?: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export const ServiceDetailDrawer: React.FC<ServiceDetailDrawerProps> = ({
  isOpen,
  onClose,
  service,
  onEdit,
  onComplete,
  onCancel,
}) => {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen) return null;

  const getStatusColor = (status: ServiceDetail["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const handleConfirmCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setShowCancelConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform transition-transform">
          <div className="flex h-full flex-col bg-white shadow-xl dark:bg-gray-900">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {service.service}
                    </h2>
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1).replace("-", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {service.clientName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="space-y-6">
                {/* Client Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Client Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/20">
                        <UserCircleIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.clientName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {service.clientEmail}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.clientPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                        <MailIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {service.clientAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Service Details
                  </h3>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Service Type</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.service}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Frequency</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.frequency}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Date</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.date}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Time</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.time}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Duration</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.duration}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Assigned Staff</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.assignedStaff}
                      </span>
                    </div>
                    <div className="px-4 py-3 flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Price</span>
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
                        ${service.price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {(service.lastCompleted || service.nextScheduled) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      Timeline
                    </h3>
                    <div className="space-y-3">
                      {service.lastCompleted && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
                            <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Last Completed</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.lastCompleted}
                            </p>
                          </div>
                        </div>
                      )}
                      {service.nextScheduled && (
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <CalenderIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Next Scheduled</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.nextScheduled}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                {service.instructions && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      Special Instructions
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {service.instructions}
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {service.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                      Notes
                    </h3>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {service.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
              <div className="space-y-3">
                {/* Primary Actions */}
                {service.status === "scheduled" && (
                  <div className="flex gap-3">
                    {onEdit && (
                      <button
                        onClick={onEdit}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-white hover:bg-brand-700 transition-colors font-medium"
                      >
                        <PencilIcon className="h-4 w-4" />
                        Edit Service
                      </button>
                    )}
                    {onComplete && (
                      <button
                        onClick={onComplete}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition-colors font-medium"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Complete
                      </button>
                    )}
                  </div>
                )}

                {service.status === "in-progress" && onComplete && (
                  <button
                    onClick={onComplete}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    Mark as Complete
                  </button>
                )}

                {/* Secondary Actions */}
                <div className="flex gap-3">
                  {service.status !== "completed" && service.status !== "cancelled" && onCancel && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="flex-1 rounded-lg border border-red-300 dark:border-red-600 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                    >
                      Cancel Service
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg bg-gray-200 dark:bg-gray-800 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <CloseLineIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Cancel Service
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to cancel this service for <strong>{service.clientName}</strong> on{" "}
              <strong>{service.date}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmCancel}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Yes, Cancel Service
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Keep Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
