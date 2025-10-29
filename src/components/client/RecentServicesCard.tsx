"use client";
import { useState } from "react";
import { ServiceRatingModal } from "./ServiceRatingModal";
import { ReportIssueModal } from "./ReportIssueModal";

const recentServices = [
  { date: "Oct 18, 2024", type: "Regular Clean", rating: 5, status: "completed" },
  { date: "Oct 4, 2024", type: "Regular Clean", rating: 5, status: "completed" },
  { date: "Sep 20, 2024", type: "Deep Clean", rating: 5, status: "completed" },
];

export const RecentServicesCard = () => {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof recentServices[0] | null>(null);

  const handleRateClick = (service: typeof recentServices[0]) => {
    setSelectedService(service);
    setRatingModalOpen(true);
  };

  const handleReportClick = (service: typeof recentServices[0]) => {
    setSelectedService(service);
    setReportModalOpen(true);
  };

  const handleRatingSubmit = (rating: number, comment: string) => {
    console.log("Rating submitted:", { rating, comment });
    // In production, send to API
  };

  const handleReportSubmit = (issueType: string, description: string) => {
    console.log("Issue reported:", { issueType, description });
    // In production, send to API
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white sm:mb-4 sm:text-lg">
          Recent Services
        </h3>
        <div className="space-y-4">
          {recentServices.map((service, idx) => (
            <div
              key={idx}
              className="border-b border-gray-100 pb-3 last:border-0 dark:border-gray-800"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900 dark:text-white sm:text-base">
                    {service.date}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                    {service.type}
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-0.5 text-sm text-yellow-500 sm:gap-1 sm:text-base">
                  {"★".repeat(service.rating)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleRateClick(service)}
                  className="flex-1 px-3 py-1.5 text-xs sm:text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                >
                  Rate Service
                </button>
                <button
                  onClick={() => handleReportClick(service)}
                  className="flex-1 px-3 py-1.5 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Report Issue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedService && (
        <>
          <ServiceRatingModal
            isOpen={ratingModalOpen}
            onClose={() => {
              setRatingModalOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
            onSubmit={handleRatingSubmit}
          />
          <ReportIssueModal
            isOpen={reportModalOpen}
            onClose={() => {
              setReportModalOpen(false);
              setSelectedService(null);
            }}
            service={selectedService}
            onSubmit={handleReportSubmit}
          />
        </>
      )}
    </>
  );
};
