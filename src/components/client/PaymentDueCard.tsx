"use client";
import { useState, useMemo } from "react";
import { DollarLineIcon, CopyIcon } from "@/icons";

const payment = {
  amount: 240.0,
  dueDate: "Nov 1, 2025",
  lastPayment: "Oct 15, 2025",
  method: "Bank Transfer",
};

const bankDetails = {
  bankName: "Chase Bank",
  accountNumber: "1234567890",
  routingNumber: "021000021",
  accountName: "CleaningPro Services LLC",
  swiftCode: "CHASUS33",
};

export const PaymentDueCard = () => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Generate payment reference once and persist it
  const paymentReference = useMemo(() => {
    return `PAY-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }, []);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Amount Due
          </div>
          <div className="mt-1 text-2xl font-bold text-success-600 tabular-nums dark:text-success-400 sm:text-3xl">
            ${payment.amount.toFixed(2)}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Due by {payment.dueDate}
          </div>
        </div>

        <DollarLineIcon className="h-8 w-8 flex-shrink-0 text-success-600 opacity-50 dark:text-success-400 sm:h-10 sm:w-10" />
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={() => setShowBankDetails(!showBankDetails)}
          className="w-full rounded-lg bg-success-600 py-2 text-sm text-white hover:bg-success-700 active:scale-98 dark:bg-success-500 dark:hover:bg-success-600 sm:text-base"
        >
          {showBankDetails ? "Hide" : "Show"} Bank Transfer Details
        </button>

        {showBankDetails && (
          <div className="mt-3 space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <div className="mb-2 text-xs font-semibold text-gray-900 dark:text-white sm:text-sm">
              Bank Transfer Information
            </div>

            {/* Bank Name */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Bank Name</div>
                <div className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                  {bankDetails.bankName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.bankName, "bankName")}
                className="flex-shrink-0 flex items-center justify-center rounded h-11 w-11 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Account Number</div>
                <div className="mt-0.5 truncate font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {bankDetails.accountNumber}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.accountNumber, "accountNumber")}
                className="flex-shrink-0 flex items-center justify-center rounded h-11 w-11 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Routing Number */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Routing Number</div>
                <div className="mt-0.5 truncate font-mono text-sm font-medium text-gray-900 dark:text-white">
                  {bankDetails.routingNumber}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.routingNumber, "routingNumber")}
                className="flex-shrink-0 flex items-center justify-center rounded h-11 w-11 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Account Name */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 dark:text-gray-400">Account Name</div>
                <div className="mt-0.5 truncate text-sm font-medium text-gray-900 dark:text-white">
                  {bankDetails.accountName}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(bankDetails.accountName, "accountName")}
                className="flex-shrink-0 flex items-center justify-center rounded h-11 w-11 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Payment Reference */}
            <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Payment Reference (Include in transfer)
                  </div>
                  <div className="mt-0.5 truncate font-mono text-sm font-medium text-brand-600 dark:text-brand-400">
                    {paymentReference}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(paymentReference, "reference")}
                  className="flex-shrink-0 flex items-center justify-center rounded h-11 w-11 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                >
                  <CopyIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {copiedField && (
              <div className="rounded-lg bg-success-50 px-3 py-2 text-center text-xs text-success-700 dark:bg-success-900/30 dark:text-success-400">
                Copied to clipboard!
              </div>
            )}
          </div>
        )}

        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          Last payment: {payment.lastPayment}
        </div>
      </div>
    </div>
  );
};
