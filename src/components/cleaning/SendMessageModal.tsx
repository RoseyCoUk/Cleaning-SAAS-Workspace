"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredContact: "phone" | "email" | "sms";
}

interface SendMessageModalProps {
  client: Client;
  onSend: (data: { templateId: string; message: string; channel: "sms" | "email"; scheduledFor?: string }) => void;
  onClose: () => void;
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
  client,
  onSend,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    templateId: "",
    channel: (client.preferredContact === "phone" ? "sms" : client.preferredContact) as "sms" | "email",
    message: "",
    sendNow: true,
    scheduledFor: "",
  });

  // Mock message templates (in real app, these would come from props or context)
  const messageTemplates = [
    {
      id: "1",
      name: "Weekend Reminder",
      template: "Hi {name}, this is a reminder that your home cleaning is scheduled for {date} at {time}. Thank you!",
    },
    {
      id: "2",
      name: "Morning Arrival Notice",
      template: "Good morning {name}! Your cleaning team will arrive between 9:00 AM and 10:00 AM today. Thank you!",
    },
    {
      id: "3",
      name: "Service Complete",
      template: "Hi {name}, your cleaning service has been completed. Thank you for choosing us! We hope to see you again soon.",
    },
    {
      id: "4",
      name: "Payment Reminder",
      template: "Hi {name}, this is a reminder that your payment of ${amount} is due on {dueDate}. Please contact us if you have any questions.",
    },
    {
      id: "custom",
      name: "Custom Message",
      template: "",
    },
  ];

  const handleTemplateChange = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    setFormData(prev => ({
      ...prev,
      templateId,
      message: template?.template || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend({
      templateId: formData.templateId,
      message: formData.message,
      channel: formData.channel,
      scheduledFor: formData.sendNow ? undefined : formData.scheduledFor,
    });
  };

  const previewMessage = formData.message
    .replace("{name}", client.name)
    .replace("{date}", "this Saturday")
    .replace("{time}", "10:00 AM")
    .replace("{amount}", "250")
    .replace("{dueDate}", "Nov 5, 2024");

  return (
    <Modal isOpen={true} onClose={onClose} title="Send Message">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Info */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sending to:
          </p>
          <p className="text-base font-semibold text-gray-900 dark:text-white">
            {client.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {formData.channel === "sms" ? client.phone : client.email}
          </p>
        </div>

        {/* Channel Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Send via
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="channel"
                value="sms"
                checked={formData.channel === "sms"}
                onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value as "sms" }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                SMS {client.preferredContact === "phone" && "(Preferred)"}
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="channel"
                value="email"
                checked={formData.channel === "email"}
                onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value as "email" }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Email {client.preferredContact === "email" && "(Preferred)"}
              </span>
            </label>
          </div>
        </div>

        {/* Template Selection */}
        <div>
          <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message Template
          </label>
          <select
            id="template"
            value={formData.templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            required
          >
            <option value="">Select a template</option>
            {messageTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Use placeholders: {"{name}"}, {"{date}"}, {"{time}"}, {"{amount}"}, {"{dueDate}"}
          </p>
        </div>

        {/* Message Text */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message Text
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="Type your message or select a template above..."
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.message.length} characters
          </p>
        </div>

        {/* Message Preview */}
        {formData.message && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div className="p-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
              {previewMessage}
            </div>
          </div>
        )}

        {/* Send Timing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            When to send
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="timing"
                checked={formData.sendNow}
                onChange={() => setFormData(prev => ({ ...prev, sendNow: true }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Send now
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="timing"
                checked={!formData.sendNow}
                onChange={() => setFormData(prev => ({ ...prev, sendNow: false }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Schedule for later
              </span>
            </label>
            {!formData.sendNow && (
              <input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                className="ml-6 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required={!formData.sendNow}
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            {formData.sendNow ? "Send Now" : "Schedule Message"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
