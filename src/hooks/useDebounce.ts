"use client";
import { useState, useEffect } from "react";

/**
 * useDebounce - Debounces a value with a specified delay
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up the timeout to update debounced value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Example usage:
// const searchTerm = "user input";
// const debouncedSearchTerm = useDebounce(searchTerm, 300);
// useEffect(() => {
//   // Only search after user stops typing for 300ms
//   performSearch(debouncedSearchTerm);
// }, [debouncedSearchTerm]);