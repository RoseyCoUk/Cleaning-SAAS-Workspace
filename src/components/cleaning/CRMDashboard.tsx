"use client";
import React, { useState } from "react";
import { ClientCard } from "./ClientCard";
import { UserCircleIcon, GroupIcon, PlusIcon, AlertIcon } from "@/icons";

const sampleClients = [
  {
    id: "1",
    name: "Sarah Johnson",
    address: "123 Oak Street, Suite 100",
    phone: "(555) 123-4567",
    email: "sarah.j@email.com",
    preferredContact: "phone" as const,
    nextService: "Mon, Dec 23 at 9:00 AM",
    lastService: "Mon, Dec 9",
    frequency: "Bi-weekly",
    lifetimeValue: 4800,
    status: "active" as const,
    tags: ["VIP", "4-week schedule", "Auto-pay"],
    paymentMethod: "auto-pay" as const,
  },
  {
    id: "2",
    name: "Michael Chen",
    address: "456 Pine Avenue",
    phone: "(555) 234-5678",
    email: "mchen@business.com",
    preferredContact: "email" as const,
    nextService: "Wed, Dec 25 at 2:00 PM",
    lastService: "Wed, Dec 11",
    frequency: "Weekly",
    lifetimeValue: 12500,
    status: "active" as const,
    tags: ["Commercial", "Weekly", "Net-30"],
    paymentMethod: "invoice" as const,
  },
  {
    id: "3",
    name: "Emily Davis",
    address: "789 Elm Street, Apt 5B",
    phone: "(555) 345-6789",
    email: "emily.davis@email.com",
    preferredContact: "sms" as const,
    nextService: "Fri, Jan 3 at 10:00 AM",
    lastService: "Fri, Dec 6",
    frequency: "Monthly",
    lifetimeValue: 2400,
    status: "active" as const,
    tags: ["Monthly", "Eco-friendly"],
    paymentMethod: "auto-pay" as const,
  },
  {
    id: "4",
    name: "Robert Wilson",
    address: "321 Maple Drive",
    phone: "(555) 456-7890",
    email: "rwilson@office.com",
    preferredContact: "phone" as const,
    lastService: "Thu, Nov 28",
    frequency: "Bi-weekly",
    lifetimeValue: 3200,
    status: "inactive" as const,
    tags: ["Paused", "2-week schedule"],
    paymentMethod: "invoice" as const,
  },
];

export const CRMDashboard = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredClients = sampleClients.filter(client => {
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* CRM Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <GroupIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Clients</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">248</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <UserCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">186</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
              <PlusIcon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">New This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Requiring Attention</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search clients by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "all"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "active"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus("inactive")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === "inactive"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Inactive
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/>
                <line x1="3" y1="12" x2="21" y2="12" strokeWidth="2"/>
                <line x1="3" y1="18" x2="21" y2="18" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          {/* Add Client Button */}
          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2">
            <PlusIcon className="w-4 h-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Client Cards Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Load More Clients
        </button>
      </div>
    </div>
  );
};