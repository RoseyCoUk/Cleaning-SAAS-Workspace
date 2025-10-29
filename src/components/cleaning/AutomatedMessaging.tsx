"use client";
import React, { useState } from "react";
import { EnvelopeIcon, CheckCircleIcon, EyeIcon, PencilIcon, MoreDotIcon, ChatIcon } from "@/icons";
import { PendingMessagesQueue } from "@/components/cleaning/PendingMessagesQueue";

interface MessageTemplate {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  channel: "sms" | "email";
  enabled: boolean;
  deliveryRate: number;
  openRate: number;
  preview: string;
  requiresApproval?: boolean; // ← Requires manager approval before sending
  template?: string; // ← Full message text with placeholders
}

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  clientCount: number;
}

export const AutomatedMessaging = () => {
  const [activeTab, setActiveTab] = useState<"templates" | "rules" | "log" | "pending">("pending"); // Default to pending for visibility

  const messageTemplates: MessageTemplate[] = [
    {
      id: "1",
      name: "Weekend Reminder",
      trigger: "Before Service",
      timing: "2 days before",
      channel: "sms",
      enabled: true,
      deliveryRate: 98,
      openRate: 85,
      preview: "Hi {firstName}, this is a reminder that your home cleaning is scheduled for {serviceDate} at {serviceTime}.",
    },
    {
      id: "2",
      name: "Morning Arrival Notice",
      trigger: "Day of Service",
      timing: "8:00 AM",
      channel: "sms",
      enabled: true,
      deliveryRate: 99,
      openRate: 92,
      preview: "Good morning! Your cleaning team will arrive between {estimatedStart} - {estimatedEnd} today.",
      requiresApproval: true, // ← Requires ETA confirmation
      template: "Good morning {clientName}! Your cleaning team will arrive between {arrivalStart} and {arrivalEnd} today. {crewCount} team members will be servicing your home. Thank you!",
    },
    {
      id: "3",
      name: "Service Complete",
      trigger: "After Service",
      timing: "Immediately",
      channel: "email",
      enabled: true,
      deliveryRate: 97,
      openRate: 72,
      preview: "Your home has been cleaned! Please let us know if you have any feedback.",
    },
    {
      id: "4",
      name: "Monthly Invoice",
      trigger: "Billing",
      timing: "1st of month",
      channel: "email",
      enabled: false,
      deliveryRate: 100,
      openRate: 68,
      preview: "Your invoice for {month} is ready. Total amount due: {amount}.",
    },
    {
      id: "5",
      name: "Arrival Confirmation",
      trigger: "Day Before Service",
      timing: "7:00 AM day before",
      channel: "sms",
      enabled: true,
      deliveryRate: 99,
      openRate: 88,
      preview: "Hi {clientName}, your cleaning is scheduled for tomorrow between {arrivalStart} and {arrivalEnd}...",
      requiresApproval: true, // ← Requires ETA confirmation
      template: "Hi {clientName}, your cleaning is scheduled for tomorrow between {arrivalStart} and {arrivalEnd}. A team of {crewCount} will be arriving. Reply CONFIRM to verify. Thank you!",
    },
    {
      id: "6",
      name: "Lunch Delay Notice",
      trigger: "Break Start",
      timing: "When manager logs lunch break",
      channel: "sms",
      enabled: true,
      deliveryRate: 100,
      openRate: 95,
      preview: "Hi {clientName}, our team is taking a lunch break. We'll be arriving in approximately {minutesUntilArrival} minutes...",
      requiresApproval: false, // ← Auto-sent, no approval needed
      template: "Hi {clientName}, our team is taking a lunch break. We'll be arriving at your location in approximately {minutesUntilArrival} minutes. Thank you for your patience!",
    },
  ];

  const automationRules: AutomationRule[] = [
    {
      id: "1",
      name: "4-Week Schedule Clients",
      description: "Send reminder 48 hours before service",
      status: "active",
      clientCount: 32,
    },
    {
      id: "2",
      name: "New Client Welcome",
      description: "Send welcome package after first service",
      status: "active",
      clientCount: 12,
    },
    {
      id: "3",
      name: "Inactive Client Win-back",
      description: "Send re-engagement offer after 60 days",
      status: "paused",
      clientCount: 8,
    },
  ];

  const recentMessages = [
    {
      id: "1",
      recipient: "Sarah Johnson",
      type: "sms",
      preview: "Hi Sarah, this is a reminder that your home...",
      time: "2 hours ago",
      status: "delivered",
      opened: true,
    },
    {
      id: "2",
      recipient: "Michael Chen",
      type: "email",
      preview: "Your cleaning service is complete...",
      time: "4 hours ago",
      status: "delivered",
      opened: false,
    },
    {
      id: "3",
      recipient: "Emily Davis",
      type: "sms",
      preview: "Good morning! Your cleaning team...",
      time: "Yesterday",
      status: "delivered",
      opened: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "pending"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Pending Approvals
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "templates"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Message Templates
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "rules"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Automation Rules
            </button>
            <button
              onClick={() => setActiveTab("log")}
              className={`py-4 px-1 border-b-2 transition-colors ${
                activeTab === "log"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Communication Log
            </button>
          </div>
        </div>

        {/* Pending Approvals Tab */}
        {activeTab === "pending" && (
          <div className="p-6">
            <PendingMessagesQueue />
          </div>
        )}

        {/* Message Templates Tab */}
        {activeTab === "templates" && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messageTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        template.channel === "sms" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-green-100 dark:bg-green-900/20"
                      }`}>
                        {template.channel === "sms" ? (
                          <ChatIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <EnvelopeIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {template.trigger} • {template.timing}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={template.enabled}
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm mb-3">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{template.preview}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3 text-green-500" />
                      {template.deliveryRate}% delivered
                    </span>
                    <span className="flex items-center gap-1">
                      <EyeIcon className="w-3 h-3 text-blue-500" />
                      {template.openRate}% opened
                    </span>
                    <button className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <PencilIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              + Create New Template
            </button>
          </div>
        )}

        {/* Automation Rules Tab */}
        {activeTab === "rules" && (
          <div className="p-6">
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{rule.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{rule.description}</p>
                      <p className="text-xs text-gray-400 mt-1">Applied to {rule.clientCount} clients</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      rule.status === "active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      {rule.status}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreDotIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              + Add Automation Rule
            </button>
          </div>
        )}

        {/* Communication Log Tab */}
        {activeTab === "log" && (
          <div className="p-6">
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.type === "sms" ? "bg-blue-100 dark:bg-blue-900/20" : "bg-green-100 dark:bg-green-900/20"
                  }`}>
                    {msg.type === "sms" ? (
                      <ChatIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <EnvelopeIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{msg.recipient}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{msg.preview}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className={`text-xs ${
                        msg.status === "delivered" ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                      }`}>
                        {msg.status}
                      </span>
                      {msg.opened && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">Opened</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300">
              View All Messages →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};