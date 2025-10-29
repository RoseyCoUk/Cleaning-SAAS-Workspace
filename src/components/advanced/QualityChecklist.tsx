"use client";
import React, { useState, useCallback, useRef } from "react";
import {
  CheckCircleIcon,
  CheckLineIcon,
  CloseIcon,
  PlusIcon,
  AlertIcon,
  InfoIcon,
  TrashBinIcon,
  PencilIcon,
  ArrowRightIcon,
  UserIcon,
  FolderIcon,
  CameraIcon,
} from "@/icons";
import { cn } from "@/lib/utils/cn";

// Types and interfaces
export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: "low" | "medium" | "high" | "critical";
  required: boolean;
  completed: boolean;
  completedBy?: string;
  completedAt?: Date;
  notes?: string;
  photos?: string[];
  issues?: string[];
  skipped?: boolean;
  skipReason?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
  required: boolean;
  order: number;
}

export interface QualityChecklistData {
  id: string;
  title: string;
  description?: string;
  sections: ChecklistSection[];
  assignedTo?: string;
  location?: string;
  startedAt?: Date;
  completedAt?: Date;
  status: "pending" | "in_progress" | "completed" | "failed" | "partially_completed";
  totalItems: number;
  completedItems: number;
  criticalIssues: number;
  score?: number; // percentage
}

export interface QualityChecklistProps {
  checklist: QualityChecklistData;
  allowPhotoUpload?: boolean;
  allowNotes?: boolean;
  allowSkipping?: boolean;
  readOnly?: boolean;
  showProgress?: boolean;
  showStats?: boolean;
  compact?: boolean;
  autoSave?: boolean;
  className?: string;
  onItemUpdate?: (item: ChecklistItem) => void;
  onSectionComplete?: (section: ChecklistSection) => void;
  onChecklistComplete?: (checklist: QualityChecklistData) => void;
  onPhotoUpload?: (itemId: string, files: FileList) => Promise<string[]>;
  onNoteAdd?: (itemId: string, note: string) => void;
  onIssueReport?: (itemId: string, issue: string) => void;
}


/**
 * Cleaning Quality Checklist Component
 * Features: interactive checklist items, progress tracking, photo attachment, comments/notes section
 */
