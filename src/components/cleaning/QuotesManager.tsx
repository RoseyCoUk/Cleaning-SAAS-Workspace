"use client";
import React, { useState } from "react";
import { PlusIcon, CheckCircleIcon, TimeIcon, CloseLineIcon, MailIcon, PencilIcon, DownloadIcon } from "@/icons";
import { exportToCSV, prepareDataForExport } from "@/utils/exportUtils";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

type QuoteStatus = "draft" | "sent" | "accepted" | "expired";

interface Quote {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  frequency: string;
  estimatedHours: number;
  hourlyRate: number;
  totalEstimate: number;
  status: QuoteStatus;
  createdDate: string;
  sentDate?: string;
  expiryDate?: string;
  acceptedDate?: string;
  notes?: string;
}

// Quote Form Modal Component
interface QuoteFormModalProps {
  quote: Quote | null;
  onSave: (quote: Quote) => void;
  onClose: () => void;
}

const QuoteFormModal: React.FC<QuoteFormModalProps> = ({ quote, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Quote>>({
    clientName: quote?.clientName || "",
    clientEmail: quote?.clientEmail || "",
    clientPhone: quote?.clientPhone || "",
    service: quote?.service || "Regular Clean",
    frequency: quote?.frequency || "Weekly",
    estimatedHours: quote?.estimatedHours || 2,
    hourlyRate: quote?.hourlyRate || 50,
    notes: quote?.notes || "",
  });

  const totalEstimate = (formData.estimatedHours || 0) * (formData.hourlyRate || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newQuote: Quote = {
      id: quote?.id || "",
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
          {/* Client Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Client Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

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
                    ${totalEstimate}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.estimatedHours}h × ${formData.hourlyRate}/hr
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

// Sample quotes data
const sampleQuotes: Quote[] = [
  {
    id: "1",
    clientName: "Jennifer Smith",
    clientEmail: "jennifer@example.com",
    clientPhone: "(555) 111-2222",
    service: "Regular Clean",
    frequency: "Weekly",
    estimatedHours: 2,
    hourlyRate: 50,
    totalEstimate: 100,
    status: "sent",
    createdDate: "Dec 20, 2024",
    sentDate: "Dec 20, 2024",
    expiryDate: "Jan 3, 2025",
  },
  {
    id: "2",
    clientName: "Mark Williams",
    clientEmail: "mark@example.com",
    clientPhone: "(555) 333-4444",
    service: "Deep Clean",
    frequency: "One-Time",
    estimatedHours: 5,
    hourlyRate: 50,
    totalEstimate: 250,
    status: "accepted",
    createdDate: "Dec 18, 2024",
    sentDate: "Dec 18, 2024",
    acceptedDate: "Dec 19, 2024",
  },
  {
    id: "3",
    clientName: "Sarah Chen",
    clientEmail: "sarah@example.com",
    clientPhone: "(555) 555-6666",
    service: "Move-Out Clean",
    frequency: "One-Time",
    estimatedHours: 6,
    hourlyRate: 50,
    totalEstimate: 300,
    status: "draft",
    createdDate: "Dec 22, 2024",
  },
  {
    id: "4",
    clientName: "Tom Rodriguez",
    clientEmail: "tom@example.com",
    clientPhone: "(555) 777-8888",
    service: "Regular Clean",
    frequency: "Bi-Weekly",
    estimatedHours: 3,
    hourlyRate: 50,
    totalEstimate: 150,
    status: "expired",
    createdDate: "Nov 15, 2024",
    sentDate: "Nov 15, 2024",
    expiryDate: "Nov 30, 2024",
  },
];

export const QuotesManager = () => {
  const [quotes, setQuotes] = useState<Quote[]>(sampleQuotes);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);

  // Calculate KPIs
  const draftCount = quotes.filter((q) => q.status === "draft").length;
  const sentCount = quotes.filter((q) => q.status === "sent").length;
  const acceptedCount = quotes.filter((q) => q.status === "accepted").length;
  const expiredCount = quotes.filter((q) => q.status === "expired").length;

  // Filter quotes
  const filteredQuotes = quotes.filter((quote) => {
    if (statusFilter !== "all" && quote.status !== statusFilter) return false;
    return true;
  });

  const getStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "expired":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const handleSendQuote = (quoteId: string) => {
    // In production, this would send email/SMS
    setQuotes(
      quotes.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              status: "sent" as const,
              sentDate: new Date().toLocaleDateString(),
              expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            }
          : q
      )
    );
  };

  const handleMarkAccepted = (quoteId: string) => {
    // In production, this would create a booking
    setQuotes(
      quotes.map((q) =>
        q.id === quoteId
          ? {
              ...q,
              status: "accepted" as const,
              acceptedDate: new Date().toLocaleDateString(),
            }
          : q
      )
    );
  };

  const handleDeleteClick = (quote: Quote) => {
    setDeletingQuote(quote);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingQuote) {
      setQuotes(quotes.filter((q) => q.id !== deletingQuote.id));
      setShowDeleteModal(false);
      setDeletingQuote(null);
    }
  };

  const handleExport = () => {
    const exportData = prepareDataForExport(filteredQuotes, [
      "id",
      "clientName",
      "clientEmail",
      "clientPhone",
      "service",
      "frequency",
      "estimatedHours",
      "hourlyRate",
      "totalEstimate",
      "status",
      "createdDate",
      "sentDate",
      "expiryDate",
      "acceptedDate"
    ]);
    exportToCSV(exportData, `quotes-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quotes & Proposals
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage client quotes and convert to bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <DownloadIcon className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Create Quote
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{draftCount}</p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900/20 rounded-lg">
              <PencilIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sent</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{sentCount}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <MailIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{acceptedCount}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expired</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{expiredCount}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TimeIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | "all")}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Quotes List */}
      <div className="space-y-4">
        {filteredQuotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {quote.clientName}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(quote.status)}`}>
                    {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{quote.service} - {quote.frequency}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${quote.totalEstimate}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {quote.estimatedHours}h × ${quote.hourlyRate}/hr
                </p>
              </div>
            </div>

            {/* Quote Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Email:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quote.clientEmail}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quote.clientPhone}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Created:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{quote.createdDate}</span>
              </div>
              {quote.expiryDate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Expires:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{quote.expiryDate}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              {quote.status === "draft" && (
                <>
                  <button
                    onClick={() => handleSendQuote(quote.id)}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium"
                  >
                    Send Quote
                  </button>
                  <button
                    onClick={() => {
                      setEditingQuote(quote);
                      setShowCreateModal(true);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(quote)}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
              {quote.status === "sent" && (
                <>
                  <button
                    onClick={() => handleMarkAccepted(quote.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    Mark as Accepted
                  </button>
                  <button
                    onClick={() => handleSendQuote(quote.id)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  >
                    Resend
                  </button>
                  <button
                    onClick={() => handleDeleteClick(quote)}
                    className="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
              {quote.status === "accepted" && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircleIcon className="w-5 h-5" />
                  Accepted on {quote.acceptedDate} - Booking created
                </div>
              )}
              {quote.status === "expired" && (
                <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium">
                  Create New Quote
                </button>
              )}
              <button className="px-4 py-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuotes.length === 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No quotes found matching your filters</p>
        </div>
      )}

      {/* Create/Edit Quote Modal */}
      {showCreateModal && (
        <QuoteFormModal
          quote={editingQuote}
          onSave={(quote) => {
            if (editingQuote) {
              // Update existing quote
              setQuotes(quotes.map((q) => (q.id === quote.id ? quote : q)));
            } else {
              // Add new quote
              setQuotes([...quotes, { ...quote, id: Date.now().toString(), status: "draft", createdDate: new Date().toLocaleDateString() }]);
            }
            setShowCreateModal(false);
            setEditingQuote(null);
          }}
          onClose={() => {
            setShowCreateModal(false);
            setEditingQuote(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingQuote && (
        <DeleteConfirmationModal
          title="Delete Quote"
          message="Are you sure you want to delete this quote? This action cannot be undone."
          itemName={`Quote for ${deletingQuote.clientName} - ${deletingQuote.service}`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setDeletingQuote(null);
          }}
        />
      )}
    </div>
  );
};
