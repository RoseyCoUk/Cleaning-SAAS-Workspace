"use client";
import React, { useState } from "react";
import { CheckCircleIcon, CloseLineIcon, TimeIcon, AlertIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";

interface PendingMessage {
  id: string;
  clientName: string;
  clientPhone: string;
  templateName: string;
  scheduledFor: string; // ISO string
  message: string;
  requiresETA: boolean;
  etaConfirmed: boolean;
  status: "pending" | "approved" | "rejected" | "sent";
}

export const PendingMessagesQueue = () => {
  const [messages, setMessages] = useState<PendingMessage[]>([
    {
      id: "1",
      clientName: "Sarah Johnson",
      clientPhone: "(555) 123-4567",
      templateName: "Morning Arrival Notice",
      scheduledFor: "2024-10-27T07:00:00",
      message: "Good morning Sarah! Your cleaning team will arrive between 9:00 AM and 10:00 AM today. 4 team members will be servicing your home. Thank you!",
      requiresETA: true,
      etaConfirmed: false,
      status: "pending",
    },
    {
      id: "2",
      clientName: "Michael Chen",
      clientPhone: "(555) 234-5678",
      templateName: "Arrival Confirmation",
      scheduledFor: "2024-10-26T19:00:00",
      message: "Hi Michael, your cleaning is scheduled for tomorrow between 1:00 PM and 2:00 PM. A team of 4 will be arriving. Reply CONFIRM to verify. Thank you!",
      requiresETA: true,
      etaConfirmed: true,
      status: "pending",
    },
    {
      id: "3",
      clientName: "Emily Davis",
      clientPhone: "(555) 345-6789",
      templateName: "Lunch Delay Notice",
      scheduledFor: "2024-10-27T12:30:00",
      message: "Hi Emily, our team is taking a lunch break. We'll be arriving at your location in approximately 45 minutes. Thank you for your patience!",
      requiresETA: false,
      etaConfirmed: false,
      status: "pending",
    },
  ]);

  const handleApprove = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: "approved" as const }
        : msg
    ));
  };

  const handleReject = (messageId: string) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, status: "rejected" as const }
        : msg
    ));
  };

  const pendingMessages = messages.filter(m => m.status === "pending");
  const blockedMessages = pendingMessages.filter(m => m.requiresETA && !m.etaConfirmed);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Pending Messages
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {pendingMessages.length} message{pendingMessages.length !== 1 ? 's' : ''} waiting for approval
            </p>
          </div>

          {blockedMessages.length > 0 && (
            <Badge color="error">
              {blockedMessages.length} Blocked (No ETA)
            </Badge>
          )}
        </div>
      </div>

      {pendingMessages.length === 0 ? (
        <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
          <CheckCircleIcon className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
          <p className="font-medium">No pending messages</p>
          <p className="text-sm mt-1">All messages have been reviewed</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {pendingMessages.map(message => {
            const isBlocked = message.requiresETA && !message.etaConfirmed;

            return (
              <div
                key={message.id}
                className={`px-6 py-4 ${isBlocked ? 'bg-red-50 dark:bg-red-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-gray-800 dark:text-white">
                        {message.clientName}
                      </p>
                      <Badge color={isBlocked ? "error" : "warning"}>
                        {message.templateName}
                      </Badge>
                      {isBlocked && (
                        <Badge color="error">
                          <AlertIcon className="w-3 h-3 inline mr-1" />
                          No ETA Confirmation
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <TimeIcon className="h-4 w-4" />
                        <span>Scheduled: {new Date(message.scheduledFor).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">To:</span> {message.clientPhone}
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-sm text-gray-700 dark:text-gray-300">
                      {message.message}
                    </div>

                    {isBlocked && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                        <AlertIcon className="w-5 h-5 flex-shrink-0" />
                        <span>This message is blocked until the manager confirms the arrival time in the ETA Confirmation modal.</span>
                      </div>
                    )}
                  </div>

                  {!isBlocked && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleApprove(message.id)}
                        className="px-4 py-2 bg-success-500 text-white rounded-lg text-sm hover:bg-success-600 transition-colors flex items-center gap-1"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(message.id)}
                        className="px-4 py-2 bg-error-500 text-white rounded-lg text-sm hover:bg-error-600 transition-colors flex items-center gap-1"
                      >
                        <CloseLineIcon className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
