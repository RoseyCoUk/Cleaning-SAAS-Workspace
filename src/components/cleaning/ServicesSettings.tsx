"use client";
import React, { useState } from "react";
import { CheckCircleIcon } from "@/icons";

interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  hourlyRate: number;
  category: string;
  isActive: boolean;
  estimatedDuration: number;
  materials: string[];
}

type PricingModel = "hourly" | "flat_fee";

export const ServicesSettings = () => {
  const [pricingModel, setPricingModel] = useState<PricingModel>("hourly");
  const [defaultHourlyRate, setDefaultHourlyRate] = useState(50);
  const [allowPerClientPricing, setAllowPerClientPricing] = useState(true);

  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Standard House Cleaning",
      description: "Regular cleaning service for residential homes",
      basePrice: 120,
      hourlyRate: 45,
      category: "Residential",
      isActive: true,
      estimatedDuration: 2.5,
      materials: ["All-purpose cleaner", "Microfiber cloths", "Vacuum"]
    },
    {
      id: "2",
      name: "Deep Cleaning",
      description: "Thorough cleaning including baseboards, inside appliances",
      basePrice: 250,
      hourlyRate: 55,
      category: "Residential",
      isActive: true,
      estimatedDuration: 4,
      materials: ["Deep clean chemicals", "Scrub brushes", "Steam cleaner"]
    },
    {
      id: "3",
      name: "Office Cleaning",
      description: "Commercial cleaning for office spaces",
      basePrice: 150,
      hourlyRate: 40,
      category: "Commercial",
      isActive: true,
      estimatedDuration: 3,
      materials: ["Commercial cleaners", "Industrial vacuum", "Disinfectant"]
    },
    {
      id: "4",
      name: "Window Cleaning",
      description: "Interior and exterior window cleaning",
      basePrice: 80,
      hourlyRate: 35,
      category: "Specialty",
      isActive: true,
      estimatedDuration: 1.5,
      materials: ["Window cleaner", "Squeegees", "Ladder"]
    },
    {
      id: "5",
      name: "Carpet Cleaning",
      description: "Professional carpet cleaning and stain removal",
      basePrice: 200,
      hourlyRate: 50,
      category: "Specialty",
      isActive: false,
      estimatedDuration: 3.5,
      materials: ["Carpet shampoo", "Steam cleaner", "Stain remover"]
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [categories, setCategories] = useState<string[]>(["Residential", "Commercial", "Specialty"]);

  const filteredServices = filterCategory === "all"
    ? services
    : services.filter(service => service.category === filterCategory);

  const toggleServiceStatus = (serviceId: string) => {
    setServices(services.map(service =>
      service.id === serviceId ? { ...service, isActive: !service.isActive } : service
    ));
  };

  const deleteService = (serviceId: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const handleAddCategory = () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      alert("Please enter a category name");
      return;
    }
    // Case-insensitive duplicate detection
    const normalizedCategories = categories.map(c => c.toLowerCase());
    if (normalizedCategories.includes(trimmedName.toLowerCase())) {
      alert("This category already exists (case-insensitive match)");
      return;
    }
    // Sort categories alphabetically after adding
    const updatedCategories = [...categories, trimmedName].sort((a, b) => a.localeCompare(b));
    setCategories(updatedCategories);
    setNewCategoryName("");
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    const servicesInCategory = services.filter(s => s.category === categoryToDelete);
    if (servicesInCategory.length > 0) {
      alert(`Cannot delete "${categoryToDelete}" because ${servicesInCategory.length} service(s) are using it. Please reassign those services first.`);
      return;
    }
    if (confirm(`Are you sure you want to delete the "${categoryToDelete}" category?`)) {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
      if (filterCategory === categoryToDelete) {
        setFilterCategory("all");
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Residential":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20";
      case "Commercial":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
      case "Specialty":
        return "text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20";
    }
  };

  const ServiceForm = ({ service, onSave, onCancel }: {
    service?: Service;
    onSave: (service: Service) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState<Partial<Service>>(service || {
      name: "",
      description: "",
      basePrice: 0,
      hourlyRate: 0,
      category: "Residential",
      isActive: true,
      estimatedDuration: 1,
      materials: []
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newService: Service = {
        id: service?.id || Date.now().toString(),
        name: formData.name || "",
        description: formData.description || "",
        basePrice: formData.basePrice || 0,
        hourlyRate: formData.hourlyRate || 0,
        category: formData.category || "Residential",
        isActive: formData.isActive ?? true,
        estimatedDuration: formData.estimatedDuration || 1,
        materials: formData.materials || []
      };
      onSave(newService);
    };

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[1001]">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {service ? "Edit Service" : "Add New Service"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Service Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Base Price ($)
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({...formData, estimatedDuration: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Service
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {service ? "Update" : "Add"} Service
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Services & Pricing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your service offerings and pricing structure
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>Add Service</span>
        </button>
      </div>

      {/* Pricing Model Configuration */}
      <div className="bg-white dark:bg-white/[0.03] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Pricing Model
        </h2>
        <div className="space-y-6">
          {/* Pricing Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Default Pricing Model
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPricingModel("hourly")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  pricingModel === "hourly"
                    ? "border-brand-600 bg-brand-50 dark:bg-brand-900/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Hourly Rate</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Charge clients based on hours worked
                    </p>
                  </div>
                  {pricingModel === "hourly" && (
                    <CheckCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setPricingModel("flat_fee")}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  pricingModel === "flat_fee"
                    ? "border-brand-600 bg-brand-50 dark:bg-brand-900/10"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Flat Fee</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Fixed price per service type
                    </p>
                  </div>
                  {pricingModel === "flat_fee" && (
                    <CheckCircleIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Default Hourly Rate (only show when hourly model is selected) */}
          {pricingModel === "hourly" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Hourly Rate
              </label>
              <div className="relative max-w-xs">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={defaultHourlyRate}
                  onChange={(e) => setDefaultHourlyRate(parseFloat(e.target.value))}
                  className="w-full pl-8 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  min="0"
                  step="5"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  /hr
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                This rate will be used as the default for new services
              </p>
            </div>
          )}

          {/* Per-Client Pricing Flexibility */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="per-client-pricing"
                type="checkbox"
                checked={allowPerClientPricing}
                onChange={(e) => setAllowPerClientPricing(e.target.checked)}
                className="w-4 h-4 text-brand-600 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-brand-500 dark:focus:ring-brand-600 focus:ring-2"
              />
            </div>
            <div className="ml-3">
              <label htmlFor="per-client-pricing" className="font-medium text-gray-700 dark:text-gray-300">
                Allow per-client pricing adjustments
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enable custom pricing for individual clients that differs from the standard rates
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Pricing Model Tips
                </h3>
                <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Hourly rates work best for variable-duration services</li>
                    <li>Flat fees provide predictable pricing for standard services</li>
                    <li>Per-client pricing allows flexibility for loyal customers or special circumstances</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Services
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {services.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Active Services
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {services.filter(s => s.isActive).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Avg Base Price
          </p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ${Math.round(services.reduce((sum, s) => sum + s.basePrice, 0) / services.length)}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Avg Hourly Rate
          </p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            ${Math.round(services.reduce((sum, s) => sum + s.hourlyRate, 0) / services.length)}
          </p>
        </div>
      </div>

      {/* Category Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Categories</h3>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm font-medium transition-colors"
          >
            + Add Category
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const serviceCount = services.filter(s => s.category === category).length;
            return (
              <div
                key={category}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">{category}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({serviceCount})</span>
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="ml-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                  title={`Delete ${category} category`}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 self-center">Filter by category:</span>
        {["all", ...categories].map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Services Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Base Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Hourly Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {service.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {service.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    ${service.basePrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${service.hourlyRate}/hr
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {service.estimatedDuration}h
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      service.isActive
                        ? "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20"
                        : "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20"
                    }`}>
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleServiceStatus(service.id)}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                      {service.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteService(service.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <ServiceForm
          onSave={(newService) => {
            setServices([...services, newService]);
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {editingService && (
        <ServiceForm
          service={editingService}
          onSave={(updatedService) => {
            setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
            setEditingService(null);
          }}
          onCancel={() => setEditingService(null)}
        />
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Add New Category
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};