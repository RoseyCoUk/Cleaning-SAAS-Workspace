"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Invoice, Job } from "@/utils/invoiceUtils";

interface PendingBatchJob {
  id: string;
  job: Job;
  clientId: string;
  clientName: string;
  frequency: "weekly" | "monthly";
  createdAt: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  pendingBatchJobs: PendingBatchJob[];
  addPendingBatchJob: (job: PendingBatchJob) => void;
  getPendingJobsForClient: (clientId: string) => PendingBatchJob[];
  clearPendingJobsForClient: (clientId: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within InvoiceProvider");
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [pendingBatchJobs, setPendingBatchJobs] = useState<PendingBatchJob[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([
    // Initial sample data
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      clientId: "1",
      clientName: "Sarah Johnson",
      amount: 285,
      status: "paid",
      issueDate: "Dec 15, 2024",
      dueDate: "Dec 30, 2024",
      services: ["House Cleaning", "Deep Clean"],
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-002",
      clientId: "2",
      clientName: "Michael Chen",
      amount: 450,
      status: "pending",
      issueDate: "Dec 18, 2024",
      dueDate: "Jan 2, 2025",
      services: ["Office Cleaning", "Window Cleaning"],
    },
    {
      id: "3",
      invoiceNumber: "INV-2024-003",
      clientId: "3",
      clientName: "Emily Davis",
      amount: 780,
      status: "overdue",
      issueDate: "Nov 25, 2024",
      dueDate: "Dec 10, 2024",
      services: ["Commercial Cleaning", "Carpet Cleaning"],
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-004",
      clientId: "4",
      clientName: "Robert Wilson",
      amount: 320,
      status: "draft",
      issueDate: "Dec 20, 2024",
      dueDate: "Jan 5, 2025",
      services: ["House Cleaning"],
    },
  ]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices((prev) => [...prev, invoice]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const addPendingBatchJob = (job: PendingBatchJob) => {
    setPendingBatchJobs((prev) => [...prev, job]);
  };

  const getPendingJobsForClient = (clientId: string): PendingBatchJob[] => {
    return pendingBatchJobs.filter((job) => job.clientId === clientId);
  };

  const clearPendingJobsForClient = (clientId: string) => {
    setPendingBatchJobs((prev) => prev.filter((job) => job.clientId !== clientId));
  };

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        pendingBatchJobs,
        addPendingBatchJob,
        getPendingJobsForClient,
        clearPendingJobsForClient,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
