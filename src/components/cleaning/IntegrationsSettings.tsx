"use client";
import React, { useState } from "react";
import { CheckCircleIcon, MailIcon, CalenderIcon } from "@/icons";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "payment" | "communication" | "accounting" | "calendar" | "marketing";
  isConnected: boolean;
  logoUrl: string;
  features: string[];
  status: "active" | "inactive" | "error" | "pending";
  lastSync?: string;
  settings?: any;
}

export const IntegrationsSettings = () => {
  // GAP-028: Removed unnecessary integrations per client request
  // Removed: Stripe, PayPal, SendGrid, MailChimp, Zapier, QuickBooks
  // Kept: Twilio, Google Calendar, Resend, Google Drive
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "1",
      name: "Twilio",
      description: "Send SMS notifications and reminders to customers",
      category: "communication",
      isConnected: true,
      logoUrl: "/logos/twilio.png",
      features: ["SMS Messaging", "Voice Calls", "WhatsApp Integration"],
      status: "active",
      lastSync: "5 minutes ago",
      settings: {
        accountSid: "AC...",
        phoneNumber: "+1555123456"
      }
    },
    {
      id: "2",
      name: "Google Calendar",
      description: "Sync appointments with Google Calendar",
      category: "calendar",
      isConnected: true,
      logoUrl: "/logos/google-calendar.png",
      features: ["Calendar Sync", "Event Management", "Reminders"],
      status: "active",
      lastSync: "Just now"
    },
    {
      id: "3",
      name: "Resend",
      description: "Modern email delivery service for transactional emails",
      category: "communication",
      isConnected: true,
      logoUrl: "/logos/resend.png",
      features: ["Email Delivery", "Templates", "Real-time Analytics"],
      status: "active",
      lastSync: "1 minute ago",
      settings: {
        apiKey: "re_...",
        fromEmail: "notifications@cleanpro.com"
      }
    },
    {
      id: "4",
      name: "Google Drive",
      description: "Store and manage documents in the cloud",
      category: "calendar",
      isConnected: false,
      logoUrl: "/logos/google-drive.png",
      features: ["File Storage", "Document Sharing", "Backup"],
      status: "inactive"
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showConnectionModal, setShowConnectionModal] = useState<Integration | null>(null);

  // Simplified categories (removed payment, accounting, marketing per GAP-028)
  const categories = [
    { id: "communication", label: "Communication", icon: "mail", color: "green" },
    { id: "calendar", label: "Calendar & Storage", icon: "calendar", color: "red" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "inactive":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      case "error":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    switch (cat?.color) {
      case "blue":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "green":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "purple":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      case "red":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "yellow":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const filteredIntegrations = activeCategory === "all"
    ? integrations
    : integrations.filter(integration => integration.category === activeCategory);

  const connectedCount = integrations.filter(i => i.isConnected).length;
  const activeCount = integrations.filter(i => i.status === "active").length;
  const errorCount = integrations.filter(i => i.status === "error").length;

  const toggleConnection = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      if (integration.isConnected) {
        // Disconnect
        setIntegrations(integrations.map(i =>
          i.id === integrationId
            ? { ...i, isConnected: false, status: "inactive" as const }
            : i
        ));
      } else {
        // Show connection modal
        setShowConnectionModal(integration);
      }
    }
  };

  const handleConnect = (integrationId: string) => {
    setIntegrations(integrations.map(i =>
      i.id === integrationId
        ? { ...i, isConnected: true, status: "active" as const, lastSync: "Just now" }
        : i
    ));
    setShowConnectionModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Third-Party Integrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Connect your favorite tools and automate your workflow
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <span>Browse Marketplace</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Integrations
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {integrations.length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Connected
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {connectedCount}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {activeCount}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Issues
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {errorCount}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
              activeCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {category.icon === "mail" && <MailIcon className="w-4 h-4" />}
            {category.icon === "calendar" && <CalenderIcon className="w-4 h-4" />}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <div key={integration.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                    {integration.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {integration.name}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(integration.category)}`}>
                    {categories.find(c => c.id === integration.category)?.label || integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                  </span>
                </div>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {integration.description}
            </p>

            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
              <div className="flex flex-wrap gap-1">
                {integration.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            {integration.isConnected && integration.lastSync && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Last sync: {integration.lastSync}
              </p>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => toggleConnection(integration.id)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  integration.isConnected
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {integration.isConnected ? "Disconnect" : "Connect"}
              </button>
              {integration.isConnected && (
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                  Settings
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[1001]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Connect {showConnectionModal.name}
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {showConnectionModal.description}
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  API Key / Access Token
                </label>
                <input
                  type="password"
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {showConnectionModal.category === "communication" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From Email/Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Enter sender information"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleConnect(showConnectionModal.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Connect Integration
              </button>
              <button
                onClick={() => setShowConnectionModal(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};