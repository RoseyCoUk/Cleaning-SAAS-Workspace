// Invoice generation and management utilities

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "draft";
  issueDate: string;
  dueDate: string;
  services: string[];
  jobId?: string; // Link to the job that generated this invoice
  notes?: string; // Internal notes (not sent to client)
}

export interface Job {
  id: string;
  clientName: string;
  clientId?: string;
  service: string;
  duration: string; // e.g., "2 hours"
  date: string;
  time: string;
}

export interface Client {
  id: string;
  name: string;
  hourlyRate?: number;
  invoicePreferences: {
    frequency: "per_job" | "weekly" | "monthly";
    autoSend: boolean;
    sendVia: {
      email: boolean;
      sms: boolean;
    };
  };
}

/**
 * Generate a unique invoice number in format: INV-YYYY-NNN
 * Uses the highest existing sequence number + 1 to avoid collisions
 */
export const generateInvoiceNumber = (existingInvoices: Invoice[]): string => {
  const year = new Date().getFullYear();
  const yearInvoices = existingInvoices.filter(
    (inv) => inv.invoiceNumber.startsWith(`INV-${year}`)
  );

  // Find the highest sequence number
  let maxSequence = 0;
  yearInvoices.forEach((inv) => {
    const match = inv.invoiceNumber.match(/INV-\d{4}-(\d+)/);
    if (match) {
      const sequence = parseInt(match[1], 10);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }
  });

  const nextSequence = maxSequence + 1;
  return `INV-${year}-${String(nextSequence).padStart(3, "0")}`;
};

/**
 * Parse duration string to hours (e.g., "2 hours" → 2, "30 minutes" → 0.5, "1 hour 30 minutes" → 1.5)
 */
export const parseDuration = (duration: string): number => {
  const lowerDuration = duration.toLowerCase();
  let totalHours = 0;

  // Match hours
  const hoursMatch = lowerDuration.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/);
  if (hoursMatch) {
    totalHours += parseFloat(hoursMatch[1]);
  }

  // Match minutes
  const minutesMatch = lowerDuration.match(/(\d+)\s*(?:minute|min)/);
  if (minutesMatch) {
    totalHours += parseFloat(minutesMatch[1]) / 60;
  }

  // If we found hours or minutes, return the total
  if (totalHours > 0) {
    return totalHours;
  }

  // Default fallback: try to parse as number
  const numMatch = lowerDuration.match(/(\d+(?:\.\d+)?)/);
  if (numMatch) {
    return parseFloat(numMatch[1]);
  }

  // Final fallback
  return 2; // Default to 2 hours
};

/**
 * Calculate invoice amount based on job duration and client hourly rate
 */
export const calculateInvoiceAmount = (job: Job, client: Client): number => {
  const hours = parseDuration(job.duration);
  const rate = client.hourlyRate ?? 50; // Default $50/hr if undefined
  return Math.round(hours * rate * 100) / 100; // Round to 2 decimal places
};

/**
 * Format date as "MMM DD, YYYY" (e.g., "Dec 28, 2024")
 */
export const formatDate = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Calculate due date based on issue date (default: Net 30 days)
 */
export const calculateDueDate = (issueDate: Date, netDays: number = 30): string => {
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + netDays);
  return formatDate(dueDate);
};

/**
 * Generate an invoice for a completed job
 */
export const generateInvoice = (
  job: Job,
  client: Client,
  existingInvoices: Invoice[]
): Invoice => {
  const invoiceNumber = generateInvoiceNumber(existingInvoices);
  const amount = calculateInvoiceAmount(job, client);
  const issueDate = formatDate(new Date());
  const dueDate = calculateDueDate(new Date());

  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 11),
    invoiceNumber,
    clientId: client.id,
    clientName: client.name,
    amount,
    status: "pending",
    issueDate,
    dueDate,
    services: [job.service],
    jobId: job.id,
  };
};

/**
 * Determine if invoice should be generated immediately based on client preferences
 */
export const shouldGenerateInvoiceImmediately = (client: Client): boolean => {
  return client.invoicePreferences.frequency === "per_job";
};

/**
 * Determine if invoice should be auto-sent based on client preferences
 */
export const shouldAutoSendInvoice = (client: Client): boolean => {
  return (
    client.invoicePreferences.autoSend &&
    (client.invoicePreferences.sendVia.email || client.invoicePreferences.sendVia.sms)
  );
};

/**
 * Mock function to send invoice (in production, this would call email/SMS API)
 */
export const sendInvoice = (invoice: Invoice, client: Client): void => {
  const methods: string[] = [];

  if (client.invoicePreferences.sendVia.email) {
    methods.push("Email");
  }
  if (client.invoicePreferences.sendVia.sms) {
    methods.push("SMS");
  }

  console.log(
    `[Invoice Auto-Send] Invoice ${invoice.invoiceNumber} sent to ${client.name} via ${methods.join(" and ")}`
  );

  // In production: Call email/SMS API here
  // await emailService.send({ to: client.email, invoice });
  // await smsService.send({ to: client.phone, invoice });
};
