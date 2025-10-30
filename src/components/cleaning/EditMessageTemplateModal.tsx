"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface MessageTemplate {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  channel: "sms" | "email";
  enabled: boolean;
  preview: string;
  template?: string;
}

interface EditMessageTemplateModalProps {
  template?: MessageTemplate;
  onSave: (template: Partial<MessageTemplate>) => void;
  onClose: () => void;
}

export const EditMessageTemplateModal: React.FC<EditMessageTemplateModalProps> = ({
  template,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    trigger: template?.trigger || "Before Service",
    timing: template?.timing || "",
    channel: template?.channel || "sms" as "sms" | "email",
    preview: template?.preview || "",
    template: template?.template || "",
    enabled: template?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...template,
      ...formData,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={template ? "Edit Message Template" : "Create Message Template"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Channel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Channel
          </label>
          <select
            value={formData.channel}
            onChange={(e) => setFormData({ ...formData, channel: e.target.value as "sms" | "email" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="sms">SMS</option>
            <option value="email">Email</option>
          </select>
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trigger
          </label>
          <select
            value={formData.trigger}
            onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="Before Service">Before Service</option>
            <option value="Day of Service">Day of Service</option>
            <option value="After Service">After Service</option>
            <option value="Day Before Service">Day Before Service</option>
            <option value="Billing">Billing</option>
            <option value="Break Start">Break Start</option>
          </select>
        </div>

        {/* Timing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timing
          </label>
          <input
            type="text"
            value={formData.timing}
            onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
            placeholder="e.g., 2 days before, 8:00 AM"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Message Template */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message Text
          </label>
          <textarea
            value={formData.template || formData.preview}
            onChange={(e) => setFormData({ ...formData, template: e.target.value, preview: e.target.value })}
            rows={4}
            placeholder="Use {firstName}, {serviceDate}, {serviceTime}, etc. for dynamic fields"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Available placeholders: {"{firstName}, {lastName}, {clientName}, {serviceDate}, {serviceTime}, {arrivalStart}, {arrivalEnd}, {crewCount}"}
          </p>
        </div>

        {/* Enabled Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
          />
          <label htmlFor="enabled" className="text-sm text-gray-700 dark:text-gray-300">
            Enable this template
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-colors"
          >
            {template ? "Save Changes" : "Create Template"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
