"use client";
import React, { useState } from "react";
import { PlusIcon, CheckCircleIcon, TimeIcon, MailIcon, PencilIcon, DownloadIcon } from "@/icons";
import { exportToCSV, prepareDataForExport } from "@/utils/exportUtils";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { QuoteFormModal } from "./QuoteFormModal";
import { QuoteDetailModal } from "./QuoteDetailModal";
import { useQuotes, Quote, QuoteStatus } from "@/contexts/QuoteContext";
import { useClients, Client } from "@/contexts/ClientContext";

interface QuotesManagerProps {
  clientId?: string; // Optional client filter
}

export const QuotesManager: React.FC<QuotesManagerProps> = ({ clientId }) => {
  const { quotes, addQuote, updateQuote, deleteQuote, getQuotesByClient } = useQuotes();
  const { clients } = useClients();
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [clientFilter, setClientFilter] = useState<string>(clientId || "all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null);
  const [viewingQuote, setViewingQuote] = useState<Quote | null>(null);

  // Get quotes based on client filter
  const displayQuotes = clientFilter === "all" ? quotes : getQuotesByClient(clientFilter);

  // Calculate KPIs (based on filtered client quotes)
  const draftCount = displayQuotes.filter((q) => q.status === "draft").length;
  const sentCount = displayQuotes.filter((q) => q.status === "sent").length;
  const acceptedCount = displayQuotes.filter((q) => q.status === "accepted").length;
  const expiredCount = displayQuotes.filter((q) => q.status === "expired").length;

  // Filter quotes by status
  const filteredQuotes = displayQuotes.filter((quote) => {
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
    updateQuote(quoteId, {
      status: "sent",
      sentDate: new Date().toLocaleDateString(),
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  };

  const handleMarkAccepted = (quoteId: string) => {
    // In production, this would create a booking
    updateQuote(quoteId, {
      status: "accepted",
      acceptedDate: new Date().toLocaleDateString(),
    });
  };

  const handleDeleteClick = (quote: Quote) => {
    setDeletingQuote(quote);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deletingQuote) {
      deleteQuote(deletingQuote.id);
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
        <div className="flex flex-wrap gap-4">
          {/* Client Filter */}
          {!clientId && ( // Only show client filter if not viewing from client details
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Clients</option>
              {clients.map((client: Client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          )}

          {/* Status Filter */}
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
                  ${quote.totalEstimate.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {quote.estimatedHours}h × ${quote.hourlyRate.toFixed(2)}/hr
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
              <button
                onClick={() => {
                  setViewingQuote(quote);
                  setShowDetailModal(true);
                }}
                className="px-4 py-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
              >
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
          preselectedClientId={clientId}
          onSave={(quote) => {
            if (editingQuote) {
              // Update existing quote
              updateQuote(quote.id, quote);
            } else {
              // Add new quote
              addQuote({
                ...quote,
                id: Date.now().toString(),
                status: "draft",
                createdDate: new Date().toLocaleDateString(),
              });
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

      {/* Quote Detail Modal */}
      {showDetailModal && viewingQuote && (
        <QuoteDetailModal
          quote={viewingQuote}
          onClose={() => {
            setShowDetailModal(false);
            setViewingQuote(null);
          }}
          onEdit={(quote) => {
            setShowDetailModal(false);
            setEditingQuote(quote);
            setShowCreateModal(true);
          }}
          onSend={(quote) => {
            const expiryDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString();
            updateQuote(quote.id, {
              ...quote,
              status: "sent",
              sentDate: new Date().toLocaleDateString(),
              expiryDate: expiryDate,
            });
            alert(`Quote sent to ${quote.clientName} via email\nExpires: ${expiryDate}`);
            setShowDetailModal(false);
            setViewingQuote(null);
          }}
          onMarkAccepted={(quote) => {
            handleMarkAccepted(quote.id);
            setShowDetailModal(false);
            setViewingQuote(null);
          }}
          onDelete={(quote) => {
            setShowDetailModal(false);
            setDeletingQuote(quote);
            setShowDeleteModal(true);
          }}
        />
      )}
    </div>
  );
};
