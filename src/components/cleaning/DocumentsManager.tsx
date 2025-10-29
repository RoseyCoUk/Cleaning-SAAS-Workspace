"use client";
import React, { useState } from "react";
import { PlusIcon, FileIcon, DownloadIcon, TrashBinIcon, FolderIcon, DocsIcon, TableIcon, CloseLineIcon } from "@/icons";
import { exportToCSV, prepareDataForExport } from "@/utils/exportUtils";

type DocumentType = "pdf" | "google_doc" | "google_sheet" | "link";
type DocumentCategory = "policies" | "contracts" | "forms" | "client_specific" | "other";

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  url: string;
  uploadDate: string;
  fileSize?: string;
  attachedToClient?: string;
  file?: File; // Store the actual File object for PDFs
}

// Document Upload Modal Component
interface DocumentUploadModalProps {
  onSave: (doc: Omit<Document, "id" | "uploadDate">) => void;
  onClose: () => void;
}

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ onSave, onClose }) => {
  const [docType, setDocType] = useState<DocumentType>("pdf");
  const [formData, setFormData] = useState({
    name: "",
    category: "policies" as DocumentCategory,
    url: "",
    fileSize: "",
    attachedToClient: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      // Auto-populate file size
      const sizeInKB = (file.size / 1024).toFixed(0);
      setFormData({ ...formData, fileSize: `${sizeInKB} KB` });
      // Auto-populate name if empty
      if (!formData.name) {
        setFormData({ ...formData, name: file.name.replace(".pdf", ""), fileSize: `${sizeInKB} KB` });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // For PDFs, require either a file upload or a URL
    if (docType === "pdf" && !selectedFile && !formData.url) {
      alert("Please upload a PDF file or provide a URL");
      return;
    }

    const newDoc: Omit<Document, "id" | "uploadDate"> = {
      name: formData.name,
      type: docType,
      category: formData.category,
      // For uploaded PDFs, use placeholder URL (will create blob on-demand)
      // For other types, use provided URL
      url: selectedFile ? "#" : formData.url || "#",
      fileSize: docType === "pdf" ? formData.fileSize : undefined,
      attachedToClient: formData.attachedToClient || undefined,
      // Store the actual File object for PDFs
      file: selectedFile || undefined,
    };
    onSave(newDoc);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[1001] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <CloseLineIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Type *
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentType)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="pdf">Upload PDF</option>
              <option value="google_doc">Link Google Doc</option>
              <option value="google_sheet">Link Google Sheet</option>
              <option value="link">Add URL/Link</option>
            </select>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="e.g., Cancellation Policy"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as DocumentCategory })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="policies">Policies</option>
              <option value="contracts">Contracts</option>
              <option value="forms">Forms</option>
              <option value="client_specific">Client-Specific</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* URL for Google Docs/Sheets/Links */}
          {docType !== "pdf" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {docType === "google_doc" ? "Google Doc URL" : docType === "google_sheet" ? "Google Sheet URL" : "Document URL"} *
              </label>
              <input
                type="url"
                required={docType !== "pdf"}
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                placeholder="https://docs.google.com/..."
              />
            </div>
          )}

          {/* File Upload for PDF (placeholder for real upload) */}
          {docType === "pdf" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload PDF *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  selectedFile
                    ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
                    : "border-gray-300 dark:border-gray-600"
                }`}>
                  <FileIcon className={`w-12 h-12 mx-auto mb-2 ${selectedFile ? "text-green-600 dark:text-green-400" : "text-gray-400"}`} />
                  {selectedFile ? (
                    <>
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {formData.fileSize} - Ready to upload
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        PDF up to 10MB
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="pdf-upload"
                    onChange={handleFileSelect}
                  />
                  <label
                    htmlFor="pdf-upload"
                    className="mt-3 inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {selectedFile ? "Change File" : "Choose File"}
                  </label>
                </div>
              </div>
              {selectedFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    File Size
                  </label>
                  <input
                    type="text"
                    value={formData.fileSize}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                  />
                </div>
              )}
            </>
          )}

          {/* Attach to Client (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Attach to Client (Optional)
            </label>
            <input
              type="text"
              value={formData.attachedToClient}
              onChange={(e) => setFormData({ ...formData, attachedToClient: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              placeholder="Client name (optional)"
            />
          </div>

          {/* Info */}
          {docType === "pdf" && (
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Note: In production, the file would be uploaded to cloud storage and a URL would be generated.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 font-medium transition-colors"
            >
              Add Document
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sample documents
const sampleDocuments: Document[] = [
  {
    id: "1",
    name: "Cancellation Policy",
    type: "pdf",
    category: "policies",
    url: "#",
    uploadDate: "Dec 15, 2024",
    fileSize: "245 KB",
  },
  {
    id: "2",
    name: "Service Agreement Template",
    type: "google_doc",
    category: "contracts",
    url: "https://docs.google.com/document/d/...",
    uploadDate: "Dec 10, 2024",
  },
  {
    id: "3",
    name: "Client Intake Form",
    type: "google_sheet",
    category: "forms",
    url: "https://docs.google.com/spreadsheets/d/...",
    uploadDate: "Dec 5, 2024",
  },
  {
    id: "4",
    name: "Special Instructions - Johnson Residence",
    type: "google_doc",
    category: "client_specific",
    url: "https://docs.google.com/document/d/...",
    uploadDate: "Dec 1, 2024",
    attachedToClient: "Sarah Johnson",
  },
  {
    id: "5",
    name: "Insurance Certificate",
    type: "pdf",
    category: "policies",
    url: "#",
    uploadDate: "Nov 20, 2024",
    fileSize: "1.2 MB",
  },
];

export const DocumentsManager = () => {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [categoryFilter, setCategoryFilter] = useState<DocumentCategory | "all">("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    if (categoryFilter !== "all" && doc.category !== categoryFilter) return false;
    return true;
  });

  // Group by category
  const groupedDocs = filteredDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<DocumentCategory, Document[]>);

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case "pdf":
        return <FileIcon className="w-5 h-5" />;
      case "google_doc":
        return <DocsIcon className="w-5 h-5" />;
      case "google_sheet":
        return <TableIcon className="w-5 h-5" />;
      case "link":
        return <FolderIcon className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: DocumentCategory) => {
    switch (category) {
      case "policies":
        return "Policies";
      case "contracts":
        return "Contracts";
      case "forms":
        return "Forms";
      case "client_specific":
        return "Client-Specific";
      case "other":
        return "Other";
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments(documents.filter((d) => d.id !== docId));
  };

  const handleDownload = (doc: Document) => {
    // For Google Docs/Sheets or external links, open in new tab
    if (doc.type === "google_doc" || doc.type === "google_sheet" || doc.type === "link") {
      window.open(doc.url, "_blank", "noopener,noreferrer");
    } else if (doc.file) {
      // For uploaded PDF files, create a blob URL on-demand
      const blobUrl = URL.createObjectURL(doc.file);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = doc.name + ".pdf";
      link.click();
      // Clean up the blob URL after download
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } else {
      // For PDFs with direct URLs (not uploaded), open in new tab
      // In production, this would use the actual file URL from cloud storage
      window.open(doc.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleExportList = () => {
    const exportData = prepareDataForExport(filteredDocuments, [
      "id",
      "name",
      "type",
      "category",
      "uploadDate",
      "fileSize",
      "attachedToClient",
      "url"
    ]);
    exportToCSV(exportData, `documents-${new Date().toISOString().split("T")[0]}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Documents & Files
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage company documents, policies, and client-specific files
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportList}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <DownloadIcon className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Document
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
            </div>
            <div className="p-3 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <FileIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Policies</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {documents.filter((d) => d.category === "policies").length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FolderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contracts</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {documents.filter((d) => d.category === "contracts").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FolderIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Client Files</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {documents.filter((d) => d.category === "client_specific").length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FolderIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as DocumentCategory | "all")}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        >
          <option value="all">All Categories</option>
          <option value="policies">Policies</option>
          <option value="contracts">Contracts</option>
          <option value="forms">Forms</option>
          <option value="client_specific">Client-Specific</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Documents by Category */}
      <div className="space-y-6">
        {Object.entries(groupedDocs).map(([category, docs]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {getCategoryLabel(category as DocumentCategory)} ({docs.length})
            </h2>
            <div className="space-y-3">
              {docs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {doc.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {doc.type === "pdf"
                              ? "PDF"
                              : doc.type === "google_doc"
                              ? "Google Doc"
                              : doc.type === "google_sheet"
                              ? "Google Sheet"
                              : "Link"}
                          </span>
                          <span>•</span>
                          <span>{doc.uploadDate}</span>
                          {doc.fileSize && (
                            <>
                              <span>•</span>
                              <span>{doc.fileSize}</span>
                            </>
                          )}
                          {doc.attachedToClient && (
                            <>
                              <span>•</span>
                              <span>Client: {doc.attachedToClient}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/10 rounded-lg transition-colors"
                        title="Download or open document"
                      >
                        <DownloadIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        title="Delete document"
                      >
                        <TrashBinIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
          <FileIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No documents found</p>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          onSave={(doc) => {
            setDocuments([...documents, { ...doc, id: Date.now().toString(), uploadDate: new Date().toLocaleDateString() }]);
            setShowUploadModal(false);
          }}
          onClose={() => setShowUploadModal(false)}
        />
      )}
    </div>
  );
};
