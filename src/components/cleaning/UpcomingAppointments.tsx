"use client";
import React, { useState } from "react";
import { TimeIcon, UserCircleIcon, ArrowRightIcon } from "@/icons";
import { JobProgressDrawer, JobProgress } from "./JobProgressDrawer";
import Badge from "@/components/ui/badge/Badge";
import { useInvoices } from "@/contexts/InvoiceContext";
import { useClients } from "@/contexts/ClientContext";
import {
  generateInvoice,
  shouldGenerateInvoiceImmediately,
  shouldAutoSendInvoice,
  sendInvoice,
  type Invoice,
  type Job,
} from "@/utils/invoiceUtils";

interface Appointment {
  id: string;
  clientId: string; // Added for invoice generation
  clientName: string;
  clientAvatar?: string;
  serviceType: string;
  time: string;
  duration: string;
  status: "scheduled" | "in_progress" | "completed";
  staffName: string;
  address: string; // ← Added for job progress tracking
}

const appointments: Appointment[] = [
  {
    id: "1",
    clientId: "1",
    clientName: "Sarah Johnson",
    serviceType: "Deep Clean",
    time: "9:00 AM",
    duration: "3 hours",
    status: "in_progress",
    staffName: "Maria G.",
    address: "123 Main St",
  },
  {
    id: "2",
    clientId: "2",
    clientName: "Michael Chen",
    serviceType: "Regular Clean",
    time: "10:30 AM",
    duration: "2 hours",
    status: "scheduled",
    staffName: "John D.",
    address: "456 Oak Ave",
  },
  {
    id: "3",
    clientId: "3",
    clientName: "Emily Davis",
    serviceType: "Move-out Clean",
    time: "2:00 PM",
    duration: "4 hours",
    status: "scheduled",
    staffName: "Team A",
    address: "789 Pine St",
  },
  {
    id: "4",
    clientId: "4",
    clientName: "Robert Wilson",
    serviceType: "Office Clean",
    time: "4:00 PM",
    duration: "2 hours",
    status: "scheduled",
    staffName: "Team B",
    address: "321 Elm Dr",
  },
];

export const UpcomingAppointments = () => {
  const { invoices, addInvoice, addPendingBatchJob } = useInvoices();
  const { getClient } = useClients();
  const [jobProgress, setJobProgress] = useState<Map<string, JobProgress>>(new Map());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenDrawer = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDrawerOpen(true);
  };

  const handleSaveProgress = (progress: JobProgress) => {
    setJobProgress(prev => new Map(prev).set(progress.appointmentId, progress));

    // Auto-generate invoice when job is marked as completed
    if (progress.status === "completed") {
      const appointment = appointments.find(apt => apt.id === progress.appointmentId);
      if (!appointment) return;

      const client = getClient(appointment.clientId);
      if (!client) {
        console.warn(`Client not found for appointment ${appointment.id}`);
        return;
      }

      // Convert actualDuration (minutes) to string format for invoice generation
      let durationString: string;
      if (progress.actualDuration) {
        // actualDuration is in minutes (number)
        const minutes = progress.actualDuration;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0 && remainingMinutes > 0) {
          durationString = `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} minutes`;
        } else if (hours > 0) {
          durationString = `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
          durationString = `${minutes} minutes`;
        }
      } else {
        // Fallback to appointment duration (already a string)
        durationString = appointment.duration;
      }

      // Convert appointment to Job format (HOISTED - used by both branches)
      const job: Job = {
        id: appointment.id,
        clientId: appointment.clientId,
        clientName: appointment.clientName,
        service: appointment.serviceType,
        duration: durationString,
        date: new Date().toISOString().split("T")[0],
        time: appointment.time,
      };

      // Check if invoice should be generated immediately based on client preferences
      if (shouldGenerateInvoiceImmediately(client)) {
        // Generate invoice immediately (per-job billing)
        const invoice = generateInvoice(job, client, invoices);
        addInvoice(invoice);

        // Auto-send if client preferences allow
        if (shouldAutoSendInvoice(client)) {
          sendInvoice(invoice, client);
        }

        console.log(`[Invoice Generated] ${invoice.invoiceNumber} for ${client.name} - $${invoice.amount}`);
        alert(
          `SUCCESS: Invoice Generated!\n\n` +
          `Invoice: ${invoice.invoiceNumber}\n` +
          `Client: ${client.name}\n` +
          `Amount: $${invoice.amount.toFixed(2)}\n` +
          `Status: ${invoice.status}\n\n` +
          (shouldAutoSendInvoice(client) ? `Auto-sent via ${client.invoicePreferences.sendVia.email ? "Email" : ""}${client.invoicePreferences.sendVia.sms ? " & SMS" : ""}` : "")
        );
      } else {
        // Queue job for batch invoicing (weekly/monthly)
        const pendingJob = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
          job,
          clientId: client.id,
          clientName: client.name,
          frequency: client.invoicePreferences.frequency as "weekly" | "monthly",
          createdAt: new Date().toISOString(),
        };

        addPendingBatchJob(pendingJob);

        console.log(`[Invoice Batched] Job ${appointment.id} queued for ${client.invoicePreferences.frequency} billing`);
        alert(
          `BATCHED: Job Completed - Queued for Batch Invoicing\n\n` +
          `Client: ${client.name}\n` +
          `Billing Frequency: ${client.invoicePreferences.frequency.replace("_", " ").toUpperCase()}\n` +
          `Service: ${job.service}\n` +
          `Duration: ${job.duration}\n\n` +
          `This job has been queued and will be included in the next ${client.invoicePreferences.frequency.replace("_", " ")} invoice batch.`
        );
      }
    }
  };

  const getProgressBadge = (appointmentId: string) => {
    const progress = jobProgress.get(appointmentId);
    if (!progress || progress.status === "scheduled") return null;

    const statusColors = {
      "en-route": "warning",
      "on-site": "info",
      completed: "success",
    };

    return (
      <Badge color={statusColors[progress.status] as "warning" | "info" | "success"}>
        {progress.status.replace("-", " ")}
      </Badge>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "scheduled":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "completed":
        return "bg-fresh-100 text-fresh-700 dark:bg-fresh-900/20 dark:text-fresh-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Today&apos;s Appointments
          </h3>
          <button className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
            View All
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => handleOpenDrawer(appointment)}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center flex-shrink-0">
                  <UserCircleIcon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {appointment.clientName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {appointment.serviceType} • {appointment.staffName}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <TimeIcon className="w-3.5 h-3.5" />
                      {appointment.time}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {appointment.duration}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getProgressBadge(appointment.id) || (
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status.replace("_", " ")}
                  </span>
                )}
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
          + Schedule New Appointment
        </button>
      </div>

      {/* Job Progress Drawer */}
      {selectedAppointment && (
        <JobProgressDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          appointment={{
            id: selectedAppointment.id,
            clientName: selectedAppointment.clientName,
            time: selectedAppointment.time,
            address: selectedAppointment.address,
            serviceType: selectedAppointment.serviceType,
          }}
          initialProgress={jobProgress.get(selectedAppointment.id)}
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
};