export const QualityChecklist: React.FC<QualityChecklistProps> = ({
  checklist,
  allowPhotoUpload = true,
  allowNotes = true,
  allowSkipping = false,
  readOnly = false,
  showProgress = true,
  showStats = true,
  compact = false,
  autoSave = true,
  className,
  onItemUpdate,
  onSectionComplete,
  onChecklistComplete,
  onPhotoUpload,
  onNoteAdd,
  onIssueReport,
}) => {
  // State management
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [uploadingPhotos, setUploadingPhotos] = useState<Set<string>>(new Set());
  const [reportingIssue, setReportingIssue] = useState<string | null>(null);
  const [issueText, setIssueText] = useState("");
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Helper functions
  const getProgressPercentage = useCallback(() => {
    if (checklist.totalItems === 0) return 0;
    return Math.round((checklist.completedItems / checklist.totalItems) * 100);
  }, [checklist.completedItems, checklist.totalItems]);

  const getPriorityColor = (priority: ChecklistItem["priority"]) => {
    switch (priority) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusColor = () => {
    switch (checklist.status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      case "in_progress":
        return "text-blue-600 dark:text-blue-400";
      case "partially_completed":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Event handlers
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleItemCheck = (item: ChecklistItem) => {
    if (readOnly) return;

    const updatedItem: ChecklistItem = {
      ...item,
      completed: !item.completed,
      completedAt: !item.completed ? new Date() : undefined,
      skipped: false,
      skipReason: undefined,
    };

    onItemUpdate?.(updatedItem);
  };

  const handleItemSkip = (item: ChecklistItem, reason: string) => {
    if (readOnly || !allowSkipping) return;

    const updatedItem: ChecklistItem = {
      ...item,
      skipped: true,
      skipReason: reason,
      completed: false,
      completedAt: undefined,
    };

    onItemUpdate?.(updatedItem);
  };

  const handlePhotoUpload = async (itemId: string, files: FileList | null) => {
    if (!files || !onPhotoUpload || readOnly) return;

    setUploadingPhotos(prev => new Set(prev).add(itemId));

    try {
      const photoUrls = await onPhotoUpload(itemId, files);
      // Update item with new photos would be handled by parent component
    } catch (error) {
      console.error("Photo upload failed:", error);
    } finally {
      setUploadingPhotos(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleNoteSubmit = (itemId: string) => {
    if (!noteText.trim()) return;

    onNoteAdd?.(itemId, noteText.trim());
    setNoteText("");
    setEditingNotes(null);
  };

  const handleIssueSubmit = (itemId: string) => {
    if (!issueText.trim()) return;

    onIssueReport?.(itemId, issueText.trim());
    setIssueText("");
    setReportingIssue(null);
  };

  return (
    <div className={cn(
      "bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {checklist.title}
            </h2>
            {checklist.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {checklist.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm">
              <span className={cn("font-medium", getStatusColor())}>
                {checklist.status.replace("_", " ").toUpperCase()}
              </span>
              {checklist.location && (
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <FolderIcon className="w-4 h-4" /> {checklist.location}
                </span>
              )}
              {checklist.assignedTo && (
                <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <UserIcon className="w-4 h-4" /> {checklist.assignedTo}
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          {showStats && (
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getProgressPercentage()}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Complete
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {checklist.completedItems}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  of {checklist.totalItems}
                </div>
              </div>
              {checklist.criticalIssues > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {checklist.criticalIssues}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Issues
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Overall Progress</span>
              <span>{checklist.completedItems} / {checklist.totalItems} items</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="p-6 space-y-6">
        {checklist.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => {
            const sectionProgress = section.items.length > 0
              ? (section.items.filter(item => item.completed).length / section.items.length) * 100
              : 0;

            return (
              <div
                key={section.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ArrowRightIcon
                        className={cn(
                          "w-4 h-4 text-gray-500 transition-transform",
                          expandedSections.has(section.id) && "rotate-90"
                        )}
                      />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {section.title}
                        {section.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {section.items.filter(item => item.completed).length} / {section.items.length}
                      </span>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-brand-600 h-2 rounded-full"
                          style={{ width: `${sectionProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  {section.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-7">
                      {section.description}
                    </p>
                  )}
                </button>

                {/* Section Items */}
                {expandedSections.has(section.id) && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {section.items.map((item) => (
                      <div key={item.id} className="p-4">
                        {/* Item Header */}
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => handleItemCheck(item)}
                            disabled={readOnly}
                            className={cn(
                              "mt-1 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors",
                              item.completed
                                ? "bg-green-600 border-green-600 text-white"
                                : item.skipped
                                ? "bg-yellow-500 border-yellow-500 text-white"
                                : "border-gray-300 dark:border-gray-600 hover:border-brand-500",
                              readOnly && "cursor-not-allowed opacity-50"
                            )}
                          >
                            {item.completed && (
                              <CheckLineIcon className="w-3 h-3" />
                            )}
                            {item.skipped && (
                              <span className="text-xs">S</span>
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className={cn(
                                  "text-sm font-medium",
                                  item.completed
                                    ? "text-gray-500 dark:text-gray-400 line-through"
                                    : "text-gray-900 dark:text-white"
                                )}>
                                  {item.title}
                                  {item.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </h4>
                                {item.description && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2 ml-4">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  getPriorityColor(item.priority)
                                )}>
                                  {item.priority}
                                </span>

                                {!compact && (
                                  <button
                                    onClick={() => toggleItem(item.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded"
                                  >
                                    <ArrowRightIcon
                                      className={cn(
                                        "w-4 h-4 transition-transform",
                                        expandedItems.has(item.id) && "rotate-90"
                                      )}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Item Details */}
                            {(!compact || expandedItems.has(item.id)) && (
                              <div className="mt-3 space-y-3">
                                {/* Photos */}
                                {item.photos && item.photos.length > 0 && (
                                  <div>
                                    <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Photos ({item.photos.length})
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {item.photos.map((photo, index) => (
                                        <img
                                          key={index}
                                          src={photo}
                                          alt={`${item.title} photo ${index + 1}`}
                                          className="w-16 h-16 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Notes */}
                                {item.notes && (
                                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <h5 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
                                      Notes
                                    </h5>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                      {item.notes}
                                    </p>
                                  </div>
                                )}

                                {/* Issues */}
                                {item.issues && item.issues.length > 0 && (
                                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <h5 className="text-xs font-medium text-red-700 dark:text-red-300 mb-2">
                                      Issues Reported
                                    </h5>
                                    <ul className="space-y-1">
                                      {item.issues.map((issue, index) => (
                                        <li key={index} className="text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                                          <AlertIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                          {issue}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* Skip Reason */}
                                {item.skipped && item.skipReason && (
                                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <h5 className="text-xs font-medium text-yellow-700 dark:text-yellow-300 mb-1">
                                      Skipped Reason
                                    </h5>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                      {item.skipReason}
                                    </p>
                                  </div>
                                )}

                                {/* Actions */}
                                {!readOnly && (
                                  <div className="flex flex-wrap gap-2">
                                    {/* Photo Upload */}
                                    {allowPhotoUpload && (
                                      <>
                                        <input
                                          ref={(el) => { fileInputRefs.current[item.id] = el; }}
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          onChange={(e) => handlePhotoUpload(item.id, e.target.files)}
                                          className="hidden"
                                        />
                                        <button
                                          onClick={() => fileInputRefs.current[item.id]?.click()}
                                          disabled={uploadingPhotos.has(item.id)}
                                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"
                                        >
                                          <CameraIcon className="w-3 h-3" />
                                          {uploadingPhotos.has(item.id) ? "Uploading..." : "Add Photo"}
                                        </button>
                                      </>
                                    )}

                                    {/* Add Note */}
                                    {allowNotes && (
                                      <button
                                        onClick={() => {
                                          setEditingNotes(item.id);
                                          setNoteText(item.notes || "");
                                        }}
                                        className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/30 flex items-center gap-1"
                                      >
                                        <PencilIcon className="w-3 h-3" />
                                        {item.notes ? "Edit Note" : "Add Note"}
                                      </button>
                                    )}

                                    {/* Report Issue */}
                                    <button
                                      onClick={() => setReportingIssue(item.id)}
                                      className="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-xs hover:bg-red-200 dark:hover:bg-red-900/30 flex items-center gap-1"
                                    >
                                      <AlertIcon className="w-3 h-3" />
                                      Report Issue
                                    </button>

                                    {/* Skip Item */}
                                    {allowSkipping && !item.completed && !item.skipped && (
                                      <button
                                        onClick={() => {
                                          const reason = prompt("Reason for skipping this item:");
                                          if (reason) handleItemSkip(item, reason);
                                        }}
                                        className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded text-xs hover:bg-yellow-200 dark:hover:bg-yellow-900/30"
                                      >
                                        Skip Item
                                      </button>
                                    )}
                                  </div>
                                )}

                                {/* Note Editor */}
                                {editingNotes === item.id && (
                                  <div className="mt-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
                                    <textarea
                                      value={noteText}
                                      onChange={(e) => setNoteText(e.target.value)}
                                      placeholder="Add your notes..."
                                      rows={3}
                                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        onClick={() => handleNoteSubmit(item.id)}
                                        className="px-3 py-1 bg-brand-600 text-white rounded text-sm hover:bg-brand-700"
                                      >
                                        Save Note
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingNotes(null);
                                          setNoteText("");
                                        }}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}

                                {/* Issue Reporter */}
                                {reportingIssue === item.id && (
                                  <div className="mt-3 p-3 border border-red-300 dark:border-red-600 rounded-lg">
                                    <textarea
                                      value={issueText}
                                      onChange={(e) => setIssueText(e.target.value)}
                                      placeholder="Describe the issue..."
                                      rows={3}
                                      className="w-full p-2 border border-red-300 dark:border-red-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                                    />
                                    <div className="flex gap-2 mt-2">
                                      <button
                                        onClick={() => handleIssueSubmit(item.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                      >
                                        Report Issue
                                      </button>
                                      <button
                                        onClick={() => {
                                          setReportingIssue(null);
                                          setIssueText("");
                                        }}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Footer */}
      {!readOnly && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {autoSave ? "Changes saved automatically" : "Remember to save your changes"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => onChecklistComplete?.(checklist)}
              disabled={checklist.completedItems < checklist.totalItems}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                checklist.completedItems === checklist.totalItems
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              )}
            >
              Complete Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Example usage:
// const sampleChecklist: QualityChecklistData = {
//   id: "checklist-1",
//   title: "Post-Cleaning Quality Check",
//   description: "Comprehensive quality inspection for residential deep cleaning service",
//   sections: [
//     {
//       id: "section-1",
//       title: "Kitchen",
//       items: [
//         {
//           id: "item-1",
//           title: "Countertops cleaned and sanitized",
//           category: "kitchen",
//           priority: "high",
//           required: true,
//           completed: false
//         }
//       ],
//       required: true,
//       order: 1
//     }
//   ],
//   status: "in_progress",
//   totalItems: 25,
//   completedItems: 12,
//   criticalIssues: 0
// };
//
// <QualityChecklist
//   checklist={sampleChecklist}
//   allowPhotoUpload={true}
//   allowNotes={true}
//   onItemUpdate={(item) => console.log("Item updated:", item)}
//   onChecklistComplete={(checklist) => console.log("Checklist completed:", checklist)}
// />