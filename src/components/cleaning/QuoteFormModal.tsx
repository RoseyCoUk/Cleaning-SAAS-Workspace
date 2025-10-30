"use client";
import React, { useState, useEffect } from "react";
import { CloseLineIcon } from "@/icons";
import { Quote } from "@/contexts/QuoteContext";
import { useClients, Client } from "@/contexts/ClientContext";

interface QuoteFormModalProps {
  quote: Quote | null;
  onSave: (quote: Quote) => void;
  onClose: () => void;
  preselectedClientId?: string;
}

export const QuoteFormModal: React.FC<QuoteFormModalProps> = ({ quote, onSave, onClose, preselectedClientId }) => {
  const { clients } = useClients();
  const [formData, setFormData] = useState<Partial<Quote>>({
    clientId: quote?.clientId || preselectedClientId || "",
    clientName: quote?.clientName || "",
    clientEmail: quote?.clientEmail || "",
    clientPhone: quote?.clientPhone || "",
    service: quote?.service || "Regular Clean",
    frequency: quote?.frequency || "Weekly",
    estimatedHours: quote?.estimatedHours || 2,
    hourlyRate: quote?.hourlyRate || 50,
    notes: quote?.notes || "",
  });

  // Auto-populate client details when preselectedClientId is provided
  useEffect(() => {
    if (preselectedClientId && !quote) {
      const selectedClient = clients.find((c: Client) => c.id === preselectedClientId);
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientId: preselectedClientId,
          clientName: selectedClient.name,
          clientEmail: selectedClient.email,
          clientPhone: selectedClient.phone,
        }));
      }
    }
  }, [preselectedClientId, clients, quote]);

  // Auto-populate client details when client is selected
  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find((c: Client) => c.id === clientId);
    if (selectedClient) {
      setFormData({
        ...formData,
        clientId: clientId,
        clientName: selectedClient.name,
        clientEmail: selectedClient.email,
        clientPhone: selectedClient.phone,
      });
    }
  };

  const totalEstimate = (formData.estimatedHours || 0) * (formData.hourlyRate || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert("Please select a client");
      return;
    }
    const newQuote: Quote = {
      id: quote?.id || "",
      clientId: formData.clientId || "",
      clientName: formData.clientName || "",
      clientEmail: formData.clientEmail || "",
      clientPhone: formData.clientPhone || "",
      service: formData.service || "Regular Clean",
      frequency: formData.frequency || "Weekly",
      estimatedHours: formData.estimatedHours || 2,
      hourlyRate: formData.hourlyRate || 50,
      totalEstimate,
      status: quote?.status || "draft",
      createdDate: quote?.createdDate || "",
      // Preserve timeline metadata when editing
      sentDate: quote?.sentDate,
      expiryDate: quote?.expiryDate,
      acceptedDate: quote?.acceptedDate,
      notes: formData.notes,
    };
    onSave(newQuote);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {quote ? "Edit Quote" : "Create New Quote"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseLineIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Select Client</h3>
            <select
              value={formData.clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              disabled={!!preselectedClientId}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select a client...</option>
              {clients.map((client: Client) => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.email}
                </option>
              ))}
            </select>
            {preselectedClientId && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Client is pre-selected and cannot be changed
              </p>
            )}
          </div>

          {/* Client Information (Read-only display) */}
          {formData.clientId && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Client Information</h3>
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Client Name
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">{formData.clientName}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{formData.clientEmail}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white">{formData.clientPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Service Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Service Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="Regular Clean">Regular Clean</option>
                    <option value="Deep Clean">Deep Clean</option>
                    <option value="Move-Out Clean">Move-Out Clean</option>
                    <option value="Move-In Clean">Move-In Clean</option>
                    <option value="Office Clean">Office Clean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency *
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  >
                    <option value="One-Time">One-Time</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Pricing</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Estimated Hours *
                  </label>
                  <input
                    type="number"
                    required
                    min="0.5"
                    step="0.5"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hourly Rate ($) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="5"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
              <div className="bg-brand-50 dark:bg-brand-900/10 border border-brand-200 dark:border-brand-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Estimate:</span>
                  <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    ${totalEstimate.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.estimatedHours}h × ${(formData.hourlyRate || 0).toFixed(2)}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Any special requirements or notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-medium transition-colors"
            >
              {quote ? "Update Quote" : "Create Quote"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
