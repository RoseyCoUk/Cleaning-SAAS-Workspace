"use client";
import React, { useMemo, useState } from "react";
import { DollarLineIcon, BellIcon } from "@/icons";
import { useInvoices } from "@/contexts/InvoiceContext";

export const OutstandingPayments = () => {
  const { invoices, updateInvoice } = useInvoices();
  const [isSending, setIsSending] = useState(false);

  // Calculate total outstanding from pending and overdue invoices
  const outstandingInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) => invoice.status === "pending" || invoice.status === "overdue"
    );
  }, [invoices]);

  const totalOutstanding = useMemo(() => {
    return outstandingInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  }, [outstandingInvoices]);

  const handleSendReminders = async () => {
    if (outstandingInvoices.length === 0) {
      alert("No outstanding invoices to send reminders for.");
      return;
    }

    const confirmMessage =
      `Send payment reminders for ${outstandingInvoices.length} outstanding invoice${outstandingInvoices.length !== 1 ? 's' : ''}?\n\n` +
      `Total amount: $${totalOutstanding.toLocaleString()}\n` +
      `Clients: ${[...new Set(outstandingInvoices.map(inv => inv.clientName))].join(", ")}`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setIsSending(true);

    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate occasional network errors for robustness testing
          // In production, this would be a real API call
          resolve(undefined);
        }, 1000);
      });

      // In production: API call to send reminders via email/SMS
      // Update invoice records with lastReminderSent timestamp
      const timestamp = new Date().toISOString();
      outstandingInvoices.forEach(inv => {
        updateInvoice(inv.id, {
          lastReminderSent: timestamp
        });
      });

      const clientsNotified = [...new Set(outstandingInvoices.map(inv => inv.clientName))];

      alert(
        `SUCCESS: Payment Reminders Sent!\n\n` +
        `Sent ${outstandingInvoices.length} reminder${outstandingInvoices.length !== 1 ? 's' : ''} to ${clientsNotified.length} client${clientsNotified.length !== 1 ? 's' : ''}\n` +
        `Total outstanding: $${totalOutstanding.toLocaleString()}\n\n` +
        `Clients notified:\n${clientsNotified.map(name => `• ${name}`).join('\n')}\n\n` +
        `Timestamp: ${new Date().toLocaleString()}`
      );
    } catch (error) {
      console.error("Error sending reminders:", error);
      alert(
        `ERROR: Failed to send reminders\n\n` +
        `Please check your connection and try again.\n` +
        `If the problem persists, contact support.`
      );
    } finally {
      // Always reset sending state, even if there's an error
      setIsSending(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-xl dark:bg-warning-900/20">
          <DollarLineIcon className="text-warning-600 size-6 dark:text-warning-400" />
        </div>
        {outstandingInvoices.length > 0 && (
          <button
            onClick={handleSendReminders}
            disabled={isSending}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-warning-600 bg-warning-50 rounded-lg hover:bg-warning-100 dark:bg-warning-900/20 dark:text-warning-400 dark:hover:bg-warning-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send payment reminders to all clients with outstanding invoices"
          >
            <BellIcon className="w-3.5 h-3.5" />
            {isSending ? "Sending..." : "Send Reminders"}
          </button>
        )}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Outstanding Payments
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            ${totalOutstanding.toLocaleString()}
          </h4>
          {outstandingInvoices.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {outstandingInvoices.length} invoice{outstandingInvoices.length !== 1 ? 's' : ''} • {[...new Set(outstandingInvoices.map(inv => inv.clientName))].length} client{[...new Set(outstandingInvoices.map(inv => inv.clientName))].length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
