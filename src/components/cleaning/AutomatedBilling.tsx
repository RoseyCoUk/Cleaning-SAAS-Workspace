"use client";
import React, { useState } from "react";
import { CheckCircleIcon, CreditCardIcon, BankIcon } from "@/icons";

type BillingTrigger = "completion" | "monthly" | "weekly" | "custom";

export const AutomatedBilling = () => {
  const [billingTrigger, setBillingTrigger] = useState<BillingTrigger>("completion");
  const [autoCharge, setAutoCharge] = useState(true);
  const [sendReceipts, setSendReceipts] = useState({
    email: true,
    sms: false,
  });
  const [monthlyBillingDay, setMonthlyBillingDay] = useState("1");
  const [customMessage, setCustomMessage] = useState("");

  const paymentMethods = [
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      isDefault: true,
    },
    {
      id: "2",
      type: "bank",
      last4: "6789",
      bank: "Chase",
      isDefault: false,
    },
  ];

  const billingHistory = [
    {
      id: "1",
      date: "Dec 15, 2024",
      amount: 285,
      status: "paid",
      method: "Auto-charge",
    },
    {
      id: "2",
      date: "Dec 1, 2024",
      amount: 570,
      status: "paid",
      method: "Auto-charge",
    },
    {
      id: "3",
      date: "Nov 15, 2024",
      amount: 285,
      status: "paid",
      method: "Manual",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Billing Configuration */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-6 border border-green-200 dark:border-green-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Billing Configuration
        </h3>

        {/* Billing Trigger Selector */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            When to Generate Invoices
          </label>

          <div className="space-y-3">
            <label className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="billing-trigger"
                value="completion"
                checked={billingTrigger === "completion"}
                onChange={(e) => setBillingTrigger(e.target.value as BillingTrigger)}
                className="mt-1 w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  On Service Completion
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Generate invoice immediately after each service
                </p>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="billing-trigger"
                value="monthly"
                checked={billingTrigger === "monthly"}
                onChange={(e) => setBillingTrigger(e.target.value as BillingTrigger)}
                className="mt-1 w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Monthly Billing
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Consolidate all services into monthly invoice
                </p>
              </div>
            </label>

            <label className="flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors">
              <input
                type="radio"
                name="billing-trigger"
                value="weekly"
                checked={billingTrigger === "weekly"}
                onChange={(e) => setBillingTrigger(e.target.value as BillingTrigger)}
                className="mt-1 w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500"
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  Weekly Billing
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Bill every week for services provided
                </p>
              </div>
            </label>
          </div>

          {/* Monthly Billing Day Selector */}
          {billingTrigger === "monthly" && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Billing Day of Month
              </label>
              <select
                value={monthlyBillingDay}
                onChange={(e) => setMonthlyBillingDay(e.target.value)}
                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="1">1st of each month</option>
                <option value="15">15th of each month</option>
                <option value="last">Last day of month</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Methods
        </h3>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/20 rounded-lg flex items-center justify-center">
                  {method.type === "card" ? (
                    <CreditCardIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  ) : (
                    <BankIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {method.type === "card" ? method.brand : method.bank} ending in {method.last4}
                  </p>
                  {method.isDefault && (
                    <p className="text-xs text-green-600 dark:text-green-400">Default payment method</p>
                  )}
                </div>
              </div>
              <button className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
                {method.isDefault ? "Default" : "Set as default"}
              </button>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          + Add Payment Method
        </button>

        {/* Auto-charge Toggle */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Auto-charge Enabled</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Automatically charge the default payment method when invoices are due
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={autoCharge}
                onChange={(e) => setAutoCharge(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Receipt Settings */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Receipt Settings
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={sendReceipts.email}
              onChange={(e) => setSendReceipts({ ...sendReceipts, email: e.target.checked })}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Email receipts
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Send detailed receipts via email after payment
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={sendReceipts.sms}
              onChange={(e) => setSendReceipts({ ...sendReceipts, sms: e.target.checked })}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                SMS receipts
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Send payment confirmation via text message
              </p>
            </div>
          </label>

          {/* Custom Message */}
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Custom Receipt Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Thank you for your business! Your next service is scheduled for..."
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Recent Billing Activity */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Billing Activity
        </h3>

        <div className="space-y-3">
          {billingHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    ${item.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.date} • {item.method}
                  </p>
                </div>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-xs rounded-full">
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
          View Full Billing History →
        </button>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          Save Billing Settings
        </button>
      </div>
    </div>
  );
};