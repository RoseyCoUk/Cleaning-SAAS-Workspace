"use client";
import React, { useState } from "react";
import {
  CloseIcon,
  UserCircleIcon,
  EnvelopeIcon,
  ChatIcon,
  CalenderIcon,
  DollarLineIcon,
  CreditCardIcon,
  PencilIcon,
  CheckCircleIcon,
  PlusIcon,
} from "@/icons";
import { useQuotes } from "@/contexts/QuoteContext";

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email" | "sms";
  nextService?: string;
  lastService?: string;
  frequency?: string;
  lifetimeValue: number;
  status: "active" | "inactive" | "pending";
  tags: string[];
  paymentMethod?: "auto-pay" | "invoice" | "credit-card" | "check" | "cash";
}

interface ServiceHistory {
  id: string;
  date: string;
  service: string;
  amount: number;
  duration?: string;
  status: "completed" | "cancelled" | "scheduled";
  notes?: string;
}

interface ClientDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  onEdit?: () => void;
  onCreateQuote?: () => void;
}

export const ClientDetailsDrawer: React.FC<ClientDetailsDrawerProps> = ({
  isOpen,
  onClose,
  client,
  onEdit,
  onCreateQuote,
}) => {
  const { getQuotesByClient } = useQuotes();
  const clientQuotes = getQuotesByClient(client.id);

  if (!isOpen) return null;

  // Mock service history (in real app, this would come from props or context)
  const serviceHistory: ServiceHistory[] = [
    {
      id: "1",
      date: "2024-10-20",
      service: "Deep Clean",
      amount: 250,
      duration: "3 hours",
      status: "completed",
      notes: "Kitchen and bathrooms",
    },
    {
      id: "2",
      date: "2024-10-06",
      service: "Standard Clean",
      amount: 150,
      duration: "2 hours",
      status: "completed",
    },
    {
      id: "3",
      date: "2024-09-22",
      service: "Standard Clean",
      amount: 150,
      duration: "2 hours",
      status: "completed",
    },
    {
      id: "4",
      date: "2024-11-03",
      service: "Standard Clean",
      amount: 150,
      status: "scheduled",
    },
  ];

  const getStatusColor = () => {
    switch (client.status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "inactive":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "pending":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "scheduled":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getTagColor = (tag: string) => {
    if (tag === "VIP") return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    if (tag.includes("week")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
    if (tag === "Auto-pay") return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  const getQuoteStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "accepted":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "expired":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl dark:bg-gray-950">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{client.name}</h2>
                  <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getStatusColor()} mt-1`}>
                    {client.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={onEdit}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Edit client"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Contact Information Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <ChatIcon className="h-5 w-5 text-brand-600 dark:text-brand-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Phone</label>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${client.phone}`}
                          className="text-sm font-medium text-gray-800 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {client.phone}
                        </a>
                        {client.preferredContact === "phone" && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-full">
                            Preferred
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-brand-600 dark:text-brand-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Email</label>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${client.email}`}
                          className="text-sm font-medium text-gray-800 dark:text-white hover:text-brand-600 dark:hover:text-brand-400"
                        >
                          {client.email}
                        </a>
                        {client.preferredContact === "email" && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-full">
                            Preferred
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <CalenderIcon className="h-5 w-5 text-brand-600 dark:text-brand-400 mt-0.5" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Address</label>
                      <p className="text-sm text-gray-800 dark:text-white">{client.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Schedule Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Service Schedule
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {client.nextService && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Next Service</label>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{client.nextService}</p>
                    </div>
                  )}
                  {client.lastService && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Last Service</label>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{client.lastService}</p>
                    </div>
                  )}
                  {client.frequency && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Frequency</label>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{client.frequency}</p>
                    </div>
                  )}
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Lifetime Value</label>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">${client.lifetimeValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Information Section */}
              {client.paymentMethod && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Payment Information
                  </h3>
                  <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
                    <CreditCardIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    <div className="flex-1">
                      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">Payment Method</label>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white capitalize">
                        {client.paymentMethod.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tags Section */}
              {client.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span key={index} className={`px-3 py-1 text-xs rounded-full ${getTagColor(tag)}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Quotes
                  </h3>
                  {onCreateQuote && (
                    <button
                      onClick={onCreateQuote}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <PlusIcon className="w-3 h-3" />
                      New Quote
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {clientQuotes.length > 0 ? (
                    clientQuotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">{quote.service}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getQuoteStatusColor(quote.status)}`}>
                                {quote.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{quote.frequency}</span>
                              <span>•</span>
                              <span>{quote.estimatedHours}h × ${quote.hourlyRate}/hr</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Created: {quote.createdDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-800 dark:text-white">${quote.totalEstimate.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 dark:border-gray-700 dark:bg-gray-900 text-center">
                      <DollarLineIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No quotes yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create a quote to get started</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Service History Section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                  Service History
                </h3>
                <div className="space-y-3">
                  {serviceHistory.length > 0 ? (
                    serviceHistory.map((service) => (
                      <div
                        key={service.id}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-900"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-800 dark:text-white">{service.service}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getServiceStatusColor(service.status)}`}>
                                {service.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{new Date(service.date).toLocaleDateString()}</span>
                              {service.duration && (
                                <>
                                  <span>•</span>
                                  <span>{service.duration}</span>
                                </>
                              )}
                            </div>
                            {service.notes && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{service.notes}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800 dark:text-white">${service.amount}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 dark:border-gray-700 dark:bg-gray-900 text-center">
                      <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No service history</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Services will appear here once scheduled</p>
                    </div>
                  )}
                </div>
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
