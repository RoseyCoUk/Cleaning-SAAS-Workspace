"use client";
import React, { useState } from "react";
import { CloseIcon, PlusIcon, TrashBinIcon } from "@/icons";
import type { Invoice } from "@/utils/invoiceUtils";
import { generateInvoiceNumber, formatDate, calculateDueDate } from "@/utils/invoiceUtils";
import { useClients } from "@/contexts/ClientContext";

interface LineItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
}

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invoice: Omit<Invoice, "id">) => void;
  existingInvoices: Invoice[];
  prefilledClientId?: string;
  prefilledClientName?: string;
}

export const CreateInvoiceModal: React.FC<CreateInvoiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingInvoices,
  prefilledClientId,
  prefilledClientName,
}) => {
  const { clients } = useClients();
  const [selectedClientId, setSelectedClientId] = useState(prefilledClientId || "");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [netDays, setNetDays] = useState(30);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", hours: 0, rate: 50 },
  ]);

  // Get selected client details
  const selectedClient = clients.find(c => c.id === selectedClientId);

  if (!isOpen) return null;

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Date.now().toString(),
        description: "",
        hours: 0,
        rate: 50,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) return; // Keep at least one line item
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.hours * item.rate, 0);
  };

  const handleSave = () => {
    // Validation
    if (!selectedClientId || !selectedClient) {
      alert("Please select a client");
      return;
    }

    if (lineItems.some((item) => !item.description.trim())) {
      alert("All line items must have a description");
      return;
    }

    const total = calculateTotal();
    if (total === 0) {
      if (!confirm("The invoice total is $0. Are you sure you want to create this invoice?")) {
        return;
      }
    }

    const invoiceNumber = generateInvoiceNumber(existingInvoices);
    const issueDateObj = new Date(issueDate);
    const dueDate = calculateDueDate(issueDateObj, netDays);

    const invoice: Omit<Invoice, "id"> = {
      invoiceNumber,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      amount: total,
      status: "draft",
      issueDate: formatDate(issueDateObj),
      dueDate: dueDate,
      services: lineItems.map((item) => `${item.description} (${item.hours}h × $${item.rate})`),
      notes: notes.trim() || undefined, // Only include if non-empty
    };

    onSave(invoice);
    onClose();

    // Reset form
    setSelectedClientId("");
    setIssueDate(new Date().toISOString().split("T")[0]);
    setNetDays(30);
    setNotes("");
    setLineItems([{ id: "1", description: "", hours: 0, rate: 50 }]);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Invoice
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Client <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">-- Select a client --</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
            {selectedClient && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {selectedClient.phone} | Hourly Rate: ${selectedClient.hourlyRate ?? 50}/hr
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issue Date
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Terms (Net Days)
              </label>
              <input
                type="number"
                value={netDays}
                onChange={(e) => setNetDays(Number(e.target.value))}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Line Items
              </label>
              <button
                onClick={addLineItem}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400"
              >
                <PlusIcon className="w-4 h-4" />
                Add Line
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-2 items-start bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg"
                >
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(item.id, "description", e.target.value)
                      }
                      placeholder="Service description"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                               focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.hours || ""}
                      onChange={(e) =>
                        updateLineItem(item.id, "hours", Number(e.target.value))
                      }
                      placeholder="Hours"
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                               focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.rate || ""}
                      onChange={(e) =>
                        updateLineItem(item.id, "rate", Number(e.target.value))
                      }
                      placeholder="Rate"
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
                               focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(item.hours * item.rate).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <TrashBinIcon className="w-4 h-4" />
                    </button>
                  </div>
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
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Internal Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any internal notes about this invoice..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  );
};
