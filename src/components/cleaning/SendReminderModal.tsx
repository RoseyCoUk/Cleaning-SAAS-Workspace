"use client";
import React, { useState, useMemo } from "react";
import { CloseIcon, EnvelopeIcon, ChatIcon } from "@/icons";
import type { Invoice } from "@/utils/invoiceUtils";

interface SendReminderModalProps {
  invoices: Invoice[];
  onClose: () => void;
  onSend: (selectedInvoiceIds: string[], channel: "email" | "sms") => void;
}

export const SendReminderModal: React.FC<SendReminderModalProps> = ({
  invoices,
  onClose,
  onSend,
}) => {
  const [reminderType, setReminderType] = useState<"overdue" | "selected">("overdue");
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const overdueInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status === "overdue");
  }, [invoices]);

  const pendingInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status === "pending" || inv.status === "overdue");
  }, [invoices]);

  const targetInvoices = reminderType === "overdue" ? overdueInvoices : Array.from(selectedIds).map(id => invoices.find(inv => inv.id === id)!).filter(Boolean);

  const uniqueClients = useMemo(() => {
    return [...new Set(targetInvoices.map(inv => inv.clientName))];
  }, [targetInvoices]);

  const totalAmount = useMemo(() => {
    return targetInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  }, [targetInvoices]);

  const handleToggleInvoice = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSend = () => {
    const invoiceIds = reminderType === "overdue"
      ? overdueInvoices.map(inv => inv.id)
      : Array.from(selectedIds);

    if (invoiceIds.length === 0) {
      alert("Please select at least one invoice to send reminders for.");
      return;
    }

    onSend(invoiceIds, channel);
  };

  const canSend = reminderType === "overdue" ? overdueInvoices.length > 0 : selectedIds.size > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Send Payment Reminders
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Reminder Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Select Recipients
            </label>
            <div className="space-y-2">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                style={{
                  borderColor: reminderType === "overdue" ? "rgb(37, 99, 235)" : "rgb(209, 213, 219)",
                }}
              >
                <input
                  type="radio"
                  name="reminderType"
                  value="overdue"
                  checked={reminderType === "overdue"}
                  onChange={(e) => setReminderType(e.target.value as "overdue")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    All Overdue Invoices
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Send reminders to all clients with overdue invoices ({overdueInvoices.length} invoice{overdueInvoices.length !== 1 ? 's' : ''})
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                style={{
                  borderColor: reminderType === "selected" ? "rgb(37, 99, 235)" : "rgb(209, 213, 219)",
                }}
              >
                <input
                  type="radio"
                  name="reminderType"
                  value="selected"
                  checked={reminderType === "selected"}
                  onChange={(e) => setReminderType(e.target.value as "selected")}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    Select Specific Invoices
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Choose which invoices to send reminders for
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Invoice Selection (when "selected" is chosen) */}
          {reminderType === "selected" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Choose Invoices ({selectedIds.size} selected)
              </label>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg max-h-64 overflow-y-auto">
                {pendingInvoices.map((invoice) => (
                  <label
                    key={invoice.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(invoice.id)}
                      onChange={() => handleToggleInvoice(invoice.id)}
                      className="rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {invoice.invoiceNumber}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          invoice.status === "overdue"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {invoice.clientName} • ${invoice.amount.toFixed(2)} • Due {invoice.dueDate}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Channel Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Delivery Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                style={{
                  borderColor: channel === "email" ? "rgb(37, 99, 235)" : "rgb(209, 213, 219)",
                }}
              >
                <input
                  type="radio"
                  name="channel"
                  value="email"
                  checked={channel === "email"}
                  onChange={(e) => setChannel(e.target.value as "email")}
                />
                <EnvelopeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-gray-900 dark:text-white">Email</span>
              </label>

              <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                style={{
                  borderColor: channel === "sms" ? "rgb(37, 99, 235)" : "rgb(209, 213, 219)",
                }}
              >
                <input
                  type="radio"
                  name="channel"
                  value="sms"
                  checked={channel === "sms"}
                  onChange={(e) => setChannel(e.target.value as "sms")}
                />
                <ChatIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">SMS</span>
              </label>
            </div>
          </div>

          {/* Summary */}
          {canSend && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Reminder Summary
              </h3>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                <p>• {targetInvoices.length} invoice{targetInvoices.length !== 1 ? 's' : ''} to remind</p>
                <p>• {uniqueClients.length} client{uniqueClients.length !== 1 ? 's' : ''} will be notified</p>
                <p>• Total outstanding: ${totalAmount.toFixed(2)}</p>
                <p>• Channel: {channel.toUpperCase()}</p>
              </div>
              {uniqueClients.length <= 5 && (
                <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Recipients: {uniqueClients.join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send {targetInvoices.length} Reminder{targetInvoices.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
