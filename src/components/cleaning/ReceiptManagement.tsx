"use client";
import React, { useState, useRef, useEffect } from "react";
import { CheckCircleIcon, CloseIcon, ArrowUpIcon } from "@/icons";

interface Receipt {
  id: string;
  receiptNumber: string;
  vendor: string;
  amount: number;
  category: "supplies" | "equipment" | "transportation" | "utilities" | "other";
  status: "approved" | "pending" | "rejected" | "missing";
  date: string;
  description: string;
  imageUrl?: string;
  notes?: string;
}

export const ReceiptManagement = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([
    {
      id: "1",
      receiptNumber: "RCP-2024-001",
      vendor: "Office Depot",
      amount: 89.99,
      category: "supplies",
      status: "approved",
      date: "Dec 15, 2024",
      description: "Cleaning supplies and paper towels",
      imageUrl: "/receipts/001.jpg"
    },
    {
      id: "2",
      receiptNumber: "RCP-2024-002",
      vendor: "Home Depot",
      amount: 245.50,
      category: "equipment",
      status: "pending",
      date: "Dec 18, 2024",
      description: "Industrial vacuum cleaner",
      imageUrl: "/receipts/002.jpg"
    },
    {
      id: "3",
      receiptNumber: "RCP-2024-003",
      vendor: "Shell Gas Station",
      amount: 65.00,
      category: "transportation",
      status: "approved",
      date: "Dec 20, 2024",
      description: "Vehicle fuel for service calls"
    },
    {
      id: "4",
      receiptNumber: "RCP-2024-004",
      vendor: "Amazon Business",
      amount: 127.83,
      category: "supplies",
      status: "rejected",
      date: "Dec 12, 2024",
      description: "Microfiber cloths and spray bottles",
      notes: "Personal items mixed with business expenses"
    },
    {
      id: "5",
      receiptNumber: "RCP-2024-005",
      vendor: "Electric Company",
      amount: 234.67,
      category: "utilities",
      status: "missing",
      date: "Dec 1, 2024",
      description: "Monthly utility bill",
      notes: "Receipt image required for approval"
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

  // Track object URLs for cleanup
  const objectUrlsRef = useRef<Set<string>>(new Set());

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  // Form state
  const [formData, setFormData] = useState({
    vendor: "",
    amount: "",
    category: "supplies" as Receipt["category"],
    description: "",
    notes: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "pending":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
      case "rejected":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
      case "missing":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "supplies":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "equipment":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      case "transportation":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "utilities":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20";
      case "other":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const filteredReceipts = receipts.filter(receipt => {
    const statusMatch = filterStatus === "all" || receipt.status === filterStatus;
    const categoryMatch = filterCategory === "all" || receipt.category === filterCategory;
    return statusMatch && categoryMatch;
  });

  const totalAmount = receipts.reduce((sum, receipt) => sum + receipt.amount, 0);
  const approvedAmount = receipts.filter(r => r.status === "approved").reduce((sum, receipt) => sum + receipt.amount, 0);
  const pendingAmount = receipts.filter(r => r.status === "pending").reduce((sum, receipt) => sum + receipt.amount, 0);
  const rejectedAmount = receipts.filter(r => r.status === "rejected").reduce((sum, receipt) => sum + receipt.amount, 0);

  // File handling functions
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Please upload an image file (JPG, PNG) or PDF');
      return;
    }

    setUploadedFile(file);

    // Create preview for images using blob URL (not data URI)
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setUploadPreview(previewUrl);
      // Note: This preview URL will be revoked in handleCancelUpload or after successful upload
    } else {
      setUploadPreview(null); // PDF has no preview
    }

    setShowUploadModal(true);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
      // Clear input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleBulkFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter valid files
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );

    if (validFiles.length === 0) {
      alert('Please upload image files (JPG, PNG) or PDFs');
      // Clear input so same files can be selected again
      if (bulkFileInputRef.current) {
        bulkFileInputRef.current.value = '';
      }
      return;
    }

    if (validFiles.length !== files.length) {
      alert(`${files.length - validFiles.length} file(s) were skipped (invalid type)`);
    }

    setBulkFiles(validFiles);
    setIsBulkMode(true);
    setShowUploadModal(true);

    // Clear input so same files can be selected again
    if (bulkFileInputRef.current) {
      bulkFileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    // If multiple files, treat as bulk import
    if (files.length > 1) {
      const validFiles = files.filter(file =>
        file.type.startsWith('image/') || file.type === 'application/pdf'
      );

      if (validFiles.length === 0) {
        alert('Please upload image files (JPG, PNG) or PDFs');
        return;
      }

      setBulkFiles(validFiles);
      setIsBulkMode(true);
      setShowUploadModal(true);
    } else {
      // Single file, use normal flow
      const file = files[0];
      if (file) {
        handleFileSelect(file);
      }
    }
  };

  const handleUploadReceipt = () => {
    if (!formData.vendor.trim() || !formData.amount || !formData.description.trim()) {
      alert('Please fill in all required fields (Vendor, Amount, Description)');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Generate new receipt number
    const receiptNumbers = receipts.map(r => parseInt(r.receiptNumber.split('-').pop() || '0'));
    const maxNumber = Math.max(...receiptNumbers, 0);
    const newReceiptNumber = `RCP-2024-${String(maxNumber + 1).padStart(3, '0')}`;

    // Create object URL for preview instead of fabricated path
    let imageUrl: string | undefined = undefined;
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      imageUrl = URL.createObjectURL(uploadedFile);
      objectUrlsRef.current.add(imageUrl); // Track for cleanup
    }

    const newReceipt: Receipt = {
      id: String(receipts.length + 1),
      receiptNumber: newReceiptNumber,
      vendor: formData.vendor,
      amount: amount,
      category: formData.category,
      status: "pending",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: formData.description,
      imageUrl: imageUrl,
      notes: formData.notes || undefined
    };

    setReceipts([newReceipt, ...receipts]);

    // Revoke preview URL (it's now stored in the receipt's imageUrl)
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }

    // Reset form and close modal
    setFormData({
      vendor: "",
      amount: "",
      category: "supplies",
      description: "",
      notes: ""
    });
    setUploadedFile(null);
    setUploadPreview(null);
    setShowUploadModal(false);

    alert(`Receipt ${newReceiptNumber} uploaded successfully!\n\nVendor: ${formData.vendor}\nAmount: $${amount.toFixed(2)}\nStatus: Pending approval`);
  };

  const handleBulkUpload = () => {
    if (bulkFiles.length === 0) {
      alert('No files selected for bulk import');
      return;
    }

    const receiptNumbers = receipts.map(r => parseInt(r.receiptNumber.split('-').pop() || '0'));
    let maxNumber = Math.max(...receiptNumbers, 0);

    const newReceipts: Receipt[] = bulkFiles.map((file, index) => {
      maxNumber += 1;
      const receiptNumber = `RCP-2024-${String(maxNumber).padStart(3, '0')}`;

      // Create object URL for image preview
      let imageUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        imageUrl = URL.createObjectURL(file);
        objectUrlsRef.current.add(imageUrl); // Track for cleanup
      }

      return {
        id: String(receipts.length + 1 + index),
        receiptNumber: receiptNumber,
        vendor: "Bulk Import",
        amount: 0,
        category: "other",
        status: "missing" as const,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: `Imported from ${file.name}`,
        imageUrl: imageUrl,
        notes: "Bulk imported - please update details"
      };
    });

    setReceipts([...newReceipts, ...receipts]);

    // Reset and close
    setBulkFiles([]);
    setIsBulkMode(false);
    setShowUploadModal(false);

    alert(`Successfully imported ${bulkFiles.length} receipt(s)!\n\nAll receipts marked as "Missing" - please update their details.`);
  };

  const handleCancelUpload = () => {
    // Revoke preview URL if it exists (not saved to receipts)
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }

    setShowUploadModal(false);
    setUploadedFile(null);
    setUploadPreview(null);
    setBulkFiles([]);
    setIsBulkMode(false);
    setFormData({
      vendor: "",
      amount: "",
      category: "supplies",
      description: "",
      notes: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Receipt Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Upload, track, and manage expense receipts
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <input
            ref={bulkFileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleBulkFileInputChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span>Upload Receipt</span>
          </button>
          <button
            onClick={() => bulkFileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span>Bulk Import</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Approved
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${approvedAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ${pendingAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Rejected
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                ${rejectedAmount.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Status:</span>
          {["all", "approved", "pending", "rejected", "missing"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Category:</span>
          {["all", "supplies", "equipment", "transportation", "utilities", "other"].map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Receipt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vendor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {receipt.receiptNumber}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {receipt.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {receipt.vendor}
                    </div>
                    {receipt.imageUrl && (
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        Image attached
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${receipt.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(receipt.category)}`}>
                      {receipt.category.charAt(0).toUpperCase() + receipt.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receipt.status)}`}>
                      {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {receipt.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      View
                    </button>
                    <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                      Approve
                    </button>
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed p-8 transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
            : "border-gray-300 dark:border-gray-600"
        }`}
      >
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mb-4">
            <ArrowUpIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {isDragging ? "Drop receipt here" : "Drop receipt images here"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Or click to browse and upload receipt images (JPG, PNG, PDF)
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Choose Files
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isBulkMode ? `Bulk Import (${bulkFiles.length} files)` : 'Upload Receipt'}
              </h2>
              <button
                onClick={handleCancelUpload}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Bulk Mode File List */}
              {isBulkMode && bulkFiles.length > 0 && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Files to Import ({bulkFiles.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {bulkFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        <span className="text-gray-900 dark:text-white truncate flex-1">{file.name}</span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                          {(file.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-3">
                    ⚠️ All receipts will be imported with "Missing" status. You'll need to update vendor, amount, and other details for each receipt.
                  </p>
                </div>
              )}

              {/* Single File Preview */}
              {!isBulkMode && uploadPreview && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Receipt Image Preview
                  </p>
                  <img
                    src={uploadPreview}
                    alt="Receipt preview"
                    className="max-h-64 mx-auto rounded"
                  />
                </div>
              )}

              {!isBulkMode && uploadedFile && !uploadPreview && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Uploaded File
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(2)} KB)
                  </p>
                </div>
              )}

              {/* Form Fields (only for single upload) */}
              {!isBulkMode && (
                <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Vendor *
                </label>
                <input
                  type="text"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Enter vendor name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Receipt["category"] })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="supplies">Supplies</option>
                  <option value="equipment">Equipment</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the expense"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes or comments"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancelUpload}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {isBulkMode ? (
                <button
                  onClick={handleBulkUpload}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Import {bulkFiles.length} Receipt{bulkFiles.length !== 1 ? 's' : ''}
                </button>
              ) : (
                <button
                  onClick={handleUploadReceipt}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Upload Receipt
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};