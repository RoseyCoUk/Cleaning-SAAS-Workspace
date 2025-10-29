"use client";
import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: React.ReactNode;
  variant?: "default" | "gradient" | "bordered";
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Advanced Metric Card Component
 * Displays key metrics with trends, icons, and various styles
 */
export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = "default",
  loading = false,
  className,
  onClick,
}) => {
  const getTrendColor = () => {
    if (!trend) return "";
    if (trend.direction === "up") return "text-green-600 dark:text-green-400";
    if (trend.direction === "down") return "text-red-600 dark:text-red-400";
    return "text-gray-500 dark:text-gray-400";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === "up") return <ArrowUpIcon className="w-4 h-4" />;
    if (trend.direction === "down") return <ArrowDownIcon className="w-4 h-4" />;
    return <span className="w-4 h-4 inline-block">–</span>;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "gradient":
        return "bg-gradient-to-br from-brand-500 to-brand-600 text-white border-0";
      case "bordered":
        return "bg-transparent border-2 border-brand-200 dark:border-brand-800";
      default:
        return "bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800";
    }
  };

  const getValueTextColor = () => {
    if (variant === "gradient") return "text-white";
    return "text-gray-900 dark:text-white";
  };

  const getTitleTextColor = () => {
    if (variant === "gradient") return "text-white/80";
    return "text-gray-600 dark:text-gray-400";
  };

  if (loading) {
    return (
      <div
        className={cn(
          "rounded-xl shadow-sm p-6 animate-pulse",
          getVariantClasses(),
          className
        )}
      >
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl shadow-sm p-6 transition-all duration-200",
        getVariantClasses(),
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className={cn("text-sm font-medium", getTitleTextColor())}>{title}</p>
        </div>
        {icon && (
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg",
              variant === "gradient"
                ? "bg-white/20"
                : "bg-brand-50 dark:bg-brand-900/20"
            )}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="space-y-1">
        <p className={cn("text-2xl font-bold", getValueTextColor())}>{value}</p>

        {/* Subtitle */}
        {subtitle && (
          <p
            className={cn(
              "text-xs",
              variant === "gradient"
                ? "text-white/60"
                : "text-gray-500 dark:text-gray-400"
            )}
          >
            {subtitle}
          </p>
        )}

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <span className={cn("flex items-center", getTrendColor())}>
              {getTrendIcon()}
            </span>
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {trend.value > 0 && "+"}
              {trend.value}%
            </span>
            {trend.label && (
              <span
                className={cn(
                  "text-xs",
                  variant === "gradient"
                    ? "text-white/60"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar (optional) */}
      {trend && trend.value !== undefined && (
        <div className="mt-4">
          <div
            className={cn(
              "h-1 rounded-full overflow-hidden",
              variant === "gradient"
                ? "bg-white/20"
                : "bg-gray-200 dark:bg-gray-700"
            )}
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                variant === "gradient"
                  ? "bg-white"
                  : trend.direction === "up"
                  ? "bg-green-500"
                  : trend.direction === "down"
                  ? "bg-red-500"
                  : "bg-gray-400"
              )}
              style={{ width: `${Math.min(100, Math.abs(trend.value))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Export additional metric card variants
export const MetricCardGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>
  );
};

// Example usage:
// <MetricCard
//   title="Total Revenue"
//   value="$45,231"
//   subtitle="This month"
//   trend={{ value: 12.5, direction: "up", label: "vs last month" }}
//   icon={<DollarLineIcon className="w-6 h-6 text-brand-600" />}
//   variant="default"
// />

// <MetricCardGroup>
//   <MetricCard title="Active Clients" value="156" trend={{ value: 5, direction: "up" }} />
//   <MetricCard title="Jobs Today" value="12" trend={{ value: -2, direction: "down" }} />
//   <MetricCard title="Staff Online" value="8" variant="gradient" />
//   <MetricCard title="Avg Rating" value="4.8" icon={<StarIcon />} variant="bordered" />
// </MetricCardGroup>