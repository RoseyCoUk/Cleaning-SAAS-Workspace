"use client";
import React, { useState } from "react";
import {
  CalenderIcon,
  TimeIcon,
  DollarLineIcon,
  UserIcon,
  CheckCircleIcon,
  AlertIcon,
  InfoIcon,
  PlusIcon,
  MoreDotIcon,
  CloseIcon,
} from "@/icons";
import { cn } from "@/lib/utils/cn";

// Types and interfaces
export interface ServiceBookingData {
  id: string;
  title: string;
  description?: string;
  category: string;
  duration: number; // in minutes
  price: {
    amount: number;
    currency: string;
    unit?: "per_hour" | "per_service" | "per_room" | "per_sqft";
  };
  rating?: number;
  reviewCount?: number;
  availability: {
    available: boolean;
    nextAvailable?: Date;
    timeSlots?: string[];
  };
  provider?: {
    name: string;
    avatar?: string;
    rating?: number;
    verified?: boolean;
  };
  features?: string[];
  images?: string[];
  tags?: string[];
  status?: "available" | "busy" | "unavailable" | "popular";
  discount?: {
    percentage: number;
    validUntil?: Date;
    code?: string;
  };
}

export interface ServiceBookingCardProps {
  service: ServiceBookingData;
  variant?: "default" | "compact" | "detailed" | "minimal";
  showQuickActions?: boolean;
  showProviderInfo?: boolean;
  showPricing?: boolean;
  showFeatures?: boolean;
  showAvailability?: boolean;
  featured?: boolean;
  loading?: boolean;
  className?: string;
  onBook?: (service: ServiceBookingData) => void;
  onFavorite?: (service: ServiceBookingData) => void;
  onViewDetails?: (service: ServiceBookingData) => void;
  onQuickAdd?: (service: ServiceBookingData) => void;
  onProviderClick?: (provider: ServiceBookingData["provider"]) => void;
}

/**
 * Service Booking Card Component
 * Features: service details display, quick booking actions, status indicators, pricing display
 */
