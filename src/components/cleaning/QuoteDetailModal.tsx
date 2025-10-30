"use client";
import React from "react";
import { CloseIcon, EnvelopeIcon, CalenderIcon, DollarLineIcon } from "@/icons";
import type { Quote } from "@/contexts/QuoteContext";

interface QuoteDetailModalProps {
  quote: Quote;
  onClose: () => void;
  onEdit?: (quote: Quote) => void;
  onSend?: (quote: Quote) => void;
  onMarkAccepted?: (quote: Quote) => void;
  onDelete?: (quote: Quote) => void;
}

export const QuoteDetailModal: React.FC<QuoteDetailModalProps> = ({
  quote,
  onClose,
  onEdit,
  onSend,
  onMarkAccepted,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "declined":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "expired":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Quote Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {quote.service} - {quote.frequency}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(quote.status)}`}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Client Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{quote.clientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{quote.clientEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{quote.clientPhone}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Service Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Service Type</p>
                <p className="font-medium text-gray-900 dark:text-white">{quote.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Frequency</p>
                <p className="font-medium text-gray-900 dark:text-white">{quote.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Hours</p>
                <p className="font-medium text-gray-900 dark:text-white">{quote.estimatedHours}h</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
                <p className="font-medium text-gray-900 dark:text-white">${quote.hourlyRate.toFixed(2)}/hr</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarLineIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Estimate</span>
              </div>
              <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                ${quote.totalEstimate.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {quote.estimatedHours}h × ${quote.hourlyRate.toFixed(2)}/hr
            </p>
          </div>

          {/* Quote Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Timeline
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalenderIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Created:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{quote.createdDate}</span>
              </div>
              {quote.sentDate && (
                <div className="flex items-center gap-2">
                  <CalenderIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Sent:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{quote.sentDate}</span>
                </div>
              )}
              {quote.acceptedDate && (
                <div className="flex items-center gap-2">
                  <CalenderIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Accepted:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{quote.acceptedDate}</span>
                </div>
              )}
              {quote.expiryDate && (
                <div className="flex items-center gap-2">
                  <CalenderIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Expires:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{quote.expiryDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {quote.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
                Notes
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">{quote.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            {onDelete && quote.status !== "accepted" && (
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete this quote for ${quote.clientName}?`)) {
                    onDelete(quote);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Close
            </button>
            {onEdit && quote.status !== "accepted" && (
              <button
                onClick={() => onEdit(quote)}
                className="px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
              >
                Edit Quote
              </button>
            )}
            {onSend && quote.status === "draft" && (
              <button
                onClick={() => onSend(quote)}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Send to Client
              </button>
            )}
            {onSend && quote.status === "sent" && (
              <button
                onClick={() => onSend(quote)}
                className="px-4 py-2 text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
              >
                Resend
              </button>
            )}
            {onMarkAccepted && quote.status === "sent" && (
              <button
                onClick={() => onMarkAccepted(quote)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Mark as Accepted
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
