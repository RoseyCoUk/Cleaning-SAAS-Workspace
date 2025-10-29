"use client";
import React from "react";
import { CloseIcon, CheckCircleIcon, BellIcon, PencilIcon, TrashBinIcon } from "@/icons";
import type { Invoice } from "@/utils/invoiceUtils";

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
  onMarkPaid?: (invoice: Invoice) => void;
  onSendEmail?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  onClose,
  onMarkPaid,
  onSendEmail,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "overdue":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "draft":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const handleMarkPaid = () => {
    if (onMarkPaid) {
      onMarkPaid(invoice);
    } else {
      alert(`Invoice ${invoice.invoiceNumber} marked as paid`);
    }
  };

  const handleSendEmail = () => {
    if (onSendEmail) {
      onSendEmail(invoice);
    } else {
      alert(`Invoice ${invoice.invoiceNumber} sent to ${invoice.clientName}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(invoice);
    } else {
      alert("Edit functionality coming soon");
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      if (onDelete) {
        onDelete(invoice);
      } else {
        alert(`Invoice ${invoice.invoiceNumber} deleted`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Invoice Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {invoice.invoiceNumber}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoice.status)}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Client Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {invoice.clientName}
              </p>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Issue Date
              </h3>
              <p className="text-gray-900 dark:text-white">{invoice.issueDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Due Date
              </h3>
              <p className="text-gray-900 dark:text-white">{invoice.dueDate}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Services
            </h3>
            <div className="space-y-2">
              {invoice.services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3"
                >
                  <span className="text-gray-900 dark:text-white">{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${invoice.amount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            {invoice.status !== "paid" && (
              <button
                onClick={handleMarkPaid}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircleIcon className="w-5 h-5" />
                Mark as Paid
              </button>
            )}
            <button
              onClick={handleSendEmail}
              className={`flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors ${
                invoice.status === "paid" ? "col-span-2" : ""
              }`}
            >
              <BellIcon className="w-5 h-5" />
              Send to Client
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <TrashBinIcon className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
