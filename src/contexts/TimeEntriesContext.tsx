"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface StaffTimeEntry {
  id: string;
  name: string;
  clockIn?: string;
  clockOut?: string;
  totalHours?: number;
  paidHours?: number;
  lunchDeduction: number;
  status: "clocked_in" | "clocked_out" | "not_clocked";
  approvalStatus: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  managerNotes?: string;
}

interface TimeEntriesContextType {
  timeEntries: StaffTimeEntry[];
  setTimeEntries: React.Dispatch<React.SetStateAction<StaffTimeEntry[]>>;
  updateEntry: (id: string, updates: Partial<StaffTimeEntry>) => void;
  approveEntry: (id: string, approvedBy: string) => void;
  rejectEntry: (id: string, reason: string) => void;
  editEntryTimes: (id: string, clockIn: string, clockOut: string) => void;
}

const TimeEntriesContext = createContext<TimeEntriesContextType | undefined>(undefined);

export const useTimeEntries = () => {
  const context = useContext(TimeEntriesContext);
  if (!context) {
    throw new Error("useTimeEntries must be used within TimeEntriesProvider");
  }
  return context;
};

interface TimeEntriesProviderProps {
  children: ReactNode;
}

export const TimeEntriesProvider: React.FC<TimeEntriesProviderProps> = ({ children }) => {
  const [timeEntries, setTimeEntries] = useState<StaffTimeEntry[]>([
    {
      id: "1",
      name: "Maria Garcia",
      clockIn: "08:00",
      clockOut: "16:30",
      totalHours: 8.5,
      lunchDeduction: 0.5,
      paidHours: 8.0,
      status: "clocked_out",
      approvalStatus: "approved",
      approvedBy: "Manager",
      approvedAt: "2025-10-27T16:35:00Z"
    },
    {
      id: "2",
      name: "John Davis",
      clockIn: "08:30",
      clockOut: "",
      lunchDeduction: 0.5,
      status: "clocked_in",
      approvalStatus: "pending"
    },
    {
      id: "3",
      name: "Anna Smith",
      clockIn: "07:45",
      clockOut: "15:45",
      totalHours: 8,
      lunchDeduction: 0.5,
      paidHours: 7.5,
      status: "clocked_out",
      approvalStatus: "pending"
    },
    {
      id: "4",
      name: "Mike Wilson",
      clockIn: "",
      clockOut: "",
      lunchDeduction: 0.5,
      status: "not_clocked",
      approvalStatus: "pending"
    },
  ]);

  const updateEntry = (id: string, updates: Partial<StaffTimeEntry>) => {
    setTimeEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const approveEntry = (id: string, approvedBy: string) => {
    setTimeEntries(prev => prev.map(entry =>
      entry.id === id
        ? {
            ...entry,
            approvalStatus: "approved" as const,
            approvedBy,
            approvedAt: new Date().toISOString(),
          }
        : entry
    ));
  };

  const rejectEntry = (id: string, reason: string) => {
    setTimeEntries(prev => prev.map(entry =>
      entry.id === id
        ? {
            ...entry,
            approvalStatus: "rejected" as const,
            managerNotes: reason,
          }
        : entry
    ));
  };

  const editEntryTimes = (id: string, clockIn: string, clockOut: string) => {
    setTimeEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        // Recalculate hours
        const [inHour, inMin] = clockIn.split(':').map(Number);
        const [outHour, outMin] = clockOut.split(':').map(Number);
        const totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
        const paidHours = Math.max(0, totalHours - 0.5);

        return {
          ...entry,
          clockIn,
          clockOut,
          totalHours,
          paidHours,
          managerNotes: entry.managerNotes
            ? `${entry.managerNotes}; Times adjusted by manager`
            : "Times adjusted by manager",
        };
      }
      return entry;
    }));
  };

  const value = {
    timeEntries,
    setTimeEntries,
    updateEntry,
    approveEntry,
    rejectEntry,
    editEntryTimes,
  };

  return (
    <TimeEntriesContext.Provider value={value}>
      {children}
    </TimeEntriesContext.Provider>
  );
};
