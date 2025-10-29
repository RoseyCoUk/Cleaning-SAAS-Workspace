"use client";
import React, { useState, useEffect } from "react";
import { CheckCircleIcon, TimeIcon, UserIcon, FolderIcon, CameraIcon } from "@/icons";
import { ClientInfoDrawer, ClientInfo } from "./ClientInfoDrawer";

interface Job {
  id: string;
  clientName: string;
  address: string;
  phone: string;
  service: string;
  time: string;
  duration: string;
  instructions: string;
  paymentMethod: string;
  status: "upcoming" | "in_progress" | "completed";
}

// Sample jobs
const sampleJobs: Job[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    address: "123 Oak Street, Apt 4B",
    phone: "(555) 123-4567",
    service: "Regular Clean",
    time: "9:00 AM",
    duration: "2 hours",
    instructions: "Key under mat. Focus on kitchen and bathrooms. Cat friendly!",
    paymentMethod: "Auto-charge (Card ending 4242)",
    status: "in_progress",
  },
  {
    id: "2",
    clientName: "Michael Chen",
    address: "456 Maple Drive",
    phone: "(555) 234-5678",
    service: "Deep Clean",
    time: "11:30 AM",
    duration: "4 hours",
    instructions: "Please call when arriving. Two dogs, very friendly.",
    paymentMethod: "Auto-charge (Bank ending 6789)",
    status: "upcoming",
  },
];

// Sample client data for drawer
const sampleClients: Record<string, ClientInfo> = {
  "Sarah Johnson": {
    id: "1",
    name: "Sarah Johnson",
    phone: "(555) 123-4567",
    address: "123 Oak Street, Apt 4B",
    specialInstructions: "Key under mat. Focus on kitchen and bathrooms. Cat friendly!",
    paymentMethod: "Auto-charge (Card ending 4242)",
    jobHistory: [
      { date: "Oct 15, 2025", service: "Regular Clean", duration: "2 hours", status: "completed" },
      { date: "Oct 1, 2025", service: "Regular Clean", duration: "2 hours", status: "completed" },
      { date: "Sep 15, 2025", service: "Deep Clean", duration: "4 hours", status: "completed" },
    ],
  },
  "Michael Chen": {
    id: "2",
    name: "Michael Chen",
    phone: "(555) 234-5678",
    address: "456 Maple Drive",
    specialInstructions: "Please call when arriving. Two dogs, very friendly.",
    paymentMethod: "Auto-charge (Bank ending 6789)",
    jobHistory: [
      { date: "Oct 20, 2025", service: "Deep Clean", duration: "4 hours", status: "completed" },
      { date: "Sep 25, 2025", service: "Regular Clean", duration: "3 hours", status: "completed" },
    ],
  },
};

export const StaffTodayTab = () => {
  const [jobs, setJobs] = useState<Job[]>(sampleJobs);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  const [photoError, setPhotoError] = useState<string>("");
  const [clientDrawerOpen, setClientDrawerOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);

  // Cleanup preview URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoPreviewUrls]);

  const handleStartJob = (jobId: string) => {
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "in_progress" as const } : j)));
  };

  const handleCompleteJob = (jobId: string) => {
    setUploadingPhotos(jobId);
    setSelectedFiles([]);
    setPhotoPreviewUrls([]);
    setPhotoError("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Revoke existing preview URLs before creating new ones to prevent memory leaks
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));

    // Validate file count
    if (files.length < 1 || files.length > 5) {
      setPhotoError("Please select 1-5 photos");
      setSelectedFiles([]);
      setPhotoPreviewUrls([]);
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/heic"];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      setPhotoError("Please upload only image files (JPG, PNG, HEIC)");
      setSelectedFiles([]);
      setPhotoPreviewUrls([]);
      return;
    }

    // Validate file sizes (max 5MB per file)
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(f => f.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      setPhotoError(`${oversizedFiles.length} file(s) exceed 5MB. Please reduce file size.`);
      setSelectedFiles([]);
      setPhotoPreviewUrls([]);
      return;
    }

    setPhotoError("");
    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPhotoPreviewUrls(urls);
  };

  const handlePhotoUploadDone = (jobId: string) => {
    // Validate files before completing
    if (selectedFiles.length < 1 || selectedFiles.length > 5) {
      setPhotoError("Please upload 1-5 photos before completing the job");
      return;
    }

    // In production, this would upload files to server
    // For now, just complete the job
    setJobs(jobs.map((j) => (j.id === jobId ? { ...j, status: "completed" as const } : j)));

    // Cleanup
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setUploadingPhotos(null);
    setSelectedJob(null);
    setSelectedFiles([]);
    setPhotoPreviewUrls([]);
    setPhotoError("");
  };

  const handleCancelUpload = () => {
    // Cleanup preview URLs
    photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setUploadingPhotos(null);
    setSelectedFiles([]);
    setPhotoPreviewUrls([]);
    setPhotoError("");
  };

  const handleOpenClientDrawer = (clientName: string) => {
    const client = sampleClients[clientName];
    if (client) {
      setSelectedClient(client);
      setClientDrawerOpen(true);
    }
  };

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
    }
  };

  const inProgressCount = jobs.filter((j) => j.status === "in_progress").length;
  const completedCount = jobs.filter((j) => j.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <TimeIcon className="w-4 h-4 text-brand-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{inProgressCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedCount}</p>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Job Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <button
                    onClick={() => handleOpenClientDrawer(job.clientName)}
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline text-left"
                  >
                    {job.clientName}
                  </button>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.service}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(job.status)}`}>
                  {job.status === "in_progress" ? "In Progress" : job.status === "upcoming" ? "Upcoming" : "Completed"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>{job.time}</span>
                <span>•</span>
                <span>{job.duration}</span>
              </div>
            </div>

            {/* Job Details (expandable) */}
            {selectedJob === job.id && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 space-y-3 text-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FolderIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Address:</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-6">{job.address}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 ml-6">{job.phone}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Instructions:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{job.instructions}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Payment:</span>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{job.paymentMethod}</p>
                </div>
              </div>
            )}

            {/* Photo Upload Section */}
            {uploadingPhotos === job.id && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <CameraIcon className="w-5 h-5 text-brand-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Upload Job Photos (1-5 required)</span>
                </div>

                {/* File Input */}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-brand-600 file:text-white
                    hover:file:bg-brand-700"
                />

                {/* Error Message */}
                {photoError && (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {photoError}
                  </div>
                )}

                {/* Photo Previews */}
                {photoPreviewUrls.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {selectedFiles.length} photo{selectedFiles.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {photoPreviewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border-2 border-brand-200 dark:border-brand-800">
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePhotoUploadDone(job.id)}
                    disabled={selectedFiles.length < 1 || selectedFiles.length > 5}
                    className="flex-1 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirm & Complete
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="p-4 flex gap-2">
              <button
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
              >
                {selectedJob === job.id ? "Hide Details" : "View Details"}
              </button>
              {job.status === "upcoming" && (
                <button
                  onClick={() => handleStartJob(job.id)}
                  className="flex-1 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium"
                >
                  Start Job
                </button>
              )}
              {job.status === "in_progress" && (
                <button
                  onClick={() => handleCompleteJob(job.id)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Complete Job
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No jobs scheduled for today</p>
        </div>
      )}

      {/* Client Info Drawer */}
      {selectedClient && (
        <ClientInfoDrawer
          isOpen={clientDrawerOpen}
          onClose={() => {
            setClientDrawerOpen(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
        />
      )}
    </div>
  );
};
