import Link from "next/link";
import { NextCleaningCard } from "@/components/client/NextCleaningCard";
import { PaymentDueCard } from "@/components/client/PaymentDueCard";
import { RecentServicesCard } from "@/components/client/RecentServicesCard";
import { CalenderIcon, DollarLineIcon } from "@/icons";

export default function ClientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Next Cleaning */}
      <NextCleaningCard />

      {/* Payment Due */}
      <PaymentDueCard />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Link
          href="/client/schedule"
          className="rounded-xl border border-gray-200 bg-white p-4 text-center transition-colors hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-600 sm:p-6"
        >
          <CalenderIcon className="mx-auto h-6 w-6 text-brand-600 dark:text-brand-400 sm:h-8 sm:w-8" />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
            Schedule
          </div>
        </Link>

        <Link
          href="/client/payments"
          className="rounded-xl border border-gray-200 bg-white p-4 text-center transition-colors hover:border-brand-500 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-brand-600 sm:p-6"
        >
          <DollarLineIcon className="mx-auto h-6 w-6 text-brand-600 dark:text-brand-400 sm:h-8 sm:w-8" />
          <div className="mt-2 text-sm font-semibold text-gray-900 dark:text-white sm:text-base">
            Payments
          </div>
        </Link>
      </div>

      {/* Recent Services */}
      <RecentServicesCard />
    </div>
  );
}
