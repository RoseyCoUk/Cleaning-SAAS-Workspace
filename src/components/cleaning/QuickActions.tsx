"use client";
import React, { useState } from "react";
import { PlusIcon, UserIcon, CheckCircleIcon, CalenderIcon, DollarLineIcon } from "@/icons";
import { NewBookingModal } from "./NewBookingModal";
import { StaffCheckinModal } from "./StaffCheckinModal";
import { AddClientModal } from "./AllClients";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { useClients, type Client } from "@/contexts/ClientContext";
import { useInvoices } from "@/contexts/InvoiceContext";
import type { Invoice } from "@/utils/invoiceUtils";

const actions = [
  {
    title: "New Booking",
    icon: CalenderIcon,
    color: "bg-brand-100 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400",
    description: "Schedule a cleaning",
    action: "newBooking" as const,
  },
  {
    title: "Add Client",
    icon: UserIcon,
    color: "bg-fresh-100 text-fresh-600 dark:bg-fresh-900/20 dark:text-fresh-400",
    description: "Register new customer",
    action: "addClient" as const,
  },
  {
    title: "Generate Invoice",
    icon: DollarLineIcon,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    description: "Create billing statement",
    action: "generateInvoice" as const,
  },
  {
    title: "Staff Check-in",
    icon: CheckCircleIcon,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    description: "Clock in/out team",
    action: "staffCheckin" as const,
  },
];

export const QuickActions = () => {
  const { addClient } = useClients();
  const { addInvoice, invoices } = useInvoices();

  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);

  const handleActionClick = (actionType: typeof actions[number]["action"]) => {
    switch (actionType) {
      case "newBooking":
        setShowNewBookingModal(true);
        break;
      case "addClient":
        setShowAddClientModal(true);
        break;
      case "generateInvoice":
        setShowInvoiceModal(true);
        break;
      case "staffCheckin":
        setShowCheckinModal(true);
        break;
    }
  };

  const handleNewBooking = (booking: any) => {
    console.log("New booking created:", booking);
    setShowNewBookingModal(false);
    // In production, this would call an API to create the booking
  };

  const handleNewClient = (client: Client) => {
    addClient(client);
    setShowAddClientModal(false);
    alert(`SUCCESS: Client Added!\n\nClient "${client.name}" has been added successfully.`);
  };

  const handleGenerateInvoice = (invoiceData: Omit<Invoice, "id">) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    };
    addInvoice(newInvoice);
    setShowInvoiceModal(false);
    alert(`SUCCESS: Invoice Created!\n\nInvoice ${newInvoice.invoiceNumber} has been created successfully.`);
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quick Actions
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-3">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => handleActionClick(action.action)}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02] transition-all hover:scale-[1.02] text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {action.description}
                    </p>
                  </div>
                  <PlusIcon className="w-4 h-4 text-gray-400 ml-auto" />
                </button>
              );
            })}
          </div>

          {/* GAP-005: Removed "Tasks Need Attention" alert - no tasks page exists */}
        </div>
      </div>

      {/* Modals */}
      {showNewBookingModal && (
        <NewBookingModal
          onSave={handleNewBooking}
          onClose={() => setShowNewBookingModal(false)}
        />
      )}

      {showAddClientModal && (
        <AddClientModal
          onSave={handleNewClient}
          onClose={() => setShowAddClientModal(false)}
        />
      )}

      {showInvoiceModal && (
        <CreateInvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          onSave={handleGenerateInvoice}
          existingInvoices={invoices}
        />
      )}

      {showCheckinModal && (
        <StaffCheckinModal onClose={() => setShowCheckinModal(false)} />
      )}
    </>
  );
};