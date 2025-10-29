"use client";
import React, { useState } from "react";
import { CloseIcon, ArrowUpIcon, FolderIcon, PieChartIcon } from "@/icons";

interface BankImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BankImportModal: React.FC<BankImportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const recentImports = [
    { name: "Chase_Statement_Oct2024.csv", date: "2 days ago" },
    { name: "BofA_Export_Sept2024.qfx", date: "1 week ago" },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Import Bank Statement</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Import Interface */}
        <div className="p-6">
          {/* Upload Area */}
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-brand-400 bg-brand-50 dark:bg-brand-900/10"
                : "border-gray-300 dark:border-gray-700 hover:border-brand-400"
            }`}
          >
            <div className="mb-4 flex justify-center">
              <ArrowUpIcon className="w-12 h-12 text-brand-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {selectedFile ? selectedFile.name : "Drop your bank statement here"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
              Supports CSV, QFX, OFX formats
            </p>
            <label className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 cursor-pointer inline-block">
              Choose File
              <input
                type="file"
                className="hidden"
                accept=".csv,.qfx,.ofx"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {/* Alternative Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or connect with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2">
                <FolderIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">Plaid</span>
              </button>
              <button className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2">
                <PieChartIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span className="font-medium">QuickBooks</span>
              </button>
            </div>
          </div>

          {/* Import History */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Imports</p>
            <div className="space-y-2">
              {recentImports.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{file.name}</span>
                  <span className="text-gray-500 dark:text-gray-500">{file.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-white dark:hover:bg-gray-700">
              Import Rules
            </button>
            <button
              disabled={!selectedFile}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};