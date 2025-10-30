"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type QuoteStatus = "draft" | "sent" | "accepted" | "expired";

export interface Quote {
  id: string;
  clientId: string; // Link to Client.id
  clientName: string; // Denormalized for display
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

interface QuoteContextType {
  quotes: Quote[];
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  getQuote: (id: string) => Quote | undefined;
  getQuotesByClient: (clientId: string) => Quote[];
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuotes = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error("useQuotes must be used within QuoteProvider");
  }
  return context;
};

interface QuoteProviderProps {
  children: ReactNode;
}

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
  const [quotes, setQuotes] = useState<Quote[]>([
    {
      id: "1",
      clientId: "1", // Sarah Johnson
      clientName: "Sarah Johnson",
      clientEmail: "sarah@example.com",
      clientPhone: "(555) 123-4567",
      service: "Deep Clean",
      frequency: "Bi-Weekly",
      estimatedHours: 4,
      hourlyRate: 45,
      totalEstimate: 180,
      status: "accepted",
      createdDate: "2024-12-01",
      sentDate: "2024-12-01",
      acceptedDate: "2024-12-02",
      notes: "First-time deep clean for new client",
    },
    {
      id: "2",
      clientId: "2", // Michael Chen
      clientName: "Michael Chen",
      clientEmail: "michael@example.com",
      clientPhone: "(555) 234-5678",
      service: "Regular Clean",
      frequency: "Weekly",
      estimatedHours: 3,
      hourlyRate: 50,
      totalEstimate: 150,
      status: "sent",
      createdDate: "2024-12-15",
      sentDate: "2024-12-15",
      expiryDate: "2024-12-30",
      notes: "Includes kitchen and bathrooms",
    },
    {
      id: "3",
      clientId: "3", // Emily Davis
      clientName: "Emily Davis",
      clientEmail: "emily@example.com",
      clientPhone: "(555) 345-6789",
      service: "Move-Out Clean",
      frequency: "One-Time",
      estimatedHours: 6,
      hourlyRate: 55,
      totalEstimate: 330,
      status: "draft",
      createdDate: "2024-12-20",
      notes: "Apartment move-out cleaning",
    },
  ]);

  const addQuote = (quote: Quote) => {
    setQuotes((prev) => [...prev, quote]);
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) =>
      prev.map((quote) => (quote.id === id ? { ...quote, ...updates } : quote))
    );
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((quote) => quote.id !== id));
  };

  const getQuote = (id: string) => {
    return quotes.find((quote) => quote.id === id);
  };

  const getQuotesByClient = (clientId: string) => {
    return quotes.filter((quote) => quote.clientId === clientId);
  };

  return (
    <QuoteContext.Provider
      value={{
        quotes,
        addQuote,
        updateQuote,
        deleteQuote,
        getQuote,
        getQuotesByClient,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
};