export const ServiceBookingCard: React.FC<ServiceBookingCardProps> = ({
  service,
  variant = "default",
  showQuickActions = true,
  showProviderInfo = true,
  showPricing = true,
  showFeatures = true,
  showAvailability = true,
  featured = false,
  loading = false,
  className,
  onBook,
  onFavorite,
  onViewDetails,
  onQuickAdd,
  onProviderClick,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper functions
  const formatPrice = () => {
    const { amount, currency, unit } = service.price;
    const unitLabel = unit ? ` ${unit.replace("_", " ")}` : "";
    return `${currency}${amount}${unitLabel}`;
  };

  const formatDuration = () => {
    const hours = Math.floor(service.duration / 60);
    const minutes = service.duration % 60;
    if (hours > 0) {
      return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = () => {
    switch (service.status) {
      case "available":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20";
      case "busy":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20";
      case "unavailable":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20";
      case "popular":
        return "text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/20";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = () => {
    switch (service.status) {
      case "available":
        return <CheckCircleIcon className="w-3 h-3" />;
      case "busy":
      case "unavailable":
        return <AlertIcon className="w-3 h-3" />;
      case "popular":
        return <InfoIcon className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavorite?.(service);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBook?.(service);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd?.(service);
  };

  const handleProviderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onProviderClick?.(service.provider);
  };

  if (loading) {
    return (
      <div className={cn(
        "bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 p-6 animate-pulse",
        className
      )}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex justify-between">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  const getVariantClasses = () => {
    switch (variant) {
      case "compact":
        return "p-4";
      case "detailed":
        return "p-6";
      case "minimal":
        return "p-3";
      default:
        return "p-5";
    }
  };

  return (
    <div
      onClick={() => onViewDetails?.(service)}
      className={cn(
        "bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer relative group",
        featured && "ring-2 ring-brand-500 ring-opacity-50",
        getVariantClasses(),
        className
      )}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-2 -right-2 bg-brand-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Featured
        </div>
      )}

      {/* Discount Badge */}
      {service.discount && (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium z-10">
          {service.discount.percentage}% OFF
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {service.title}
            </h3>
            {service.status && (
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                getStatusColor()
              )}>
                {getStatusIcon()}
                {service.status}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {service.category}
          </p>

          {service.rating && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1 font-medium text-gray-900 dark:text-white">
                  {service.rating.toFixed(1)}
                </span>
              </div>
              {service.reviewCount && (
                <span className="text-gray-500 dark:text-gray-400">
                  ({service.reviewCount} reviews)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions Dropdown */}
        {showQuickActions && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <MoreDotIcon className="w-5 h-5" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 py-2">
                <button
                  onClick={handleFavorite}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {isFavorited ? "Remove from favorites" : "Add to favorites"}
                </button>
                <button
                  onClick={handleQuickAdd}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Quick add to cart
                </button>
                <button
                  onClick={() => onViewDetails?.(service)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  View details
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {service.description && variant !== "minimal" && (
        <p className={cn(
          "text-sm text-gray-600 dark:text-gray-400 mb-4",
          !isExpanded && "line-clamp-2"
        )}>
          {service.description}
        </p>
      )}

      {/* Features */}
      {showFeatures && service.features && service.features.length > 0 && variant === "detailed" && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            What's included:
          </h4>
          <ul className="space-y-1">
            {service.features.slice(0, isExpanded ? undefined : 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          {service.features.length > 3 && !isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-sm text-brand-600 dark:text-brand-400 hover:underline mt-2"
            >
              +{service.features.length - 3} more features
            </button>
          )}
        </div>
      )}

      {/* Provider Info */}
      {showProviderInfo && service.provider && variant !== "minimal" && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
          {service.provider.avatar ? (
            <img
              src={service.provider.avatar}
              alt={service.provider.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/20 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <button
              onClick={handleProviderClick}
              className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 truncate block"
            >
              {service.provider.name}
              {service.provider.verified && (
                <CheckCircleIcon className="w-4 h-4 text-brand-500 inline ml-1" />
              )}
            </button>
            {service.provider.rating && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{service.provider.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Availability */}
      {showAvailability && service.availability && variant !== "minimal" && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <TimeIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Availability
            </span>
          </div>
          {service.availability.available ? (
            <div className="space-y-2">
              <p className="text-sm text-green-600 dark:text-green-400">
                Available now
              </p>
              {service.availability.timeSlots && (
                <div className="flex flex-wrap gap-2">
                  {service.availability.timeSlots.slice(0, 3).map((slot, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-brand-100 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 rounded text-xs"
                    >
                      {slot}
                    </span>
                  ))}
                  {service.availability.timeSlots.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      +{service.availability.timeSlots.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm text-red-600 dark:text-red-400">
                Currently unavailable
              </p>
              {service.availability.nextAvailable && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Next available: {service.availability.nextAvailable.toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Pricing and Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
        {showPricing && (
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatPrice()}
              </span>
              {service.discount && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                  {service.price.currency}{(service.price.amount * (1 + service.discount.percentage / 100)).toFixed(0)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <CalenderIcon className="w-4 h-4" />
              <span>{formatDuration()}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {showQuickActions && variant !== "compact" && (
            <button
              onClick={handleQuickAdd}
              className="p-2 text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Quick add"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={handleBook}
            disabled={!service.availability.available}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors",
              service.availability.available
                ? "bg-brand-600 hover:bg-brand-700 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
          >
            {service.availability.available ? "Book Now" : "Unavailable"}
          </button>
        </div>
      </div>

      {/* Tags */}
      {service.tags && service.tags.length > 0 && variant === "detailed" && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          {service.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Service Booking Grid Component
export const ServiceBookingGrid: React.FC<{
  services: ServiceBookingData[];
  variant?: "default" | "compact" | "detailed" | "minimal";
  columns?: 1 | 2 | 3 | 4;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onBook?: (service: ServiceBookingData) => void;
  onFavorite?: (service: ServiceBookingData) => void;
  onViewDetails?: (service: ServiceBookingData) => void;
}> = ({
  services,
  variant = "default",
  columns = 3,
  loading = false,
  emptyMessage = "No services available",
  className,
  onBook,
  onFavorite,
  onViewDetails,
}) => {
  const getGridClasses = () => {
    switch (columns) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 4:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (loading) {
    return (
      <div className={cn("grid gap-6", getGridClasses(), className)}>
        {[...Array(6)].map((_, i) => (
          <ServiceBookingCard key={i} service={{} as ServiceBookingData} loading />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", getGridClasses(), className)}>
      {services.map((service) => (
        <ServiceBookingCard
          key={service.id}
          service={service}
          variant={variant}
          onBook={onBook}
          onFavorite={onFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

// Example usage:
// const exampleService: ServiceBookingData = {
//   id: "1",
//   title: "Deep House Cleaning",
//   description: "Complete deep cleaning service for your entire home...",
//   category: "Residential Cleaning",
//   duration: 180,
//   price: { amount: 150, currency: "$", unit: "per_service" },
//   rating: 4.8,
//   reviewCount: 124,
//   availability: { available: true, timeSlots: ["9:00 AM", "1:00 PM", "3:00 PM"] },
//   provider: { name: "Sarah Johnson", verified: true, rating: 4.9 },
//   features: ["All rooms", "Kitchen deep clean", "Bathroom sanitization"],
//   status: "available"
// };
//
// <ServiceBookingCard
//   service={exampleService}
//   onBook={(service) => console.log("Book:", service)}
//   onFavorite={(service) => console.log("Favorite:", service)}
// />