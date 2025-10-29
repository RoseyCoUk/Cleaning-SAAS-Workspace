"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/client", label: "Dashboard" },
  { href: "/client/schedule", label: "Schedule" },
  { href: "/client/payments", label: "Payments" },
];

export const ClientNav = () => {
  const pathname = usePathname();

  return (
    <nav className="mt-3 -mx-4 overflow-x-auto border-t border-gray-200 pt-3 dark:border-gray-800 sm:mx-0 sm:mt-4 sm:pt-4">
      <div className="flex gap-4 px-4 sm:gap-6 sm:px-0">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap text-sm font-medium transition-colors ${
                isActive
                  ? "text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
