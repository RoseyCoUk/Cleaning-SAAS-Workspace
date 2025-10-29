"use client";
import React, { useState } from "react";
import { BankImportModal } from "./BankImportModal";
import { ReceiptScanner } from "./ReceiptScanner";
import { EditExpenseModal } from "./EditExpenseModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { exportToCSV } from "@/utils/exportUtils";
import {
  ArrowUpIcon,
  TimeIcon,
  DollarLineIcon,
  BoxIcon,
  BoltIcon,
  FolderIcon,
  TruckIcon,
  PaperPlaneIcon,
  CameraIcon
} from "@/icons";

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  vendor?: string;
  hasReceipt: boolean;
}

const categories = [
  { value: "supplies", label: "Cleaning Supplies", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" },
  { value: "equipment", label: "Equipment", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" },
  { value: "vehicle", label: "Vehicle", color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" },
  { value: "marketing", label: "Marketing", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" },
  { value: "insurance", label: "Insurance", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
];

export const ExpenseTracker = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [quickExpense, setQuickExpense] = useState({
    amount: "",
    category: "",
    description: "",
  });

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      description: "Cleaning supplies bulk order",
      category: "supplies",
      amount: 245.67,
      date: "Dec 20, 2024",
      vendor: "CleanPro Supplies",
      hasReceipt: true,
    },
    {
      id: "2",
      description: "Van maintenance",
      category: "vehicle",
      amount: 385.00,
      date: "Dec 18, 2024",
      vendor: "Auto Service Center",
      hasReceipt: true,
    },
    {
      id: "3",
      description: "Google Ads campaign",
      category: "marketing",
      amount: 150.00,
      date: "Dec 15, 2024",
      vendor: "Google",
      hasReceipt: false,
    },
    {
      id: "4",
      description: "New vacuum cleaner",
      category: "equipment",
      amount: 499.99,
      date: "Dec 12, 2024",
      vendor: "Equipment Depot",
      hasReceipt: true,
    },
  ]);

  const getCategoryDetails = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };

  const handleExportExpenses = () => {
    const exportData = expenses.map(expense => {
      const category = getCategoryDetails(expense.category);
      return {
        Date: expense.date,
        Description: expense.description,
        Category: category.label,
        Vendor: expense.vendor || "N/A",
        Amount: `$${expense.amount.toFixed(2)}`,
        "Has Receipt": expense.hasReceipt ? "Yes" : "No",
      };
    });

    const filename = `expenses_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(exportData, filename);
  };

  const handleEditClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedExpense: Expense) => {
    setExpenses(expenses.map(exp =>
      exp.id === updatedExpense.id ? updatedExpense : exp
    ));
    setShowEditModal(false);
    setSelectedExpense(null);
  };

  const handleDeleteClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      setExpenses(expenses.filter(exp => exp.id !== selectedExpense.id));
      setShowDeleteModal(false);
      setSelectedExpense(null);
    }
  };

  const handleAddExpense = () => {
    // Validate required fields
    if (!quickExpense.amount || !quickExpense.category || !quickExpense.description) {
      alert("Please fill in all required fields: Amount, Category, and Description");
      return;
    }

    const amount = parseFloat(quickExpense.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than $0");
      return;
    }

    // Create new expense
    const newExpense: Expense = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
      description: quickExpense.description,
      category: quickExpense.category,
      amount: amount,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      vendor: undefined,
      hasReceipt: false,
    };

    // Add to expenses
    setExpenses([newExpense, ...expenses]);

    // Clear form
    setQuickExpense({
      amount: "",
      category: "",
      description: "",
    });

    // Show success feedback
    alert(`SUCCESS: Expense Added!\n\nAmount: $${amount.toFixed(2)}\nCategory: ${getCategoryDetails(quickExpense.category).label}\nDescription: ${quickExpense.description}`);
  };

  const getCategoryIcon = (category: string) => {
    const iconClass = "w-5 h-5";
    switch (category) {
      case "supplies": return <BoltIcon className={iconClass} />;
      case "equipment": return <BoxIcon className={iconClass} />;
      case "vehicle": return <TruckIcon className={iconClass} />;
      case "marketing": return <PaperPlaneIcon className={iconClass} />;
      case "insurance": return <FolderIcon className={iconClass} />;
      default: return <FolderIcon className={iconClass} />;
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = categories.map(cat => ({
    ...cat,
    total: expenses
      .filter(exp => exp.category === cat.value)
      .reduce((sum, exp) => sum + exp.amount, 0),
  }));

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
            <ArrowUpIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalExpenses.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total Expenses</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <TimeIcon className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${expenses.filter(e => !e.hasReceipt).reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Missing Receipts</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
            <DollarLineIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            $3,500
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            ${(3500 - totalExpenses).toFixed(2)} remaining
          </p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Top Category</p>
            <BoxIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            Equipment
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">$499.99 spent</p>
        </div>
      </div>

      {/* Main Expense Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Entry & Import */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Add Expense
            </h3>

            {/* Quick Entry Form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Amount"
                value={quickExpense.amount}
                onChange={(e) => setQuickExpense({ ...quickExpense, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />

              <select
                value={quickExpense.category}
                onChange={(e) => setQuickExpense({ ...quickExpense, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Description"
                value={quickExpense.description}
                onChange={(e) => setQuickExpense({ ...quickExpense, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500"
              />

              <button
                onClick={handleAddExpense}
                className="w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Add Expense
              </button>
            </div>

            {/* Import Options */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Import Options</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full py-2 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 flex items-center justify-center gap-2"
                >
                  <ArrowUpIcon className="w-4 h-4" />
                  Import Bank Statement
                </button>
                <button
                  onClick={() => setShowReceiptScanner(true)}
                  className="w-full py-2 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 flex items-center justify-center gap-2"
                >
                  <CameraIcon className="w-4 h-4" />
                  Scan Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="mt-6 bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              By Category
            </h3>
            <div className="space-y-3">
              {expensesByCategory.map((cat) => (
                <div key={cat.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(cat.value)}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{cat.label}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${cat.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense List */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Expenses</h3>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    Filter
                  </button>
                  <button
                    onClick={handleExportExpenses}
                    className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const category = getCategoryDetails(expense.category);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{expense.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {expense.date} • {expense.vendor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ${expense.amount.toFixed(2)}
                          </p>
                          {expense.hasReceipt ? (
                            <span className="text-xs text-green-600 dark:text-green-400">Receipt attached</span>
                          ) : (
                            <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                              Add receipt
                            </button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(expense)}
                            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(expense)}
                            className="px-3 py-1.5 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                Load More Expenses
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BankImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
      <ReceiptScanner
        isOpen={showReceiptScanner}
        onClose={() => setShowReceiptScanner(false)}
        onCapture={(data) => {
          console.log('Receipt captured:', data);
          // Handle the captured receipt data here
        }}
      />
      {selectedExpense && showEditModal && (
        <EditExpenseModal
          expense={selectedExpense}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}
      {showDeleteModal && selectedExpense && (
        <DeleteConfirmationModal
          title="Delete Expense"
          message="Are you sure you want to delete this expense? This action cannot be undone."
          itemName={selectedExpense.description}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedExpense(null);
          }}
        />
      )}
    </div>
  );
};