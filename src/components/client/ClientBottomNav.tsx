"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, CalenderIcon, DollarLineIcon } from "@/icons";

const NAV_ITEMS = [
  { href: "/client", label: "Home", icon: GridIcon },
  { href: "/client/schedule", label: "Schedule", icon: CalenderIcon },
  { href: "/client/payments", label: "Payments", icon: DollarLineIcon },
];

export default function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md border-t border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <ul className="flex items-center justify-between gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex flex-1 justify-center">
              <Link
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                    : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
