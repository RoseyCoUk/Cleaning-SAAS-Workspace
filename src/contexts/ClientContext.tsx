"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email" | "sms";
  nextService?: string;
  lastService?: string;
  frequency: string;
  lifetimeValue: number;
  status: "active" | "inactive" | "pending";
  tags: string[];
  paymentMethod?: "auto-pay" | "invoice" | "credit-card" | "check" | "cash";
  hourlyRate?: number;
  referralSource?: "google" | "referral" | "facebook" | "instagram" | "nextdoor" | "other"; // GAP-026: Track customer acquisition
  invoicePreferences: {
    frequency: "per_job" | "weekly" | "monthly";
    autoSend: boolean;
    sendVia: {
      email: boolean;
      sms: boolean;
    };
  };
}

interface ClientContextType {
  clients: Client[];
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClient: (id: string) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error("useClients must be used within ClientProvider");
  }
  return context;
};

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientProvider: React.FC<ClientProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      address: "123 Main St, Suite 100",
      phone: "(555) 123-4567",
      email: "sarah@example.com",
      preferredContact: "phone",
      nextService: "Dec 28, 2024",
      lastService: "Dec 14, 2024",
      frequency: "Bi-weekly",
      lifetimeValue: 2450,
      status: "active",
      tags: ["Residential", "Premium"],
      paymentMethod: "auto-pay",
      hourlyRate: 45,
      invoicePreferences: {
        frequency: "per_job",
        autoSend: true,
        sendVia: { email: true, sms: false },
      },
    },
    {
      id: "2",
      name: "Michael Chen",
      address: "456 Oak Avenue",
      phone: "(555) 234-5678",
      email: "michael@example.com",
      preferredContact: "email",
      nextService: "Dec 29, 2024",
      lastService: "Dec 15, 2024",
      frequency: "Weekly",
      lifetimeValue: 1890,
      status: "active",
      tags: ["Commercial", "Regular"],
      paymentMethod: "invoice",
      hourlyRate: 50,
      invoicePreferences: {
        frequency: "weekly",
        autoSend: false,
        sendVia: { email: true, sms: false },
      },
    },
    {
      id: "3",
      name: "Emily Davis",
      address: "789 Pine Street",
      phone: "(555) 345-6789",
      email: "emily@example.com",
      preferredContact: "sms",
      nextService: "Jan 2, 2025",
      lastService: "Dec 18, 2024",
      frequency: "Monthly",
      lifetimeValue: 980,
      status: "active",
      tags: ["Residential"],
      paymentMethod: "credit-card",
      hourlyRate: 55,
      invoicePreferences: {
        frequency: "per_job",
        autoSend: true,
        sendVia: { email: true, sms: true },
      },
    },
    {
      id: "4",
      name: "Robert Wilson",
      address: "321 Elm Drive",
      phone: "(555) 456-7890",
      email: "robert@example.com",
      preferredContact: "email",
      nextService: "Dec 30, 2024",
      lastService: "Dec 16, 2024",
      frequency: "Bi-weekly",
      lifetimeValue: 1650,
      status: "active",
      tags: ["Commercial", "VIP"],
      paymentMethod: "check",
      hourlyRate: 60,
      invoicePreferences: {
        frequency: "monthly",
        autoSend: false,
        sendVia: { email: true, sms: false },
      },
    },
  ]);

  const addClient = (client: Client) => {
    setClients((prev) => [...prev, client]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((client) => (client.id === id ? { ...client, ...updates } : client))
    );
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((client) => client.id !== id));
  };

  const getClient = (id: string): Client | undefined => {
    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{ clients, addClient, updateClient, deleteClient, getClient }}
    >
      {children}
    </ClientContext.Provider>
  );
};
