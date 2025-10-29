"use client";
import React, { useState, useRef, useEffect } from "react";
import { CloseIcon, FileIcon, CameraIcon } from "@/icons";
import Image from "next/image";

interface ReceiptScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture?: (data: {
    vendor: string;
    amount: string;
    date: string;
    category: string;
  }) => void;
}

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({ isOpen, onClose, onCapture }) => {
  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState({
    vendor: "",
    amount: "",
    date: "",
    category: "supplies",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate OCR data extraction when image is captured
    if (capturedImage) {
      setExtractedData({
        vendor: "Office Depot",
        amount: "$156.42",
        date: new Date().toISOString().split('T')[0],
        category: "supplies",
      });
    }
  }, [capturedImage]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedData({
      vendor: "",
      amount: "",
      date: "",
      category: "supplies",
    });
  };

  const handleSave = () => {
    if (onCapture) {
      onCapture(extractedData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scan Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Interface */}
        <div className="p-6 space-y-4">
          {/* Camera/Upload Toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setMode("camera")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                mode === "camera"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Camera
            </button>
            <button
              onClick={() => setMode("upload")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                mode === "upload"
                  ? "bg-white dark:bg-gray-700 shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Upload
            </button>
          </div>

          {/* Camera/Upload View */}
          {!capturedImage ? (
            <div className="relative aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
              {mode === "camera" ? (
                <div className="text-center">
                  <CameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-white mb-4">Camera access needed</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                  >
                    Take Photo
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <FileIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-white mb-4">Select receipt image</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                  >
                    Choose File
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture={mode === "camera" ? "environment" : undefined}
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
              <Image src={capturedImage} alt="Receipt" fill className="object-contain" />
            </div>
          )}

          {/* OCR Results */}
          {capturedImage && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Extracted Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vendor:</span>
                  <input
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={extractedData.vendor}
                    onChange={(e) => setExtractedData({ ...extractedData, vendor: e.target.value })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                  <input
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={extractedData.amount}
                    onChange={(e) => setExtractedData({ ...extractedData, amount: e.target.value })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Date:</span>
                  <input
                    type="date"
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={extractedData.date}
                    onChange={(e) => setExtractedData({ ...extractedData, date: e.target.value })}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                  <select
                    className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={extractedData.category}
                    onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                  >
                    <option value="supplies">Supplies</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Vehicle</option>
                    <option value="marketing">Marketing</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            {capturedImage && (
              <button
                onClick={handleRetake}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Retake
              </button>
            )}
            <button
              onClick={capturedImage ? handleSave : onClose}
              className={`flex-1 py-2 rounded-lg ${
                capturedImage
                  ? "bg-brand-600 text-white hover:bg-brand-700"
                  : "border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {capturedImage ? "Save Receipt" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};