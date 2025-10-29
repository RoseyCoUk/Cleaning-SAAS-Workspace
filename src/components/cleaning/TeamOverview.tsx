"use client";
import React, { useState } from "react";
import { UserCircleIcon, MailIcon, EnvelopeIcon, TimeIcon, PencilIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import Badge from "@/components/ui/badge/Badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: "working" | "available" | "off-duty";
  currentLocation?: string;
  hoursThisWeek: number;
  completedJobs: number;
  rating: number;
  avatar?: string;
  hireDate: string;
  wage: number;
}

interface RateOverride {
  staffId: string;
  staffName: string;
  baseRate: number;
  overrideRate: number;
  reason: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Maria Garcia",
    role: "Team Leader",
    phone: "(555) 123-4567",
    email: "maria@cleanteam.com",
    status: "working",
    currentLocation: "Tech Startup Inc",
    hoursThisWeek: 38,
    completedJobs: 156,
    rating: 4.9,
    hireDate: "2022-03-15",
    wage: 25,
  },
  {
    id: "2",
    name: "John Smith",
    role: "Cleaner",
    phone: "(555) 234-5678",
    email: "john@cleanteam.com",
    status: "working",
    currentLocation: "Medical Center",
    hoursThisWeek: 35,
    completedJobs: 89,
    rating: 4.7,
    hireDate: "2023-01-10",
    wage: 18,
  },
  {
    id: "3",
    name: "Lisa Chen",
    role: "Cleaner",
    phone: "(555) 345-6789",
    email: "lisa@cleanteam.com",
    status: "available",
    hoursThisWeek: 32,
    completedJobs: 120,
    rating: 4.8,
    hireDate: "2022-08-22",
    wage: 20,
  },
  {
    id: "4",
    name: "Robert Wilson",
    role: "Cleaner",
    phone: "(555) 456-7890",
    email: "robert@cleanteam.com",
    status: "off-duty",
    hoursThisWeek: 0,
    completedJobs: 67,
    rating: 4.6,
    hireDate: "2023-05-01",
    wage: 17,
  },
  {
    id: "5",
    name: "Emily Brown",
    role: "Team Leader",
    phone: "(555) 567-8901",
    email: "emily@cleanteam.com",
    status: "available",
    hoursThisWeek: 40,
    completedJobs: 203,
    rating: 5.0,
    hireDate: "2021-11-15",
    wage: 26,
  },
];

