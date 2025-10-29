"use client";
import { useState } from "react";
import { TimeIcon, CalenderIcon, CheckCircleIcon } from "@/icons";

interface Job {
  id: string;
  client: string;
  address: string;
  time: string;
  duration: string;
  type: string;
  status: "upcoming" | "in_progress" | "completed";
}

const initialJobs: Job[] = [
  {
    id: "1",
    client: "Sarah Johnson",
    address: "123 Main St",
    time: "9:00 AM",
    duration: "3 hours",
    type: "Deep Clean",
    status: "completed",
  },
  {
    id: "2",
    client: "Michael Chen",
    address: "456 Oak Ave",
    time: "1:00 PM",
    duration: "2 hours",
    type: "Regular Clean",
    status: "in_progress",
  },
  {
    id: "3",
    client: "Emma Rodriguez",
    address: "789 Pine St",
    time: "3:30 PM",
    duration: "2.5 hours",
    type: "Move-Out Clean",
    status: "upcoming",
  },
  {
    id: "4",
    client: "David Park",
    address: "321 Elm Rd",
    time: "5:00 PM",
    duration: "1.5 hours",
    type: "Regular Clean",
    status: "upcoming",
  },
];

export const TodaySchedule = () => {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const handleStartJob = (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: "in_progress" as const } : job
    ));
  };

  const handleCompleteJob = (jobId: string) => {
    setJobs(prev => prev.map(job =>
      job.id === jobId ? { ...job, status: "completed" as const } : job
    ));
  };

  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-success-100 px-2 py-1 text-xs font-medium text-success-700 dark:bg-success-900/20 dark:text-success-400">
            <CheckCircleIcon className="h-3 w-3" />
            Completed
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-brand-600 dark:bg-brand-400"></div>
            In Progress
          </span>
        );
      case "upcoming":
        return (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h2>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`rounded-xl border p-4 transition-all ${
              job.status === "completed"
                ? "border-success-200 bg-success-50/50 dark:border-success-900 dark:bg-success-900/10"
                : job.status === "in_progress"
                ? "border-brand-200 bg-brand-50 dark:border-brand-900 dark:bg-brand-900/10"
                : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">{job.client}</div>

                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <CalenderIcon className="h-4 w-4" />
                    <span>{job.address}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <TimeIcon className="h-4 w-4" />
                      {job.time}
                    </span>
                    <span>{job.duration}</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-500">
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-3">
                {getStatusBadge(job.status)}
              </div>
            </div>

            {/* Action Buttons */}
            {job.status === "upcoming" && (
              <button
                onClick={() => handleStartJob(job.id)}
                className="mt-3 w-full rounded-lg bg-brand-600 py-2 text-sm font-medium text-white hover:bg-brand-700 active:scale-98 transition-all"
              >
                Start Job
              </button>
            )}

            {job.status === "in_progress" && (
              <button
                onClick={() => handleCompleteJob(job.id)}
                className="mt-3 w-full rounded-lg bg-success-600 py-2 text-sm font-medium text-white hover:bg-success-700 active:scale-98 transition-all"
              >
                Mark Complete
              </button>
            )}
          </div>
        ))}
      </div>

      {jobs.filter(j => j.status !== "completed").length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <CheckCircleIcon className="mx-auto h-12 w-12 text-success-500" />
          <p className="mt-2 font-medium text-gray-900 dark:text-white">All jobs completed!</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Great work today</p>
        </div>
      )}
    </div>
  );
};
