"use client";
import React, { useState } from "react";
import { CalenderIcon, UserIcon, CheckCircleIcon, TimeIcon, CloseIcon } from "@/icons";

type ViewMode = "calendar" | "list";

interface Job {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  assignedStaff: string[];
  status: "unassigned" | "assigned" | "completed";
}

interface StaffAssignmentModalProps {
  job: Job;
  onSave: (jobId: string, assignedStaff: string[]) => void;
  onClose: () => void;
}

// Sample staff members for assignment
const availableStaff = [
  { name: "Maria Garcia", availability: "available" },
  { name: "John Smith", availability: "available" },
  { name: "Sarah Williams", availability: "busy" },
  { name: "Michael Brown", availability: "available" },
  { name: "Emily Davis", availability: "available" },
  { name: "David Johnson", availability: "off" },
];

const StaffAssignmentModal: React.FC<StaffAssignmentModalProps> = ({ job, onSave, onClose }) => {
  const [selectedStaff, setSelectedStaff] = useState<string[]>(job.assignedStaff);

  const toggleStaffSelection = (staffName: string) => {
    if (selectedStaff.includes(staffName)) {
      setSelectedStaff(selectedStaff.filter((s) => s !== staffName));
    } else {
      setSelectedStaff([...selectedStaff, staffName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(job.id, selectedStaff);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "busy":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "off":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-[1001]">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assign Staff to Job</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {job.clientName} - {job.service}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Details */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Date:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">{job.date}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Time:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">{job.time}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">{job.duration}</span>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">Service:</span>
                <span className="ml-2 text-gray-900 dark:text-white font-medium">{job.service}</span>
              </div>
            </div>
          </div>

          {/* Staff Selection */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Select Team Members ({selectedStaff.length} selected)
            </h3>
            <div className="space-y-2">
              {availableStaff.map((staff) => {
                const isSelected = selectedStaff.includes(staff.name);
                const isDisabled = staff.availability === "off";

                return (
                  <div
                    key={staff.name}
                    onClick={() => !isDisabled && toggleStaffSelection(staff.name)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                        : isSelected
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10 cursor-pointer"
                          : "border-gray-200 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? "bg-brand-600 border-brand-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircleIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{staff.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${getAvailabilityColor(staff.availability)}`}>
                          {staff.availability === "available" ? "Available" : staff.availability === "busy" ? "Busy" : "Off"}
                        </span>
                      </div>
                    </div>
                    {isDisabled && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">Not available</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warning if no staff selected */}
          {selectedStaff.length === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                <strong>Warning:</strong> No staff members are selected. This job will remain unassigned.
              </p>
            </div>
          )}

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
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to get dates for the current week (Mon-Sun)
const getCurrentWeekDates = () => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = currentDay === 0 ? -6 : 1 - currentDay; // Adjust to get Monday

  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);

  const formatDate = (date: Date) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return {
    monday: formatDate(monday),
    tuesday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 1)),
    wednesday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 2)),
    thursday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3)),
    friday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4)),
    saturday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5)),
    sunday: formatDate(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)),
  };
};

// Generate sample jobs with current week dates
const generateSampleJobs = (): Job[] => {
  const weekDates = getCurrentWeekDates();

  return [
    {
      id: "1",
      clientName: "Sarah Johnson",
      service: "Regular Clean",
      date: weekDates.monday,
      time: "9:00 AM",
      duration: "2 hours",
      assignedStaff: ["Maria Garcia", "John Smith"],
      status: "assigned",
    },
    {
      id: "2",
      clientName: "Michael Chen",
      service: "Deep Clean",
      date: weekDates.monday,
      time: "11:00 AM",
      duration: "4 hours",
      assignedStaff: [],
      status: "unassigned",
    },
    {
      id: "3",
      clientName: "Emily Davis",
      service: "Regular Clean",
      date: weekDates.tuesday,
      time: "9:00 AM",
      duration: "2 hours",
      assignedStaff: ["Maria Garcia", "John Smith"],
      status: "assigned",
    },
    {
      id: "4",
      clientName: "Robert Wilson",
      service: "Move-Out Clean",
      date: weekDates.wednesday,
      time: "2:00 PM",
      duration: "5 hours",
      assignedStaff: [],
      status: "unassigned",
    },
    {
      id: "5",
      clientName: "Jennifer Lee",
      service: "Regular Clean",
      date: weekDates.thursday,
      time: "10:00 AM",
      duration: "2 hours",
      assignedStaff: ["Sarah Williams"],
      status: "assigned",
    },
    {
      id: "6",
      clientName: "Tech Solutions Inc",
      service: "Office Clean",
      date: weekDates.friday,
      time: "6:00 PM",
      duration: "3 hours",
      assignedStaff: ["Michael Brown", "Emily Davis"],
      status: "assigned",
    },
  ];
};

const sampleJobs: Job[] = generateSampleJobs();

export const TeamScheduleTab = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const unassignedCount = jobs.filter((j) => j.status === "unassigned").length;
  const assignedCount = jobs.filter((j) => j.status === "assigned").length;

  const handleAssignStaff = (jobId: string, assignedStaff: string[]) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              assignedStaff,
              status: assignedStaff.length > 0 ? "assigned" : "unassigned",
            }
          : job
      )
    );
    setShowAssignModal(false);
    setSelectedJob(null);
  };

  const openAssignModal = (job: Job) => {
    setSelectedJob(job);
    setShowAssignModal(true);
  };

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "unassigned":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "assigned":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "completed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CalenderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{assignedCount}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Needs Assignment</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{unassignedCount}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <UserIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Assign team members to upcoming jobs
        </p>
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
              viewMode === "list"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
              viewMode === "calendar"
                ? "bg-brand-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Jobs List */}
      {viewMode === "list" ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {job.clientName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                      {job.status === "unassigned" ? "Needs Assignment" : "Assigned"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{job.service}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{job.date}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Time:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{job.time}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{job.duration}</span>
                </div>
              </div>

              {/* Assigned Staff */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assigned Staff:
                </p>
                {job.assignedStaff.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.assignedStaff.map((staff, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-full text-sm"
                      >
                        {staff}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No staff assigned yet
                  </p>
                )}
                <button
                  onClick={() => openAssignModal(job)}
                  className="mt-3 text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
                >
                  {job.assignedStaff.length > 0 ? "Edit Assignment" : "Assign Staff"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Schedule - Calendar View</h3>
            <div className="grid grid-cols-7 gap-2">
              {/* Simple weekly view of jobs */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, dayIndex) => (
                <div key={day} className="min-h-[200px]">
                  <div className="text-center font-medium text-sm text-gray-700 dark:text-gray-300 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {day}
                  </div>
                  <div className="space-y-2">
                    {jobs
                      .filter((job) => {
                        // Simple date matching - in production would use proper date comparison
                        const jobDate = new Date(job.date);
                        const currentWeekStart = new Date();
                        currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + dayIndex);
                        return jobDate.toDateString() === currentWeekStart.toDateString();
                      })
                      .map((job) => (
                        <div
                          key={job.id}
                          className={`p-2 rounded text-xs ${
                            job.status === "unassigned"
                              ? "bg-red-100 dark:bg-red-900/20 border-l-2 border-red-500"
                              : "bg-green-100 dark:bg-green-900/20 border-l-2 border-green-500"
                          }`}
                        >
                          <div className="font-medium text-gray-900 dark:text-white truncate">{job.time}</div>
                          <div className="text-gray-700 dark:text-gray-300 truncate">{job.clientName}</div>
                          <div className="text-gray-600 dark:text-gray-400 text-xs truncate">{job.service}</div>
                          {job.assignedStaff.length > 0 && (
                            <div className="mt-1 flex items-center gap-1">
                              <UserIcon className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
                                {job.assignedStaff.length} staff
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info message */}
          <div className="mt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              <strong>Calendar View:</strong> Shows jobs from the current week. Red = Unassigned, Green = Assigned.
              Click "List View" above to see all jobs with assignment controls.
            </p>
          </div>
        </div>
      )}

      {/* Staff Assignment Modal */}
      {showAssignModal && selectedJob && (
        <StaffAssignmentModal
          job={selectedJob}
          onSave={handleAssignStaff}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};
