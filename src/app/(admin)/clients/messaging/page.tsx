import type { Metadata } from "next";
import { AutomatedMessaging } from "@/components/cleaning/AutomatedMessaging";
import React from "react";

export const metadata: Metadata = {
  title: "Automated Messaging | Client Communication",
  description: "Manage automated client communications and reminders",
};

export default function MessagingPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Automated Messaging Center
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure automated reminders and client communications
        </p>
      </div>

      {/* Messaging Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Messages Sent Today</h3>
          <p className="text-2xl font-bold text-blue-800 dark:text-blue-400">47</p>
          <p className="text-sm text-blue-600 dark:text-blue-500 mt-1">↑ 15% from yesterday</p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">Delivery Rate</h3>
          <p className="text-2xl font-bold text-green-800 dark:text-green-400">98.5%</p>
          <p className="text-sm text-green-600 dark:text-green-500 mt-1">Excellent</p>
        </div>

        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
          <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Open Rate</h3>
          <p className="text-2xl font-bold text-purple-800 dark:text-purple-400">84%</p>
          <p className="text-sm text-purple-600 dark:text-purple-500 mt-1">Above average</p>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-200 dark:border-amber-800">
          <h3 className="font-medium text-amber-900 dark:text-amber-300 mb-2">Active Templates</h3>
          <p className="text-2xl font-bold text-amber-800 dark:text-amber-400">8</p>
          <p className="text-sm text-amber-600 dark:text-amber-500 mt-1">3 SMS, 5 Email</p>
        </div>
      </div>

      <AutomatedMessaging />
    </div>
  );
}