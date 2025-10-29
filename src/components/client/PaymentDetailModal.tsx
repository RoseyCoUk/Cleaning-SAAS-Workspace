"use client";
import { CloseIcon, CalenderIcon, DollarLineIcon, CreditCardIcon } from "@/icons";

export interface PaymentDetail {
  date: string;
  amount: number;
  method: string;
  status: "paid" | "pending" | "failed";
  serviceDate: string;
  serviceTime: string;
  serviceType: string;
  invoiceNumber?: string;
  receiptUrl?: string;
  transactionId?: string;
}

interface PaymentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: PaymentDetail;
}

export const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({
  isOpen,
  onClose,
  payment,
}) => {
  if (!isOpen) return null;

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt...");
    // In production, this would trigger receipt download
  };

  const handleViewInvoice = () => {
    console.log("Viewing invoice...");
    // In production, this would open invoice
  };

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/30 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Payment Details
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Payment Summary */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/10 dark:bg-brand-400/10">
                <DollarLineIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Total Amount
                </div>
                <div className="text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
                  ${payment.amount.toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                  payment.status === "paid"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : payment.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {payment.status === "paid" ? "Paid" : payment.status === "pending" ? "Pending" : "Failed"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-4">
          {/* Payment Information */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Payment Information
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Payment Date</span>
                <span className="font-medium text-gray-900 dark:text-white">{payment.date}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Payment Method</span>
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">{payment.method}</span>
                </div>
              </div>
              {payment.transactionId && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                  <span className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                    {payment.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Service Information */}
          <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
            <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Service Information
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Service Date</span>
                <div className="flex items-center gap-2">
                  <CalenderIcon className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {payment.serviceDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Service Time</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {payment.serviceTime}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Service Type</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {payment.serviceType}
                </span>
              </div>
              {payment.invoiceNumber && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Invoice Number</span>
                  <span className="font-mono text-xs font-medium text-gray-900 dark:text-white">
                    {payment.invoiceNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          {payment.invoiceNumber && (
            <button
              onClick={handleViewInvoice}
              className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              View Invoice
            </button>
          )}
          {payment.receiptUrl && payment.status === "paid" && (
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 rounded-lg bg-brand-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 active:scale-98 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              Download Receipt
            </button>
          )}
        </div>

        {payment.status === "pending" && (
          <div className="mt-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
            <p className="text-xs text-yellow-800 dark:text-yellow-400">
              This payment is pending confirmation. Please ensure payment is submitted by the due date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
