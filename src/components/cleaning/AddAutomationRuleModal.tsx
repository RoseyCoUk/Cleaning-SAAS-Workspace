"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  clientCount: number;
  trigger?: string;
  templateId?: string;
  timing?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  trigger: string;
  preview?: string;
}

interface AddAutomationRuleModalProps {
  rule?: AutomationRule;
  onSave: (rule: Partial<AutomationRule>) => void;
  onClose: () => void;
  availableTemplates?: MessageTemplate[];
}

export const AddAutomationRuleModal: React.FC<AddAutomationRuleModalProps> = ({
  rule,
  onSave,
  onClose,
  availableTemplates,
}) => {
  // Default templates if none provided
  const templates = availableTemplates || [
    { id: "1", name: "Weekend Reminder", trigger: "Before Service", preview: "Hi {clientName}, this is a reminder that your home cleaning is scheduled for {serviceDate}..." },
    { id: "2", name: "Morning Arrival Notice", trigger: "Day of Service", preview: "Good morning! Your cleaning team will arrive between {estimatedStart} - {estimatedEnd} today." },
    { id: "3", name: "Service Complete", trigger: "After Service", preview: "Your home has been cleaned! Please let us know if you have any feedback." },
    { id: "4", name: "Monthly Invoice", trigger: "Billing", preview: "Your invoice for {month} is ready. Total amount due: {amount}." },
    { id: "5", name: "Arrival Confirmation", trigger: "Day Before Service", preview: "Hi {clientName}, your cleaning is scheduled for tomorrow..." },
    { id: "6", name: "Lunch Delay Notice", trigger: "Break Start", preview: "Hi {clientName}, our team is taking a lunch break..." },
  ];

  const [formData, setFormData] = useState({
    name: rule?.name || "",
    description: rule?.description || "",
    trigger: rule?.trigger || "Before Service",
    timing: rule?.timing || "2 days before",
    templateId: rule?.templateId || "",
    status: rule?.status || "active" as "active" | "paused",
  });

  // Find selected template for preview
  const selectedTemplate = templates.find(t => t.id === formData.templateId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...rule,
      ...formData,
      clientCount: rule?.clientCount || 0,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={rule ? "Edit Automation Rule" : "Create Automation Rule"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rule Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rule Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., 4-Week Schedule Clients"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Send reminder 48 hours before service"
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Trigger */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trigger Event
          </label>
          <select
            value={formData.trigger}
            onChange={(e) => setFormData({ ...formData, trigger: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="Before Service">Before Service</option>
            <option value="Day of Service">Day of Service</option>
            <option value="After Service">After Service</option>
            <option value="New Client">New Client</option>
            <option value="Inactive Client">Inactive Client</option>
            <option value="Job Complete">Job Complete</option>
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
            placeholder="e.g., 48 hours before, immediately, after 60 days"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message Template
          </label>
          <select
            value={formData.templateId}
            onChange={(e) => setFormData({ ...formData, templateId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.trigger})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            This will determine which message is sent when the rule triggers
          </p>

          {/* Template Preview */}
          {selectedTemplate && selectedTemplate.preview && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message Preview:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {selectedTemplate.preview}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Trigger: {selectedTemplate.trigger}
              </p>
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "paused" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>
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
            {rule ? "Save Changes" : "Create Rule"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