export const TeamOverview = () => {
  const [selectedRole, setSelectedRole] = useState<"all" | "Team Leader" | "Cleaner">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "working" | "available" | "off-duty">("all");

  // Rate override management
  const [rateOverrides, setRateOverrides] = useState<RateOverride[]>([
    {
      staffId: "2",
      staffName: "John Smith",
      baseRate: 18.0,
      overrideRate: 19.0,
      reason: "Extra responsibilities while owner away (covering driver duties)",
      startDate: "2025-10-21",
      endDate: "2025-10-28",
      active: true,
    },
  ]);

  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<{id: string; name: string; baseRate: number} | null>(null);
  const [modalData, setModalData] = useState({
    overrideRate: 0,
    reason: "",
    startDate: "",
    endDate: "",
  });

  const filteredMembers = teamMembers.filter(member => {
    const matchesRole = selectedRole === "all" || member.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || member.status === selectedStatus;
    return matchesRole && matchesStatus;
  });

  const openRateModal = (staff: {id: string; name: string; baseRate: number}) => {
    setSelectedStaff(staff);

    // Check if there's an existing active override
    const existingOverride = rateOverrides.find(
      o => o.staffId === staff.id && o.active
    );

    if (existingOverride) {
      setModalData({
        overrideRate: existingOverride.overrideRate,
        reason: existingOverride.reason,
        startDate: existingOverride.startDate,
        endDate: existingOverride.endDate,
      });
    } else {
      setModalData({
        overrideRate: staff.baseRate,
        reason: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
      });
    }

    setShowRateModal(true);
  };

  const handleSaveOverride = () => {
    if (!selectedStaff) return;

    const newOverride: RateOverride = {
      staffId: selectedStaff.id,
      staffName: selectedStaff.name,
      baseRate: selectedStaff.baseRate,
      overrideRate: modalData.overrideRate,
      reason: modalData.reason,
      startDate: modalData.startDate,
      endDate: modalData.endDate,
      active: true,
    };

    setRateOverrides(prev => {
      // Deactivate any existing override for this staff member
      const filtered = prev.filter(o => o.staffId !== selectedStaff.id);
      return [...filtered, newOverride];
    });

    setShowRateModal(false);
    setSelectedStaff(null);
  };

  const getActiveOverride = (staffId: string) => {
    return rateOverrides.find(o => o.staffId === staffId && o.active);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "available":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "off-duty":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      default:
        return "";
    }
  };

  const totalHours = teamMembers.reduce((sum, member) => sum + member.hoursThisWeek, 0);
  const workingNow = teamMembers.filter(m => m.status === "working").length;
  const averageRating = (teamMembers.reduce((sum, m) => sum + m.rating, 0) / teamMembers.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Team Size</p>
            <UserCircleIcon className="w-5 h-5 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{teamMembers.length}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Active employees</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Currently Working</p>
            <CheckCircleIcon className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{workingNow}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">On active jobs</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Hours</p>
            <TimeIcon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHours}h</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">This week</p>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
            <span>⭐</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageRating}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team average</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex gap-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as "all" | "Team Leader" | "Cleaner")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="Team Leader">Team Leaders</option>
            <option value="Cleaner">Cleaners</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as "all" | "working" | "available" | "off-duty")}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="working">Working</option>
            <option value="available">Available</option>
            <option value="off-duty">Off Duty</option>
          </select>

          <button className="ml-auto px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
            Add Team Member
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => {
          const override = getActiveOverride(member.id);

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <UserCircleIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(member.status)}`}>
                    {member.status.replace("-", " ")}
                  </span>
                  {override && (
                    <Badge color="warning">
                      TEMP RATE
                    </Badge>
                  )}
                </div>
              </div>

            {member.currentLocation && (
              <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-400">Currently at:</p>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{member.currentLocation}</p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <MailIcon className="w-4 h-4" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <EnvelopeIcon className="w-4 h-4" />
                <span className="truncate">{member.email}</span>
              </div>
            </div>

            {/* Pay Rate Section */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
              <div className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Base Rate: </span>
                <span className="font-medium text-gray-900 dark:text-white">${member.wage.toFixed(2)}/hr</span>
              </div>
              {override && (
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Current Rate: </span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    ${override.overrideRate.toFixed(2)}/hr
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">This Week</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.hoursThisWeek}h</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Jobs</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{member.completedJobs}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Rating</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">⭐ {member.rating}</p>
              </div>
            </div>

            {/* Rate Override Button */}
            <button
              onClick={() => openRateModal({id: member.id, name: member.name, baseRate: member.wage})}
              className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-gray-100 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <PencilIcon className="h-4 w-4" />
              {override ? "Update Rate Override" : "Set Temp Rate"}
            </button>

            {override && (
              <div className="mt-2 p-2 bg-orange-50 dark:bg-orange-900/10 rounded text-xs">
                <div className="font-medium text-orange-800 dark:text-orange-400">
                  {override.reason}
                </div>
                <div className="text-orange-600 dark:text-orange-500 mt-1">
                  {override.startDate} to {override.endDate}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm">
                View Profile
              </button>
              <button className="flex-1 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm">
                Assign Job
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Rate Override Modal */}
      <Modal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        title="Adjust Pay Rate"
      >
        {selectedStaff && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set a temporary rate override for <strong>{selectedStaff.name}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Base Rate
              </label>
              <input
                type="number"
                value={selectedStaff.baseRate}
                disabled
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Temporary Rate
              </label>
              <input
                type="number"
                step="0.50"
                value={modalData.overrideRate}
                onChange={(e) => setModalData(prev => ({
                  ...prev,
                  overrideRate: Number(e.target.value)
                }))}
                placeholder="19.00"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Difference: ${(modalData.overrideRate - selectedStaff.baseRate).toFixed(2)}/hr
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reason for Override
              </label>
              <input
                type="text"
                value={modalData.reason}
                onChange={(e) => setModalData(prev => ({
                  ...prev,
                  reason: e.target.value
                }))}
                placeholder="e.g., Extra responsibilities while owner away"
                className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={modalData.startDate}
                  onChange={(e) => setModalData(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={modalData.endDate}
                  onChange={(e) => setModalData(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  className="w-full rounded-lg border border-gray-200 dark:border-gray-600 px-3 py-2 text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowRateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Save Override
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};