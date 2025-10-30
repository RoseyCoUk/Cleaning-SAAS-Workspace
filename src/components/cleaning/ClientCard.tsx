"use client";
import React, { useState } from "react";
import { UserCircleIcon, EnvelopeIcon, CalenderIcon, DollarLineIcon, MoreDotIcon, ChatIcon, PencilIcon, TrashBinIcon } from "@/icons";
import { SendMessageModal } from "@/components/cleaning/SendMessageModal";
import { ClientDetailsDrawer } from "@/components/cleaning/ClientDetailsDrawer";
import { QuoteFormModal } from "@/components/cleaning/QuoteFormModal";
import { useQuotes } from "@/contexts/QuoteContext";

interface ClientCardProps {
  client: {
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
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
  const { addQuote } = useQuotes();
  const [showMenu, setShowMenu] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const getStatusColor = () => {
    switch (client.status) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-green-600";
      case "inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-amber-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  const getTagColor = (tag: string) => {
    if (tag === "VIP") return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400";
    if (tag.includes("week")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400";
    if (tag === "Auto-pay") return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  };

  const handleSendMessage = (data: { templateId: string; message: string; channel: "sms" | "email"; scheduledFor?: string }) => {
    console.log("Sending message:", data);
    // TODO: Integrate with messaging system/API
    setShowMessageModal(false);
  };

  return (
    <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
      {/* Status Ribbon */}
      <div className={`h-1 ${getStatusColor()}`} />

      <div className="p-6">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              </div>
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-900 ${
                client.status === "active" ? "bg-green-500" : "bg-gray-400"
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{client.address}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              <MoreDotIcon className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-8 z-20 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit Client
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete();
                        setShowMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <TrashBinIcon className="h-4 w-4" />
                      Delete Client
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <ChatIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{client.phone}</span>
            {client.preferredContact === "phone" && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-full">
                Preferred
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{client.email}</span>
            {client.preferredContact === "email" && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-xs rounded-full">
                Preferred
              </span>
            )}
          </div>
        </div>

        {/* Service Schedule */}
        <div className="space-y-2 mb-4">
          {client.nextService && (
            <div className="flex items-center gap-2 text-sm">
              <CalenderIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                Next: <span className="font-medium text-gray-800 dark:text-gray-200">{client.nextService}</span>
              </span>
            </div>
          )}
          {client.frequency && (
            <div className="flex items-center gap-2 text-sm">
              <CalenderIcon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                Schedule: <span className="font-medium text-gray-800 dark:text-gray-200">{client.frequency}</span>
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <DollarLineIcon className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              Lifetime: <span className="font-medium text-gray-800 dark:text-gray-200">${client.lifetimeValue.toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {client.tags.map((tag, index) => (
            <span key={index} className={`px-2 py-1 text-xs rounded-full ${getTagColor(tag)}`}>
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowMessageModal(true)}
            className="flex-1 px-3 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors"
          >
            Send Message
          </button>
          <button
            onClick={() => setShowDetailsDrawer(true)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Send Message Modal */}
      {showMessageModal && (
        <SendMessageModal
          client={{
            id: client.id,
            name: client.name,
            phone: client.phone,
            email: client.email,
            preferredContact: client.preferredContact,
          }}
          onSend={handleSendMessage}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {/* Client Details Drawer */}
      {showDetailsDrawer && (
        <ClientDetailsDrawer
          isOpen={showDetailsDrawer}
          client={client}
          onClose={() => setShowDetailsDrawer(false)}
          onEdit={onEdit}
          onCreateQuote={() => setShowCreateQuote(true)}
        />
      )}

      {/* Create Quote Modal */}
      {showCreateQuote && (
        <QuoteFormModal
          quote={null}
          preselectedClientId={client.id}
          onSave={(quote) => {
            addQuote({
              ...quote,
              id: Date.now().toString(),
              status: "draft",
              createdDate: new Date().toLocaleDateString(),
            });
            setShowCreateQuote(false);
          }}
          onClose={() => setShowCreateQuote(false)}
        />
      )}
    </div>
  );
};