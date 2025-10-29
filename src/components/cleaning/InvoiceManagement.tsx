"use client";
import React, { useState } from "react";
import { CheckCircleIcon, DollarLineIcon, BellIcon } from "@/icons";
import { PaymentRecordModal, type PaymentRecord } from "./PaymentRecordModal";
import { InvoiceDetailModal } from "./InvoiceDetailModal";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { EditInvoiceModal } from "./EditInvoiceModal";
import { useInvoices } from "@/contexts/InvoiceContext";
import { useClients } from "@/contexts/ClientContext";
import { generateInvoiceNumber, formatDate, calculateDueDate, parseDuration } from "@/utils/invoiceUtils";
import { exportToCSV } from "@/utils/exportUtils";
import type { Invoice } from "@/utils/invoiceUtils";

export const InvoiceManagement = () => {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, pendingBatchJobs, clearPendingJobsForClient } = useInvoices();
  const { getClient } = useClients();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "overdue":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "draft":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const filteredInvoices = filterStatus === "all"
    ? invoices
    : invoices.filter(invoice => invoice.status === filterStatus);

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === "paid").reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === "pending").reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = invoices.filter(inv => inv.status === "overdue").reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleRecordPayment = (payment: PaymentRecord) => {
    console.log("Payment recorded:", payment);

    // Safety check: Require invoice selection
    if (!selectedInvoice) {
      alert("WARNING: No Invoice Selected\n\nPlease select an invoice before recording a payment.");
      return;
    }

    // Validate payment amount
    if (!payment.amount || payment.amount <= 0) {
      alert("WARNING: Invalid Payment Amount\n\nPayment amount must be greater than $0");
      return;
    }

    if (payment.amount < selectedInvoice.amount) {
      if (!confirm(
        `WARNING: Partial Payment\n\n` +
        `Payment: $${payment.amount.toFixed(2)}\n` +
        `Invoice Total: $${selectedInvoice.amount.toFixed(2)}\n` +
        `Outstanding: $${(selectedInvoice.amount - payment.amount).toFixed(2)}\n\n` +
        `Do you want to mark this invoice as PAID with a partial payment?`
      )) {
        return;
      }
    }

    // Update invoice status to paid
    if (selectedInvoice) {
      updateInvoice(selectedInvoice.id, { status: "paid" });
    }

    // Format the received date for display
    const receivedDate = new Date(payment.receivedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    // In production: API call to record payment and create payment record
    alert(
      `SUCCESS: Payment Recorded!\n\n` +
      `Method: ${payment.method.toUpperCase().replace("-", " ")}\n` +
      `Amount: $${payment.amount.toFixed(2)}\n` +
      `Reference: ${payment.referenceNumber || "N/A"}\n` +
      `Date: ${receivedDate}\n` +
      `Received By: ${payment.receivedBy}\n\n` +
      `Invoice status updated to PAID`
    );

    setShowPaymentModal(false);
    setSelectedInvoice(null);
  };

  const handleSendReminder = () => {
    alert("Payment reminder sent to client");
    // In production: API call to send reminder email/SMS
  };

  const openPaymentModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  const openDetailModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleMarkPaid = (invoice: Invoice) => {
    updateInvoice(invoice.id, { status: "paid" });
    setShowDetailModal(false);
    alert(`Invoice ${invoice.invoiceNumber} marked as paid`);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    alert(`Invoice ${invoice.invoiceNumber} sent to ${invoice.clientName} via email`);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    deleteInvoice(invoice.id);
    setShowDetailModal(false);
  };

  const handleCreateInvoice = (invoiceData: Omit<Invoice, "id">) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    };
    addInvoice(newInvoice);
    alert(`Invoice ${newInvoice.invoiceNumber} created successfully!`);
  };

  const openEditModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedInvoice: Invoice) => {
    updateInvoice(updatedInvoice.id, updatedInvoice);
    setShowEditModal(false);
    setSelectedInvoice(null);
    alert(`Invoice ${updatedInvoice.invoiceNumber} updated successfully!`);
  };

  const handleExportInvoices = () => {
    const exportData = filteredInvoices.map(invoice => ({
      "Invoice Number": invoice.invoiceNumber,
      "Client": invoice.clientName,
      "Amount": `$${invoice.amount.toFixed(2)}`,
      "Status": invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
      "Issue Date": invoice.issueDate,
      "Due Date": invoice.dueDate,
      "Services": invoice.services.join("; "),
      "Notes": invoice.notes || "N/A",
    }));

    const filename = `invoices_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(exportData, filename);
  };

  const handleGenerateBatchInvoices = () => {
    if (pendingBatchJobs.length === 0) return;

    // Group pending jobs by client
    const jobsByClient = pendingBatchJobs.reduce((acc, pendingJob) => {
      if (!acc[pendingJob.clientId]) {
        acc[pendingJob.clientId] = [];
      }
      acc[pendingJob.clientId].push(pendingJob);
      return acc;
    }, {} as Record<string, typeof pendingBatchJobs>);

    let generatedCount = 0;
    const generatedInvoices: Invoice[] = [];

    // Keep a working copy of invoices that includes newly generated ones
    const workingInvoices = [...invoices];

    // Generate one batch invoice per client
    Object.entries(jobsByClient).forEach(([clientId, jobs]) => {
      const client = getClient(clientId);
      if (!client) {
        console.warn(`Client ${clientId} not found, skipping batch`);
        return;
      }

      // Calculate total amount from all jobs
      const totalAmount = jobs.reduce((sum, pendingJob) => {
        // Parse duration and calculate amount
        const job = pendingJob.job;
        const hours = parseDuration(job.duration);
        const rate = client.hourlyRate ?? 50;
        return sum + (hours * rate);
      }, 0);

      // Create consolidated service list
      const services = jobs.map((pendingJob) =>
        `${pendingJob.job.service} (${pendingJob.job.duration}) - ${pendingJob.job.date}`
      );

      // Generate unique invoice number using working array
      const invoiceNumber = generateInvoiceNumber(workingInvoices);
      const issueDate = formatDate(new Date());
      const dueDate = calculateDueDate(new Date());

      const batchInvoice: Invoice = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 11) + generatedCount,
        invoiceNumber,
        clientId: client.id,
        clientName: client.name,
        amount: Math.round(totalAmount * 100) / 100,
        status: "pending",
        issueDate,
        dueDate,
        services,
        notes: `Batch invoice for ${jobs.length} job${jobs.length !== 1 ? 's' : ''} (${client.invoicePreferences.frequency} billing)`,
      };

      // Add to working array for next iteration
      workingInvoices.push(batchInvoice);
      generatedInvoices.push(batchInvoice);
      clearPendingJobsForClient(clientId);
      generatedCount++;
    });

    // Add all generated invoices to context
    generatedInvoices.forEach(invoice => addInvoice(invoice));

    alert(
      `SUCCESS: Batch Invoices Generated!\n\n` +
      `Generated ${generatedCount} batch invoice${generatedCount !== 1 ? 's' : ''}\n` +
      `Processed ${pendingBatchJobs.length} pending job${pendingBatchJobs.length !== 1 ? 's' : ''}\n\n` +
      `All invoices have been added with status: PENDING`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invoice Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track all your client invoices
          </p>
          <p className="text-sm text-success-600 dark:text-success-400 font-medium mt-1">
            Primary payment methods: Cash, Check, Bank Transfer
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleExportInvoices}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
          >
            <span>Export</span>
          </button>
          <button
            onClick={handleSendReminder}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <BellIcon className="h-4 w-4" />
            <span>Send Reminder</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Paid
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Overdue
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${overdueAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["all", "paid", "pending", "overdue", "draft"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Pending Batch Jobs Alert */}
      {pendingBatchJobs.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Pending Batch Jobs ({pendingBatchJobs.length})
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                {pendingBatchJobs.length} completed job{pendingBatchJobs.length !== 1 ? 's' : ''} waiting to be batched into invoices (weekly/monthly billing)
              </p>
              <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                {Object.entries(
                  pendingBatchJobs.reduce((acc, job) => {
                    const key = `${job.clientName}-${job.frequency}`;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([key, count]) => (
                  <div key={key}>
                    • {count} job{count !== 1 ? 's' : ''} for {key.split('-')[0]} ({key.split('-')[1].toUpperCase()})
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (confirm(`Generate batch invoices for all ${pendingBatchJobs.length} pending jobs?`)) {
                  handleGenerateBatchInvoices();
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Generate Batch Invoices
            </button>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.issueDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.clientName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {invoice.services.join(", ")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openDetailModal(invoice)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View
                    </button>
                    {(invoice.status === "pending" || invoice.status === "overdue") && (
                      <button
                        onClick={() => openPaymentModal(invoice)}
                        className="text-success-600 hover:text-success-900 dark:text-success-400 dark:hover:text-success-300 font-semibold"
                      >
                        Record Payment
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(invoice)}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Recording Modal */}
      <PaymentRecordModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSave={handleRecordPayment}
      />

      {/* Invoice Detail Modal */}
      {showDetailModal && selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onMarkPaid={handleMarkPaid}
          onSendEmail={handleSendInvoice}
          onEdit={(invoice) => {
            setShowDetailModal(false);
            openEditModal(invoice);
          }}
          onDelete={handleDeleteInvoice}
        />
      )}

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateInvoice}
        existingInvoices={invoices}
      />

      {/* Edit Invoice Modal */}
      {selectedInvoice && showEditModal && (
        <EditInvoiceModal
          invoice={selectedInvoice}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};