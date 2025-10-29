"use client";
import { useState } from "react";
import { PaymentDetailModal, PaymentDetail } from "@/components/client/PaymentDetailModal";

const paymentHistory: PaymentDetail[] = [
  {
    date: "Oct 15, 2025",
    amount: 240,
    method: "Cash",
    status: "paid",
    serviceDate: "Oct 15, 2025",
    serviceTime: "9:00 AM - 12:00 PM",
    serviceType: "Regular Clean",
    invoiceNumber: "INV-2025-1015",
    receiptUrl: "/receipts/2025-1015.pdf",
    transactionId: "TXN-1015-001",
  },
  {
    date: "Oct 1, 2025",
    amount: 240,
    method: "Check #1234",
    status: "paid",
    serviceDate: "Oct 1, 2025",
    serviceTime: "9:00 AM - 12:00 PM",
    serviceType: "Regular Clean",
    invoiceNumber: "INV-2025-1001",
    receiptUrl: "/receipts/2025-1001.pdf",
    transactionId: "TXN-1001-001",
  },
  {
    date: "Sep 15, 2025",
    amount: 240,
    method: "Cash",
    status: "paid",
    serviceDate: "Sep 15, 2025",
    serviceTime: "9:00 AM - 12:00 PM",
    serviceType: "Regular Clean",
    invoiceNumber: "INV-2025-0915",
    receiptUrl: "/receipts/2025-0915.pdf",
    transactionId: "TXN-0915-001",
  },
  {
    date: "Sep 1, 2025",
    amount: 350,
    method: "Check #1233",
    status: "paid",
    serviceDate: "Sep 1, 2025",
    serviceTime: "8:00 AM - 2:00 PM",
    serviceType: "Deep Clean",
    invoiceNumber: "INV-2025-0901",
    receiptUrl: "/receipts/2025-0901.pdf",
    transactionId: "TXN-0901-001",
  },
];

export default function ClientPaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePaymentClick = (payment: PaymentDetail) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Current Balance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
          <div className="text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Current Balance
          </div>
          <div className="mt-2 text-3xl font-bold text-success-600 tabular-nums dark:text-success-400 sm:text-4xl">
            $240.00
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Due Nov 1, 2025
          </div>

          <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Payment will be collected at next service
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white sm:mb-4 sm:text-lg">
            Payment History
          </h2>
          <div className="space-y-2">
            {paymentHistory.map((payment, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePaymentClick(payment)}
                className="flex w-full items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2.5 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 sm:px-4 sm:py-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                    {payment.date}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {payment.method} • {payment.serviceType}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-sm font-semibold text-gray-900 tabular-nums dark:text-white sm:text-base">
                    ${payment.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-success-600 dark:text-success-400">
                    {payment.status === "paid" ? "Paid" : payment.status === "pending" ? "Pending" : "Failed"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <PaymentDetailModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
        />
      )}
    </>
  );
}
