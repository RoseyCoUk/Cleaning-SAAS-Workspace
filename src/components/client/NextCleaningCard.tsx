"use client";
import { useState } from "react";
import { CalenderIcon } from "@/icons";
import { RescheduleRequestModal } from "./RescheduleRequestModal";

const nextCleaning = {
  date: "Friday, Nov 1",
  time: "9:00 AM - 12:00 PM",
  type: "Regular Clean",
  team: "Team A",
};

export const NextCleaningCard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleRescheduleSubmit = (data: { newDate: string; newTime: string; reason: string }) => {
    console.log("Reschedule request submitted:", data);
    // In production, this would send to API
  };

  return (
    <>
    <div className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-4 dark:border-brand-900 dark:from-brand-950 dark:to-gray-900 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="text-xs font-medium text-brand-600 dark:text-brand-400 sm:text-sm">
            Next Cleaning
          </div>
          <div className="mt-2 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            {nextCleaning.date}
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            {nextCleaning.time}
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-500 sm:mt-3 sm:gap-3 sm:text-sm">
            <span>{nextCleaning.type}</span>
            <span>•</span>
            <span>{nextCleaning.team}</span>
          </div>
        </div>

        <CalenderIcon className="h-10 w-10 flex-shrink-0 text-brand-600 opacity-50 dark:text-brand-400 sm:h-12 sm:w-12" />
      </div>

      <button
        onClick={() => setModalOpen(true)}
        className="mt-4 w-full rounded-lg bg-brand-600 py-2 text-sm text-white hover:bg-brand-700 active:scale-98 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-base"
      >
        Request Reschedule
      </button>
    </div>

    <RescheduleRequestModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      currentBooking={nextCleaning}
      onSubmit={handleRescheduleSubmit}
    />
    </>
  );
};
