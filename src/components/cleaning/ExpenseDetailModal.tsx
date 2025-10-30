"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import {
  BoxIcon,
  BoltIcon,
  FolderIcon,
  TruckIcon,
  PaperPlaneIcon,
  TimeIcon,
  DollarLineIcon,
  CheckCircleIcon,
  CameraIcon,
  PencilIcon,
  TrashBinIcon,
} from "@/icons";

interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  vendor?: string;
  hasReceipt: boolean;
  receiptUrl?: string;
  notes?: string;
}

interface ExpenseDetailModalProps {
  expense: Expense;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddReceipt?: () => void;
}

const categories = [
  { value: "supplies", label: "Cleaning Supplies", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", icon: BoxIcon },
  { value: "equipment", label: "Equipment", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400", icon: BoltIcon },
  { value: "vehicle", label: "Vehicle", color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400", icon: TruckIcon },
  { value: "marketing", label: "Marketing", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400", icon: PaperPlaneIcon },
  { value: "insurance", label: "Insurance", color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400", icon: FolderIcon },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: FolderIcon },
];

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({
  expense,
  onClose,
  onEdit,
  onDelete,
  onAddReceipt,
}) => {
  const getCategoryDetails = (categoryValue: string) => {
    return categories.find(cat => cat.value === categoryValue) || categories[categories.length - 1];
  };

  const category = getCategoryDetails(expense.category);
  const CategoryIcon = category.icon;

  return (
    <Modal isOpen={true} onClose={onClose} title="Expense Details">
      <div className="space-y-6">
        {/* Expense Header */}
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${category.color}`}>
            <CategoryIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {expense.description}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${category.color}`}>
                {category.label}
              </span>
              {expense.hasReceipt && (
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <CheckCircleIcon className="w-3 h-3 inline mr-1" />
                  Receipt attached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expense Information */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarLineIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</label>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${expense.amount.toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TimeIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</label>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {expense.date}
            </p>
          </div>
        </div>

        {/* Vendor */}
        {expense.vendor && (
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase block mb-2">
              Vendor
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {expense.vendor}
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        {expense.notes && (
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase block mb-2">
              Notes
            </label>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {expense.notes}
              </p>
            </div>
          </div>
        )}

        {/* Receipt Section */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase block mb-2">
            Receipt
          </label>
          {expense.hasReceipt && expense.receiptUrl ? (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <img
                src={expense.receiptUrl}
                alt="Receipt"
                className="w-full h-auto object-contain bg-gray-50 dark:bg-gray-900"
              />
            </div>
          ) : expense.hasReceipt ? (
            <div className="p-8 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
              <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500 dark:text-green-400 mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Receipt on file
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receipt image not available for preview
              </p>
            </div>
          ) : (
            <button
              onClick={onAddReceipt}
              className="w-full p-8 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-brand-500 dark:hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-colors text-center"
            >
              <CameraIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                No receipt attached
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click to scan or upload receipt
              </p>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              <PencilIcon className="w-4 h-4" />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
            >
              <TrashBinIcon className="w-4 h-4" />
              Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
