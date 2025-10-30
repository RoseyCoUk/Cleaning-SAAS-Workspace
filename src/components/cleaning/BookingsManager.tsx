"use client";
import React, { useState } from "react";
import { PlusIcon, TableIcon, ListIcon, CheckCircleIcon, TimeIcon, DownloadIcon } from "@/icons";
import { NewBookingModal } from "./NewBookingModal";
import { EditBookingModal } from "./EditBookingModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { ServiceDetailDrawer, ServiceDetail } from "./ServiceDetailDrawer";
import { exportToCSV } from "@/utils/exportUtils";

type BookingStatus = "active" | "paused" | "ended";
type Frequency = "all" | "weekly" | "bi-weekly" | "4-week" | "one-off";
type ServiceType = "all" | "regular" | "deep" | "move-out" | "commercial";
type ViewType = "table" | "list";

interface Booking {
  id: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  service: string;
  frequency: string;
  nextDate: string;
  time?: string;
  duration?: string;
  assignedStaff: string;
  status: BookingStatus;
  price?: number;
  notes?: string;
  instructions?: string;
  lastCompleted?: string;
}

export const BookingsManager = () => {
  const [viewType, setViewType] = useState<ViewType>("table");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [frequencyFilter, setFrequencyFilter] = useState<Frequency>("all");
  const [serviceFilter, setServiceFilter] = useState<ServiceType>("all");
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);

  // Bookings state - in production this would come from API/Context
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "1",
      clientName: "Sarah Johnson",
      clientEmail: "sarah@example.com",
      clientPhone: "(555) 123-4567",
      clientAddress: "123 Maple St, Springfield, IL 62701",
      service: "Regular Clean",
      frequency: "Weekly",
      nextDate: "Dec 23, 2024",
      time: "9:00 AM",
      duration: "2 hours",
      assignedStaff: "Team A",
      status: "active",
      price: 120,
      notes: "Regular cleaning service",
      instructions: "Please use eco-friendly products. Key under mat.",
      lastCompleted: "Dec 16, 2024",
    },
    {
      id: "2",
      clientName: "Michael Chen",
      clientEmail: "michael@example.com",
      clientPhone: "(555) 234-5678",
      clientAddress: "456 Oak Ave, Springfield, IL 62702",
      service: "Regular Clean",
      frequency: "Bi-Weekly",
      nextDate: "Dec 25, 2024",
      time: "10:00 AM",
      duration: "2.5 hours",
      assignedStaff: "Team A",
      status: "active",
      price: 150,
      notes: "Bi-weekly service with kitchen focus",
      instructions: "Dog friendly. Please secure side gate.",
      lastCompleted: "Dec 11, 2024",
    },
    {
      id: "3",
      clientName: "Emily Davis",
      clientEmail: "emily@example.com",
      clientPhone: "(555) 345-6789",
      clientAddress: "789 Pine Rd, Springfield, IL 62703",
      service: "Deep Clean",
      frequency: "4-Week",
      nextDate: "Jan 3, 2025",
      time: "8:00 AM",
      duration: "4 hours",
      assignedStaff: "Team A",
      status: "active",
      price: 220,
      notes: "Deep clean including baseboards and windows",
      instructions: "Code 1234 for front door. No pets.",
      lastCompleted: "Dec 6, 2024",
    },
    {
      id: "4",
      clientName: "Robert Wilson",
      clientEmail: "robert@example.com",
      clientPhone: "(555) 456-7890",
      clientAddress: "321 Elm Dr, Springfield, IL 62704",
      service: "Regular Clean",
      frequency: "Weekly",
      nextDate: "Dec 26, 2024",
      time: "11:00 AM",
      duration: "2 hours",
      assignedStaff: "Team A",
      status: "paused",
      price: 115,
      notes: "Service paused for holidays",
      instructions: "Ring doorbell. Cat inside - please be careful.",
      lastCompleted: "Dec 12, 2024",
    },
    {
      id: "5",
      clientName: "Emma Rodriguez",
      clientEmail: "emma@example.com",
      clientPhone: "(555) 567-8901",
      clientAddress: "654 Birch Ln, Springfield, IL 62705",
      service: "Deep Clean",
      frequency: "One-Off",
      nextDate: "Nov 2, 2024",
      time: "9:30 AM",
      duration: "5 hours",
      assignedStaff: "Team A",
      status: "ended",
      price: 275,
      notes: "One-time deep clean - completed",
      instructions: "Complete access provided. Large home.",
      lastCompleted: "Nov 2, 2024",
    },
    {
      id: "6",
      clientName: "David Kim",
      clientEmail: "david@example.com",
      clientPhone: "(555) 678-9012",
      clientAddress: "987 Cedar Ct, Springfield, IL 62706",
      service: "Move-Out",
      frequency: "One-Off",
      nextDate: "Nov 5, 2024",
      time: "7:00 AM",
      duration: "6 hours",
      assignedStaff: "Team A",
      status: "ended",
      price: 325,
      notes: "Move-out clean for apartment - completed",
      instructions: "Landlord inspection at 2 PM. All areas.",
      lastCompleted: "Nov 5, 2024",
    },
  ]);

  // Calculate KPIs
  const activeBookings = bookings.filter((b) => b.status === "active").length;
  const weeklyCount = bookings.filter((b) => b.frequency === "Weekly" && b.status === "active").length;
  const biWeeklyCount = bookings.filter((b) => b.frequency === "Bi-Weekly" && b.status === "active").length;
  const fourWeekCount = bookings.filter((b) => b.frequency === "4-Week" && b.status === "active").length;

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== "all" && booking.status !== statusFilter) return false;
    if (frequencyFilter !== "all" && booking.frequency.toLowerCase().replace("-", "") !== frequencyFilter.replace("-", "")) return false;

    // Service filter logic
    if (serviceFilter !== "all") {
      const bookingService = booking.service.toLowerCase().replace(/\s+/g, "-");
      if (bookingService !== serviceFilter && !bookingService.includes(serviceFilter.replace("-", ""))) {
        return false;
      }
    }

    return true;
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "paused":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "ended":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const handleNewBooking = (booking: any) => {
    const newBooking: Booking = {
      id: Date.now().toString(),
      clientName: booking.clientName,
      service: booking.service,
      frequency: booking.frequency,
      nextDate: booking.date,
      assignedStaff: booking.assignedStaff,
      status: "active",
    };
    setBookings([...bookings, newBooking]);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedData: any) => {
    if (!selectedBooking) return;

    setBookings(bookings.map((booking) =>
      booking.id === selectedBooking.id
        ? { ...booking, ...updatedData }
        : booking
    ));
    setShowEditModal(false);
    setSelectedBooking(null);
  };

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedBooking) return;

    setBookings(bookings.filter((booking) => booking.id !== selectedBooking.id));
    setShowDeleteModal(false);
    setSelectedBooking(null);
  };

  const handleViewDetails = (booking: Booking) => {
    // Map booking status to service detail status
    const mapStatus = (bookingStatus: BookingStatus): ServiceDetail["status"] => {
      switch (bookingStatus) {
        case "active":
          return "scheduled";
        case "paused":
          return "cancelled";
        case "ended":
          return "completed";
        default:
          return "scheduled";
      }
    };

    // Convert Booking to ServiceDetail using real data
    const serviceDetail: ServiceDetail = {
      id: booking.id,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail || "No email on file",
      clientPhone: booking.clientPhone || "No phone on file",
      clientAddress: booking.clientAddress || "No address on file",
      service: booking.service,
      frequency: booking.frequency,
      date: booking.nextDate,
      time: booking.time || "Time TBD",
      duration: booking.duration || "Duration TBD",
      assignedStaff: booking.assignedStaff,
      status: mapStatus(booking.status),
      price: booking.price || 0,
      notes: booking.notes,
      instructions: booking.instructions,
      lastCompleted: booking.lastCompleted,
      nextScheduled: booking.nextDate,
    };
    setSelectedService(serviceDetail);
    setShowDetailDrawer(true);
  };

  const handleCompleteService = () => {
    // In production, this would update the service status
    if (selectedService) {
      alert(`Service for ${selectedService.clientName} marked as complete!`);
      setShowDetailDrawer(false);
    }
  };

  const handleCancelService = () => {
    // In production, this would update the service status
    if (selectedService) {
      alert(`Service for ${selectedService.clientName} has been cancelled.`);
      setShowDetailDrawer(false);
    }
  };

  const handleExportBookings = () => {
    const exportData = filteredBookings.map(booking => ({
      Client: booking.clientName,
      Service: booking.service,
      Frequency: booking.frequency,
      "Next Date": booking.nextDate,
      "Assigned Staff": booking.assignedStaff,
      Status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
    }));

    const filename = `bookings_${new Date().toISOString().split('T')[0]}`;
    exportToCSV(exportData, filename);
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Bookings</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{activeBookings}</p>
            </div>
            <div className="p-3 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Weekly</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{weeklyCount}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TimeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bi-Weekly</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{biWeeklyCount}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <TimeIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">4-Week</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{fourWeekCount}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <TimeIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | "all")}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="ended">Ended</option>
            </select>

            {/* Frequency Filter */}
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value as Frequency)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Frequencies</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-Weekly</option>
              <option value="4-week">4-Week</option>
              <option value="one-off">One-Off</option>
            </select>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as ServiceType)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="all">All Services</option>
              <option value="regular">Regular</option>
              <option value="deep">Deep</option>
              <option value="move-out">Move-Out</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Right side - View Toggle and Add Button */}
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setViewType("table")}
                className={`px-3 py-2 rounded-l-lg transition-colors ${
                  viewType === "table"
                    ? "bg-brand-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <TableIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`px-3 py-2 rounded-r-lg transition-colors ${
                  viewType === "list"
                    ? "bg-brand-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportBookings}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <DownloadIcon className="w-5 h-5" />
              Export
            </button>

            {/* Add Booking Button */}
            <button
              onClick={() => setShowNewBookingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Booking
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Display */}
      {viewType === "table" ? (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Next Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Assigned Staff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => handleViewDetails(booking)}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {booking.clientName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.frequency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.nextDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{booking.assignedStaff}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(booking);
                          }}
                          className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditBooking(booking);
                          }}
                          className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(booking);
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => handleViewDetails(booking)}
              className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {booking.clientName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Service:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{booking.service}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Frequency:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{booking.frequency}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Next Date:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{booking.nextDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Assigned:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{booking.assignedStaff}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(booking);
                    }}
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBooking(booking);
                    }}
                    className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(booking);
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredBookings.length === 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No bookings found matching your filters</p>
        </div>
      )}

      {/* Modals */}
      {showNewBookingModal && (
        <NewBookingModal
          onSave={handleNewBooking}
          onClose={() => setShowNewBookingModal(false)}
        />
      )}

      {showEditModal && selectedBooking && (
        <EditBookingModal
          booking={selectedBooking}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {showDeleteModal && selectedBooking && (
        <DeleteConfirmationModal
          title="Delete Booking"
          message="Are you sure you want to delete this booking? This action cannot be undone."
          itemName={`${selectedBooking.clientName} - ${selectedBooking.service}`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSelectedBooking(null);
          }}
        />
      )}

      {/* Service Detail Drawer */}
      {showDetailDrawer && selectedService && (
        <ServiceDetailDrawer
          isOpen={showDetailDrawer}
          service={selectedService}
          onClose={() => {
            setShowDetailDrawer(false);
            setSelectedService(null);
          }}
          onEdit={() => {
            // In production, open edit modal with service details
            setShowDetailDrawer(false);
            const booking = bookings.find(b => b.id === selectedService.id);
            if (booking) {
              handleEditBooking(booking);
            }
          }}
          onComplete={handleCompleteService}
          onCancel={handleCancelService}
        />
      )}
    </div>
  );
};
