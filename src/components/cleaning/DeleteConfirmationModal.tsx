"use client";
import React from "react";
import { CloseIcon, AlertIcon } from "@/icons";

interface DeleteConfirmationModalProps {
  title: string;
  message: string;
  itemName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  title,
  message,
  itemName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-[1002] flex items-center justify-center backdrop-blur-sm bg-black/30 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <AlertIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <CloseIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400">
            {message}
          </p>
          {itemName && (
            <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
              <p className="font-medium text-gray-900 dark:text-white">
                {itemName}
              </p>
            </div>
          )}
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              ⚠️ This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
