import type { ReactNode } from "react";
import StaffBottomNav from "@/components/staff/StaffBottomNav";

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile-optimized container */}
      <div className="mx-auto flex min-h-screen w-full max-w-md md:max-w-2xl lg:max-w-4xl flex-col bg-white dark:bg-gray-950 shadow-lg">
        {/* Top header */}
        <div className="bg-brand-600 px-4 py-4 text-white">
          <h1 className="text-lg font-semibold">CleanPro Staff</h1>
          <p className="text-sm text-brand-100">Welcome back, Maria</p>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
          {children}
        </div>

        {/* Bottom navigation */}
        <StaffBottomNav />
      </div>
    </div>
  );
}
