import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: "brand" | "success" | "gray";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  color = "gray"
}) => {
  const colorClasses = {
    brand: "bg-brand-50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-900",
    success: "bg-success-50 dark:bg-success-900/10 border-success-200 dark:border-success-900",
    gray: "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800",
  };

  const iconClasses = {
    brand: "text-brand-600 dark:text-brand-400",
    success: "text-success-600 dark:text-success-400",
    gray: "text-gray-600 dark:text-gray-400",
  };

  const valueClasses = {
    brand: "text-brand-900 dark:text-brand-100",
    success: "text-success-900 dark:text-success-100",
    gray: "text-gray-900 dark:text-white",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        {Icon && <Icon className={`h-5 w-5 ${iconClasses[color]}`} />}
      </div>
      <div className={`mt-2 text-2xl font-bold tabular-nums ${valueClasses[color]}`}>
        {value}
      </div>
    </div>
  );
};
