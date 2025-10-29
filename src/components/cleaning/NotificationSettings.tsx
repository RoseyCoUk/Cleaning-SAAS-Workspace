"use client";
import React, { useState } from "react";
import { CheckCircleIcon, MailIcon, ChatIcon, BellIcon, PlugInIcon, CalenderIcon, DollarLineIcon } from "@/icons";

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  category: "appointments" | "billing" | "system" | "marketing";
}

export const NotificationSettings = () => {
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "1",
      name: "Appointment Reminders",
      description: "Notify when an appointment is coming up",
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      category: "appointments"
    },
    {
      id: "2",
      name: "Appointment Confirmations",
      description: "Confirm when appointments are booked or modified",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      category: "appointments"
    },
    {
      id: "3",
      name: "Schedule Changes",
      description: "Alert when schedules are updated or cancelled",
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      category: "appointments"
    },
    {
      id: "4",
      name: "Payment Confirmations",
      description: "Confirm successful payments and transactions",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: false,
      category: "billing"
    },
    {
      id: "5",
      name: "Invoice Notifications",
      description: "Notify when invoices are generated or overdue",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      category: "billing"
    },
    {
      id: "6",
      name: "Payment Failures",
      description: "Alert when payment processing fails",
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      category: "billing"
    },
    {
      id: "7",
      name: "System Maintenance",
      description: "Notify about scheduled system maintenance",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      category: "system"
    },
    {
      id: "8",
      name: "Security Alerts",
      description: "Important security and login notifications",
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: true,
      category: "system"
    },
    {
      id: "9",
      name: "Backup Reports",
      description: "Daily backup status reports",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: false,
      category: "system"
    },
    {
      id: "10",
      name: "Monthly Reports",
      description: "Business performance and analytics summaries",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: false,
      category: "marketing"
    },
    {
      id: "11",
      name: "Customer Feedback",
      description: "New customer reviews and feedback notifications",
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      category: "marketing"
    },
    {
      id: "12",
      name: "Marketing Updates",
      description: "Product updates and feature announcements",
      emailEnabled: false,
      smsEnabled: false,
      pushEnabled: false,
      category: "marketing"
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [globalSettings, setGlobalSettings] = useState({
    emailDigest: true,
    digestFrequency: "daily",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "08:00",
    timezone: "America/New_York"
  });

  const categories = [
    { id: "appointments", label: "Appointments", icon: "calendar" },
    { id: "billing", label: "Billing", icon: "dollar" },
    { id: "system", label: "System", icon: "plugin" },
    { id: "marketing", label: "Marketing", icon: "chat" }
  ];

  const updateNotification = (id: string, field: keyof NotificationSetting, value: boolean) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, [field]: value } : notification
    ));
  };

  const toggleCategoryNotifications = (category: string, type: "emailEnabled" | "smsEnabled" | "pushEnabled", enabled: boolean) => {
    setNotifications(notifications.map(notification =>
      notification.category === category ? { ...notification, [type]: enabled } : notification
    ));
  };

  const filteredNotifications = activeCategory === "all"
    ? notifications
    : notifications.filter(n => n.category === activeCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "appointments":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "billing":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "system":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "marketing":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getChannelStats = () => {
    const emailCount = notifications.filter(n => n.emailEnabled).length;
    const smsCount = notifications.filter(n => n.smsEnabled).length;
    const pushCount = notifications.filter(n => n.pushEnabled).length;
    return { emailCount, smsCount, pushCount };
  };

  const { emailCount, smsCount, pushCount } = getChannelStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notification Preferences
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage how and when you receive notifications
          </p>
        </div>
        <button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <CheckCircleIcon className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Email Notifications
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {emailCount}
              </p>
            </div>
            <MailIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                SMS Notifications
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {smsCount}
              </p>
            </div>
            <ChatIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Push Notifications
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {pushCount}
              </p>
            </div>
            <BellIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Types
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.length}
              </p>
            </div>
            <PlugInIcon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </div>

      {/* Global Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Global Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Digest
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive summary emails instead of individual notifications
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.emailDigest}
                  onChange={(e) => setGlobalSettings({...globalSettings, emailDigest: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Digest Frequency
              </label>
              <select
                value={globalSettings.digestFrequency}
                onChange={(e) => setGlobalSettings({...globalSettings, digestFrequency: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Quiet Hours
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Disable notifications during specified hours
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={globalSettings.quietHours}
                  onChange={(e) => setGlobalSettings({...globalSettings, quietHours: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {globalSettings.quietHours && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={globalSettings.quietStart}
                    onChange={(e) => setGlobalSettings({...globalSettings, quietStart: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={globalSettings.quietEnd}
                    onChange={(e) => setGlobalSettings({...globalSettings, quietEnd: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            )}
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
            {category.icon === "calendar" && <CalenderIcon className="w-4 h-4" />}
            {category.icon === "dollar" && <DollarLineIcon className="w-4 h-4" />}
            {category.icon === "plugin" && <PlugInIcon className="w-4 h-4" />}
            {category.icon === "chat" && <ChatIcon className="w-4 h-4" />}
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Bulk Actions for Categories */}
      {activeCategory !== "all" && (
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Bulk Actions for {categories.find(c => c.id === activeCategory)?.label}
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={() => toggleCategoryNotifications(activeCategory, "emailEnabled", true)}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
              >
                Enable All Email
              </button>
              <button
                onClick={() => toggleCategoryNotifications(activeCategory, "smsEnabled", true)}
                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded transition-colors"
              >
                Enable All SMS
              </button>
              <button
                onClick={() => toggleCategoryNotifications(activeCategory, "pushEnabled", true)}
                className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
              >
                Enable All Push
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notification Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SMS
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Push
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.map((notification) => (
                <tr key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {notification.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(notification.category)}`}>
                      {notification.category.charAt(0).toUpperCase() + notification.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.emailEnabled}
                        onChange={(e) => updateNotification(notification.id, "emailEnabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.smsEnabled}
                        onChange={(e) => updateNotification(notification.id, "smsEnabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notification.pushEnabled}
                        onChange={(e) => updateNotification(notification.id, "pushEnabled", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};