"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { DollarLineIcon, CheckCircleIcon } from "@/icons";
import type { Invoice } from "@/utils/invoiceUtils";

interface PaymentRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onSave: (payment: PaymentRecord) => void;
}

export interface PaymentRecord {
  invoiceId: string;
  amount: number;
  method: "cash" | "check" | "bank-transfer";
  referenceNumber?: string;
  notes?: string;
  receivedBy: string;
  receivedAt: string;
}

export const PaymentRecordModal: React.FC<PaymentRecordModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onSave,
}) => {
  const [payment, setPayment] = useState<Partial<PaymentRecord>>({
    method: "cash",
    amount: 0,
  });

  // Update amount when invoice changes
  useEffect(() => {
    if (invoice) {
      setPayment(prev => ({ ...prev, amount: invoice.amount }));
    }
  }, [invoice]);

  const handleSave = () => {
    if (!invoice) return;

    const record: PaymentRecord = {
      invoiceId: invoice.id,
      amount: payment.amount || 0,
      method: payment.method || "cash",
      referenceNumber: payment.referenceNumber,
      notes: payment.notes,
      receivedBy: "Manager", // In production, get from auth context
      receivedAt: new Date().toISOString(),
    };

    onSave(record);
    onClose();

    // Reset form
    setPayment({
      method: "cash",
      amount: 0,
    });
  };

  const handleClose = () => {
    // Reset form on close
    setPayment({
      method: "cash",
      amount: 0,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Record Payment">
      <div className="space-y-4">
        {/* Invoice Info */}
        {invoice && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarLineIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {invoice.clientName}
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Invoice: <span className="font-medium">{invoice.invoiceNumber}</span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Amount Due: <span className="font-bold">${invoice.amount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Payment Method - EMPHASIZED */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Method *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {/* Cash - Primary */}
            <button
              onClick={() => setPayment({ ...payment, method: "cash" })}
              className={`p-4 rounded-lg border-2 transition-all ${
                payment.method === "cash"
                  ? "border-success-500 bg-success-50 dark:bg-success-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-center">
                <DollarLineIcon className={`h-6 w-6 mx-auto mb-2 ${
                  payment.method === "cash"
                    ? "text-success-600 dark:text-success-400"
                    : "text-gray-400"
                }`} />
                <div className={`text-sm font-semibold ${
                  payment.method === "cash"
                    ? "text-success-700 dark:text-success-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  Cash
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  No fees
                </div>
              </div>
            </button>

            {/* Check - Primary */}
            <button
              onClick={() => setPayment({ ...payment, method: "check" })}
              className={`p-4 rounded-lg border-2 transition-all ${
                payment.method === "check"
                  ? "border-success-500 bg-success-50 dark:bg-success-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-center">
                <CheckCircleIcon className={`h-6 w-6 mx-auto mb-2 ${
                  payment.method === "check"
                    ? "text-success-600 dark:text-success-400"
                    : "text-gray-400"
                }`} />
                <div className={`text-sm font-semibold ${
                  payment.method === "check"
                    ? "text-success-700 dark:text-success-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  Check
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  No fees
                </div>
              </div>
            </button>

            {/* Bank Transfer - Primary */}
            <button
              onClick={() => setPayment({ ...payment, method: "bank-transfer" })}
              className={`p-4 rounded-lg border-2 transition-all ${
                payment.method === "bank-transfer"
                  ? "border-success-500 bg-success-50 dark:bg-success-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-center">
                <DollarLineIcon className={`h-6 w-6 mx-auto mb-2 ${
                  payment.method === "bank-transfer"
                    ? "text-success-600 dark:text-success-400"
                    : "text-gray-400"
                }`} />
                <div className={`text-sm font-semibold ${
                  payment.method === "bank-transfer"
                    ? "text-success-700 dark:text-success-300"
                    : "text-gray-700 dark:text-gray-300"
                }`}>
                  Bank Transfer
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  No fees
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount Received *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              value={payment.amount || ""}
              onChange={(e) => setPayment({ ...payment, amount: parseFloat(e.target.value) || 0 })}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enter partial amount for partial payment
          </p>
        </div>

        {/* Reference Number (conditional) */}
        {(payment.method === "check" || payment.method === "bank-transfer") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {payment.method === "check" ? "Check Number" : "Transfer Reference"}
            </label>
            <input
              type="text"
              value={payment.referenceNumber || ""}
              onChange={(e) => setPayment({ ...payment, referenceNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              placeholder={payment.method === "check" ? "e.g., 1234" : "e.g., TXN-20250127-001"}
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            value={payment.notes || ""}
            onChange={(e) => setPayment({ ...payment, notes: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
            placeholder="Add any additional notes about this payment..."
          />
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300">
            <span className="font-semibold">Preferred Payment Methods:</span> Cash, Check, and Bank Transfer have no processing fees and are recommended.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!payment.amount || payment.amount <= 0}
            className="flex-1 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Record Payment
          </button>
        </div>
      </div>
    </Modal>
  );
};
