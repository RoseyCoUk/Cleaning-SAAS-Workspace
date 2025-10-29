"use client";
import React, { useState, useRef, forwardRef } from "react";
import {
  EyeIcon,
  EyeCloseIcon,
  InfoIcon,
  AlertIcon,
  CheckCircleIcon,
  CalenderIcon,
  TimeIcon,
  AngleDownIcon,
} from "@/icons";
import { cn } from "@/lib/utils/cn";

// Types and interfaces
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface FormInputProps {
  // Basic props
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "search" | "textarea" | "select" | "date" | "time" | "datetime-local" | "file";
  name: string;
  label?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoFocus?: boolean;

  // Validation
  validation?: ValidationRule;
  error?: string;
  success?: boolean;

  // Help and description
  helpText?: string;
  description?: string;

  // Select-specific props
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>;

  // File input props
  accept?: string;
  multiple?: boolean;

  // Textarea props
  rows?: number;
  resize?: boolean;

  // Styling
  variant?: "default" | "filled" | "bordered" | "minimal";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  inputClassName?: string;

  // Events
  onChange?: (value: string | number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileSelect?: (files: FileList | null) => void;
}

/**
 * Production Form Input Component
 * Supports validation states, error messages, help text, and different input types
 */
export const FormInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormInputProps
>(({
  type = "text",
  name,
  label,
  placeholder,
  value,
  defaultValue,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  validation,
  error,
  success = false,
  helpText,
  description,
  options = [],
  accept,
  multiple = false,
  rows = 4,
  resize = true,
  variant = "default",
  size = "md",
  fullWidth = true,
  className,
  inputClassName,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  onFileSelect,
}, ref) => {
  // Internal state
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current value (controlled vs uncontrolled)
  const currentValue = value !== undefined ? value : internalValue;

  // Validation logic
  const validateValue = (val: string | number) => {
    if (!validation) return null;

    const stringVal = String(val);

    if (validation.required && !stringVal.trim()) {
      return "This field is required";
    }

    if (validation.minLength && stringVal.length < validation.minLength) {
      return `Minimum length is ${validation.minLength} characters`;
    }

    if (validation.maxLength && stringVal.length > validation.maxLength) {
      return `Maximum length is ${validation.maxLength} characters`;
    }

    if (validation.pattern && !validation.pattern.test(stringVal)) {
      return "Invalid format";
    }

    if (type === "number") {
      const numVal = Number(val);
      if (validation.min !== undefined && numVal < validation.min) {
        return `Minimum value is ${validation.min}`;
      }
      if (validation.max !== undefined && numVal > validation.max) {
        return `Maximum value is ${validation.max}`;
      }
    }

    if (validation.custom) {
      return validation.custom(val);
    }

    return null;
  };

  // Event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === "number" ? (e.target as HTMLInputElement).valueAsNumber || 0 : e.target.value;

    if (value === undefined) {
      setInternalValue(newValue);
    }

    // Validate on change
    const error = validateValue(newValue);
    setValidationError(error);

    onChange?.(newValue, e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsFocused(false);

    // Validate on blur
    const error = validateValue(currentValue);
    setValidationError(error);

    onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect?.(e.target.files);
  };

  // Get validation state
  const hasError = !!(error || validationError);
  const hasSuccess = success && !hasError;

  // Style variants
  const getVariantClasses = () => {
    const baseClasses = "transition-all duration-200";

    switch (variant) {
      case "filled":
        return cn(
          baseClasses,
          "bg-gray-100 dark:bg-gray-800 border-0 focus:bg-white dark:focus:bg-gray-900",
          hasError && "bg-red-50 dark:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20",
          hasSuccess && "bg-green-50 dark:bg-green-900/20 focus:bg-green-50 dark:focus:bg-green-900/20"
        );
      case "bordered":
        return cn(
          baseClasses,
          "bg-transparent border-2",
          hasError
            ? "border-red-500 focus:border-red-600"
            : hasSuccess
            ? "border-green-500 focus:border-green-600"
            : "border-gray-300 dark:border-gray-600 focus:border-brand-500"
        );
      case "minimal":
        return cn(
          baseClasses,
          "bg-transparent border-0 border-b-2",
          hasError
            ? "border-red-500 focus:border-red-600"
            : hasSuccess
            ? "border-green-500 focus:border-green-600"
            : "border-gray-300 dark:border-gray-600 focus:border-brand-500"
        );
      default:
        return cn(
          baseClasses,
          "bg-white dark:bg-gray-900 border",
          hasError
            ? "border-red-500 focus:border-red-600 focus:ring-red-500/20"
            : hasSuccess
            ? "border-green-500 focus:border-green-600 focus:ring-green-500/20"
            : "border-gray-300 dark:border-gray-600 focus:border-brand-500 focus:ring-brand-500/20",
          "focus:ring-2"
        );
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-2 text-sm";
      case "lg":
        return "px-4 py-3 text-lg";
      default:
        return "px-4 py-2.5 text-base";
    }
  };

  // Common input props
  const commonProps = {
    name,
    placeholder,
    disabled,
    readOnly,
    required,
    autoFocus,
    value: currentValue,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onKeyDown,
    className: cn(
      "w-full rounded-lg outline-none",
      "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
      getVariantClasses(),
      getSizeClasses(),
      disabled && "opacity-50 cursor-not-allowed",
      readOnly && "cursor-default",
      inputClassName
    ),
  };

  // Render input based on type
  const renderInput = () => {
    switch (type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={rows}
            style={{ resize: resize ? 'vertical' : 'none' }}
          />
        );

      case "select":
        return (
          <div className="relative">
            <select
              {...commonProps}
              ref={ref as React.Ref<HTMLSelectElement>}
              className={cn(commonProps.className, "appearance-none pr-10")}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </select>
            <AngleDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        );

      case "file":
        return (
          <div className="space-y-2">
            <input
              {...commonProps}
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "w-full px-4 py-2.5 border-2 border-dashed rounded-lg text-center",
                "hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors",
                hasError ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Click to select {multiple ? "files" : "file"} or drag and drop
              </div>
            </button>
          </div>
        );

      case "password":
        return (
          <div className="relative">
            <input
              {...commonProps}
              ref={ref as React.Ref<HTMLInputElement>}
              type={showPassword ? "text" : "password"}
              className={cn(commonProps.className, "pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeCloseIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        );

      case "date":
      case "time":
      case "datetime-local":
        return (
          <div className="relative">
            <input
              {...commonProps}
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              className={cn(commonProps.className, "pr-10")}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {type === "time" ? (
                <TimeIcon className="w-5 h-5" />
              ) : (
                <CalenderIcon className="w-5 h-5" />
              )}
            </div>
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", fullWidth ? "w-full" : "w-auto", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={cn(
            "block text-sm font-medium",
            hasError
              ? "text-red-700 dark:text-red-400"
              : hasSuccess
              ? "text-green-700 dark:text-green-400"
              : "text-gray-700 dark:text-gray-300"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}

      {/* Input */}
      <div className="relative">
        {renderInput()}

        {/* Status Icons */}
        {(hasError || hasSuccess) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {hasError ? (
              <AlertIcon className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error || validationError}</span>
        </div>
      )}

      {/* Success Message */}
      {hasSuccess && !hasError && (
        <div className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>Looks good!</span>
        </div>
      )}

      {/* Help Text */}
      {helpText && !hasError && (
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
          <InfoIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{helpText}</span>
        </div>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

// Form Input Group Component
export const FormInputGroup: React.FC<{
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}> = ({ children, title, description, className }) => {
  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// Example usage:
// <FormInput
//   type="email"
//   name="email"
//   label="Email Address"
//   placeholder="Enter your email"
//   required
//   validation={{
//     required: true,
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//   }}
//   helpText="We'll never share your email with anyone else."
// />
//
// <FormInput
//   type="select"
//   name="role"
//   label="Role"
//   options={[
//     { value: "admin", label: "Administrator" },
//     { value: "user", label: "User" },
//     { value: "guest", label: "Guest" }
//   ]}
//   required
// />
//
// <FormInput
//   type="password"
//   name="password"
//   label="Password"
//   validation={{
//     required: true,
//     minLength: 8,
//     custom: (value) => {
//       if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
//         return "Password must contain uppercase, lowercase, and number";
//       }
//       return null;
//     }
//   }}
// />