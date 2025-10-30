"use client";
import React, { useState } from "react";
import { ClientCard } from "./ClientCard";
import { useClients, type Client } from "@/contexts/ClientContext";
import { UserCircleIcon, PlusIcon, EyeIcon, CheckCircleIcon, DollarLineIcon, PieChartIcon, CloseIcon, DownloadIcon } from "@/icons";
import { EditClientModal } from "./EditClientModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { exportToCSV } from "@/utils/exportUtils";

interface AddClientModalProps {
  onSave: (client: Client) => void;
  onClose: () => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    address: "",
    phone: "",
    email: "",
    preferredContact: "email",
    frequency: "Bi-weekly",
    status: "pending",
    paymentMethod: "invoice",
    referralSource: "google", // GAP-026: Default to Google
    tags: [],
    hourlyRate: 50,
    invoicePreferences: {
      frequency: "per_job",
      autoSend: true,
      sendVia: {
        email: true,
        sms: false,
      },
    },
  });

  const [customTag, setCustomTag] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      name: formData.name,
      address: formData.address || "",
      phone: formData.phone,
      email: formData.email,
      preferredContact: formData.preferredContact || "email",
      frequency: formData.frequency || "Bi-weekly",
      lifetimeValue: 0,
      status: formData.status || "pending",
      tags: formData.tags || [],
      paymentMethod: formData.paymentMethod,
      hourlyRate: formData.hourlyRate ?? 50,
      referralSource: formData.referralSource, // GAP-026
      invoicePreferences: formData.invoicePreferences || {
        frequency: "per_job",
        autoSend: true,
        sendVia: { email: true, sms: false },
      },
    };
    onSave(newClient);
  };

  const addTag = () => {
    if (customTag.trim() && !formData.tags?.includes(customTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), customTag.trim()],
      });
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Client</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="e.g., Sarah Johnson or Tech Startup Inc"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="123 Main St, Suite 100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="client@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value as "phone" | "email" | "sms" })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="sms">SMS</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Client["paymentMethod"] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="invoice">Invoice</option>
                  <option value="auto-pay">Auto-Pay</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="check">Check</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How did you hear about us?
                </label>
                <select
                  value={formData.referralSource}
                  onChange={(e) => setFormData({ ...formData, referralSource: e.target.value as Client["referralSource"] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="google">Google Search</option>
                  <option value="referral">Referral</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="nextdoor">Nextdoor</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Service Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="One-time">One-time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as Client["status"] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing & Invoicing */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Billing & Invoicing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hourly Rate
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.hourlyRate ?? ""}
                    onChange={(e) => {
                      // Allow clearing the input by treating empty string as undefined
                      if (e.target.value === "") {
                        setFormData({
                          ...formData,
                          hourlyRate: undefined
                        });
                      } else {
                        const value = Number(e.target.value);
                        setFormData({
                          ...formData,
                          hourlyRate: Number.isFinite(value) ? value : formData.hourlyRate
                        });
                      }
                    }}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invoice Frequency
                </label>
                <select
                  value={formData.invoicePreferences?.frequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    invoicePreferences: {
                      ...formData.invoicePreferences!,
                      frequency: e.target.value as "per_job" | "weekly" | "monthly"
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                >
                  <option value="per_job">Per Job</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Auto-Send Invoices
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.invoicePreferences?.sendVia.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        invoicePreferences: {
                          ...formData.invoicePreferences!,
                          sendVia: {
                            ...formData.invoicePreferences!.sendVia,
                            email: e.target.checked
                          }
                        }
                      })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Send via Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.invoicePreferences?.sendVia.sms}
                      onChange={(e) => setFormData({
                        ...formData,
                        invoicePreferences: {
                          ...formData.invoicePreferences!,
                          sendVia: {
                            ...formData.invoicePreferences!.sendVia,
                            sms: e.target.checked
                          }
                        }
                      })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Send via SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!formData.invoicePreferences?.autoSend}
                      onChange={(e) => setFormData({
                        ...formData,
                        invoicePreferences: {
                          ...formData.invoicePreferences!,
                          autoSend: !e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Don't auto-send (manual only)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Add a tag (e.g., Residential, Premium)"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Add Tag
                </button>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-brand-900 dark:hover:text-brand-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const AllClients = () => {
  const { clients, addClient, updateClient, deleteClient } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "pending">("all");
  const [serviceFilter, setServiceFilter] = useState<"all" | "recurring" | "one-off">("all");
  const [sortBy, setSortBy] = useState<"name" | "value" | "lastService">("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleAddClient = (newClient: Client) => {
    addClient(newClient);
    setShowAddModal(false);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedClient: Client) => {
    updateClient(updatedClient.id, updatedClient);
    setShowEditModal(false);
    setSelectedClient(null);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setShowDeleteModal(false);
      setSelectedClient(null);
    }
  };

  const handleExportClients = () => {
    const exportData = filteredAndSortedClients.map(client => ({
      Name: client.name,
      Address: client.address,
      Phone: client.phone,
      Email: client.email,
      "Preferred Contact": client.preferredContact,
      Frequency: client.frequency,
      "Lifetime Value": `$${client.lifetimeValue.toLocaleString()}`,
      Status: client.status,
      Tags: client.tags.join(", "),
      "Payment Method": client.paymentMethod || "N/A",
    }));

    const filename = `clients_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(exportData, filename);
  };

  const filteredAndSortedClients = clients
    .filter(client => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm);

      const matchesStatus = filterStatus === "all" || client.status === filterStatus;

      // Service type filter
      let matchesService = true;
      if (serviceFilter === "one-off") {
        matchesService = client.frequency === "One-time";
      } else if (serviceFilter === "recurring") {
        matchesService = client.frequency !== "One-time";
      }

      return matchesSearch && matchesStatus && matchesService;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "value":
          return b.lifetimeValue - a.lifetimeValue;
        case "lastService":
          return (b.lastService || "").localeCompare(a.lastService || "");
        default:
          return 0;
      }
    });

  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === "active").length;
  const totalLifetimeValue = clients.reduce((sum, c) => sum + c.lifetimeValue, 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
            <UserCircleIcon className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClients}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Clients</p>
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeClients}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currently servicing</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Lifetime Value</p>
            <DollarLineIcon className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${totalLifetimeValue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All clients combined</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Client Value</p>
            <PieChartIcon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${Math.round(totalLifetimeValue / totalClients).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per client average</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <EyeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "inactive" | "pending")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as "all" | "recurring" | "one-off")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Services</option>
              <option value="recurring">Recurring Only</option>
              <option value="one-off">One-Off Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "name" | "value" | "lastService")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="value">Sort by Value</option>
              <option value="lastService">Sort by Last Service</option>
            </select>

            <button
              onClick={handleExportClients}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" />
              Export
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredAndSortedClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onEdit={() => handleEditClient(client)}
            onDelete={() => handleDeleteClick(client)}
          />
        ))}
      </div>

      {filteredAndSortedClients.length === 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No clients found matching your criteria</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Add Your First Client
          </button>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientModal onSave={handleAddClient} onClose={() => setShowAddModal(false)} />
      )}

      {/* Edit Client Modal */}
      {showEditModal && selectedClient && (
        <EditClientModal
          client={selectedClient}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClient(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedClient && (
        <DeleteConfirmationModal
          title="Delete Client"
          message="Are you sure you want to delete this client? This will remove all client data, including service history and invoices."
          itemName={selectedClient.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedClient(null);
          }}
        />
      )}
    </div>
  );
};