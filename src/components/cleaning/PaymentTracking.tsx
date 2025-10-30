"use client";
import React, { useState } from "react";
import { CheckCircleIcon, DownloadIcon } from "@/icons";
import { exportToCSV, prepareDataForExport } from "@/utils/exportUtils";

interface Payment {
  id: string;
  transactionId: string;
  clientName: string;
  amount: number;
  method: "card" | "bank" | "cash" | "check";
  status: "completed" | "pending" | "failed" | "refunded";
  date: string;
  invoiceNumber: string;
  description: string;
}

export const PaymentTracking = () => {
  const [payments] = useState<Payment[]>([
    {
      id: "1",
      transactionId: "TXN-2024-001",
      clientName: "Johnson Family",
      amount: 285,
      method: "card",
      status: "completed",
      date: "Dec 15, 2024",
      invoiceNumber: "INV-2024-001",
      description: "House Cleaning Service"
    },
    {
      id: "2",
      transactionId: "TXN-2024-002",
      clientName: "Smith Residence",
      amount: 450,
      method: "bank",
      status: "pending",
      date: "Dec 18, 2024",
      invoiceNumber: "INV-2024-002",
      description: "Office Cleaning Service"
    },
    {
      id: "3",
      transactionId: "TXN-2024-003",
      clientName: "Brown Corporation",
      amount: 780,
      method: "card",
      status: "failed",
      date: "Dec 10, 2024",
      invoiceNumber: "INV-2024-003",
      description: "Commercial Cleaning Service"
    },
    {
      id: "4",
      transactionId: "TXN-2024-004",
      clientName: "Davis Home",
      amount: 150,
      method: "cash",
      status: "completed",
      date: "Dec 12, 2024",
      invoiceNumber: "INV-2024-004",
      description: "Window Cleaning Service"
    },
    {
      id: "5",
      transactionId: "TXN-2024-005",
      clientName: "Miller Office",
      amount: 320,
      method: "check",
      status: "refunded",
      date: "Dec 8, 2024",
      invoiceNumber: "INV-2024-005",
      description: "Deep Cleaning Service"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "failed":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "refunded":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "cash":
        return "text-success-700 bg-success-100 dark:text-success-300 dark:bg-success-900/20 font-semibold";
      case "check":
        return "text-success-700 bg-success-100 dark:text-success-300 dark:bg-success-900/20 font-semibold";
      case "bank":
        return "text-success-700 bg-success-100 dark:text-success-300 dark:bg-success-900/20 font-semibold";
      case "card":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const filteredPayments = payments.filter(payment => {
    const statusMatch = filterStatus === "all" || payment.status === filterStatus;
    const methodMatch = filterMethod === "all" || payment.method === filterMethod;
    return statusMatch && methodMatch;
  });

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = payments.filter(p => p.status === "completed").reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, payment) => sum + payment.amount, 0);
  const failedAmount = payments.filter(p => p.status === "failed").reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate manual payment stats (cash + check + bank)
  const manualPayments = payments.filter(p => ["cash", "check", "bank"].includes(p.method) && p.status === "completed");
  const manualAmount = manualPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const manualPercentage = completedAmount > 0 ? ((manualAmount / completedAmount) * 100).toFixed(1) : "0";

  const cardPayments = payments.filter(p => p.method === "card" && p.status === "completed");
  const cardAmount = cardPayments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleExportPayments = () => {
    // Helper to parse dates safely for Safari compatibility
    const parseDate = (dateStr: string): string => {
      // Try parsing as-is first
      let parsed = Date.parse(dateStr);

      // If invalid, try adding " UTC" for Safari compatibility
      if (isNaN(parsed)) {
        parsed = Date.parse(`${dateStr} UTC`);
      }

      // If still invalid, return original string
      if (isNaN(parsed)) {
        return dateStr;
      }

      // Return ISO format
      return new Date(parsed).toISOString().split('T')[0];
    };

    // Format data before export
    const formattedPayments = filteredPayments.map(payment => ({
      ...payment,
      amount: payment.amount.toFixed(2), // Format to 2 decimals
      date: parseDate(payment.date) // Convert to ISO date format (Safari-safe)
    }));

    const exportData = prepareDataForExport(formattedPayments, [
      "transactionId",
      "date",
      "clientName",
      "invoiceNumber",
      "amount",
      "method",
      "status",
      "description"
    ]);

    // Add total row
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    exportData.push({
      transactionId: "TOTAL",
      date: "",
      clientName: "",
      invoiceNumber: "",
      amount: totalAmount.toFixed(2),
      method: "",
      status: "",
      description: `Total of ${filteredPayments.length} payment(s)`
    });

    const timestamp = new Date().toISOString().split('T')[0];
    exportToCSV(exportData, `payment-report-${timestamp}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payment Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage all payment transactions
          </p>
          <p className="text-sm text-success-600 dark:text-success-400 font-medium mt-1">
            Cash, Check, and Bank Transfer recommended (no fees)
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2 flex-wrap">
          <button
            onClick={handleExportPayments}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <DownloadIcon className="w-4 h-4" />
            <span>Export Report ({filteredPayments.length} payments)</span>
          </button>
        </div>
      </div>

      {/* Payment Method Breakdown - EMPHASIZED */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-900/10 p-6 rounded-lg border-2 border-success-300 dark:border-success-700">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-success-700 dark:text-success-300 uppercase tracking-wide">
                Manual Payments (Preferred)
              </p>
              <p className="text-xs text-success-600 dark:text-success-400 mt-1">
                Cash • Check • Bank Transfer
              </p>
            </div>
            <div className="w-10 h-10 bg-success-200 dark:bg-success-800 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-success-700 dark:text-success-300" />
            </div>
          </div>
          <p className="text-3xl font-bold text-success-900 dark:text-success-100 mt-2">
            ${manualAmount.toLocaleString()}
          </p>
          <p className="text-sm text-success-600 dark:text-success-400 mt-1">
            {manualPercentage}% of completed • {manualPayments.length} transactions • $0 in fees
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Card Payments
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Credit/Debit Cards
              </p>
            </div>
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            ${cardAmount.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {cardPayments.length} transactions • Processing fees apply
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Payments
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
                Completed
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${completedAmount.toLocaleString()}
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
                Failed
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${failedAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Status:</span>
          {["all", "completed", "pending", "failed", "refunded"].map((status) => (
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

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Method:</span>
          {["all", "card", "bank", "cash", "check"].map((method) => (
            <button
              key={method}
              onClick={() => setFilterMethod(method)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterMethod === method
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {payment.transactionId}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.invoiceNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.clientName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.method)}`}>
                      {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                      Refund
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Dispute
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};