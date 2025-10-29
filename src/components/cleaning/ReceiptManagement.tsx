"use client";
import React, { useState } from "react";
import { CheckCircleIcon } from "@/icons";

interface Receipt {
  id: string;
  receiptNumber: string;
  vendor: string;
  amount: number;
  category: "supplies" | "equipment" | "transportation" | "utilities" | "other";
  status: "approved" | "pending" | "rejected" | "missing";
  date: string;
  description: string;
  imageUrl?: string;
  notes?: string;
}

export const ReceiptManagement = () => {
  const [receipts] = useState<Receipt[]>([
    {
      id: "1",
      receiptNumber: "RCP-2024-001",
      vendor: "Office Depot",
      amount: 89.99,
      category: "supplies",
      status: "approved",
      date: "Dec 15, 2024",
      description: "Cleaning supplies and paper towels",
      imageUrl: "/receipts/001.jpg"
    },
    {
      id: "2",
      receiptNumber: "RCP-2024-002",
      vendor: "Home Depot",
      amount: 245.50,
      category: "equipment",
      status: "pending",
      date: "Dec 18, 2024",
      description: "Industrial vacuum cleaner",
      imageUrl: "/receipts/002.jpg"
    },
    {
      id: "3",
      receiptNumber: "RCP-2024-003",
      vendor: "Shell Gas Station",
      amount: 65.00,
      category: "transportation",
      status: "approved",
      date: "Dec 20, 2024",
      description: "Vehicle fuel for service calls"
    },
    {
      id: "4",
      receiptNumber: "RCP-2024-004",
      vendor: "Amazon Business",
      amount: 127.83,
      category: "supplies",
      status: "rejected",
      date: "Dec 12, 2024",
      description: "Microfiber cloths and spray bottles",
      notes: "Personal items mixed with business expenses"
    },
    {
      id: "5",
      receiptNumber: "RCP-2024-005",
      vendor: "Electric Company",
      amount: 234.67,
      category: "utilities",
      status: "missing",
      date: "Dec 1, 2024",
      description: "Monthly utility bill",
      notes: "Receipt image required for approval"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "rejected":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "missing":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "supplies":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "equipment":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      case "transportation":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "utilities":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20";
      case "other":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    const statusMatch = filterStatus === "all" || receipt.status === filterStatus;
    const categoryMatch = filterCategory === "all" || receipt.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const approvedAmount = receipts.filter(r => r.status === "approved").reduce((sum, receipt) => sum + receipt.amount, 0);
  const pendingAmount = receipts.filter(r => r.status === "pending").reduce((sum, receipt) => sum + receipt.amount, 0);
  const rejectedAmount = receipts.filter(r => r.status === "rejected").reduce((sum, receipt) => sum + receipt.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Receipt Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload, track, and manage expense receipts
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <span>Upload Receipt</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <span>Bulk Import</span>
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
                Approved
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${approvedAmount.toLocaleString()}
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
                Rejected
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${rejectedAmount.toLocaleString()}
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
          {["all", "approved", "pending", "rejected", "missing"].map((status) => (
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
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Category:</span>
          {["all", "supplies", "equipment", "transportation", "utilities", "other"].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
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
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {receipt.receiptNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {receipt.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {receipt.vendor}
                    </div>
                    {receipt.imageUrl && (
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Image attached
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${receipt.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(receipt.category)}`}>
                      {receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receipt.status)}`}>
                      {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {receipt.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                      Approve
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
            <CheckCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Drop receipt images here
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Or click to browse and upload receipt images (JPG, PNG, PDF)
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            Choose Files
          </button>
        </div>
      </div>
    </div>
  );
};