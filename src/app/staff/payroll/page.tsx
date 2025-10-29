import { DollarLineIcon, TimeIcon, CalenderIcon } from "@/icons";

const payrollData = {
  currentPeriod: {
    start: "Oct 15",
    end: "Oct 28",
    regularHours: 72.5,
    overtimeHours: 0,
    hourlyRate: 18.0,
    lunchDeduction: 5.0, // 10 days * 0.5h
    paidHours: 67.5, // 72.5 - 5.0
    grossPay: 1215.0, // 67.5 * 18
  },
  lastPaycheck: {
    date: "Oct 14, 2024",
    amount: 1260.0,
    hours: 70.0,
    paidHours: 66.5,
    period: "Sep 30 - Oct 13",
  },
  recentPaychecks: [
    { date: "Oct 14", amount: 1260.0, hours: 70.0 },
    { date: "Sep 30", amount: 1197.0, hours: 66.5 },
    { date: "Sep 16", amount: 1233.0, hours: 68.5 },
  ],
  ytd: {
    grossPay: 28450.0,
    hours: 1580,
    paidHours: 1501,
  },
};

export default function StaffPayrollPage() {
  return (
    <div className="space-y-6">
      {/* Current Pay Period */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-white p-6 dark:border-gray-800 dark:from-brand-900/10 dark:to-gray-900">
        <div className="mb-4 flex items-center gap-2">
          <CalenderIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Pay Period
          </h2>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {payrollData.currentPeriod.start} - {payrollData.currentPeriod.end}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Regular Hours</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {payrollData.currentPeriod.regularHours}h
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Lunch Deduction</span>
            <span className="font-medium text-gray-500 dark:text-gray-500">
              -{payrollData.currentPeriod.lunchDeduction}h
            </span>
          </div>

          <div className="flex justify-between border-t border-gray-200 pt-2 text-sm dark:border-gray-700">
            <span className="font-medium text-gray-900 dark:text-white">Paid Hours</span>
            <span className="font-semibold text-brand-600 dark:text-brand-400">
              {payrollData.currentPeriod.paidHours}h
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Hourly Rate</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${payrollData.currentPeriod.hourlyRate.toFixed(2)}/hr
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-success-50 p-4 dark:bg-success-900/20">
            <div className="flex items-center gap-2">
              <DollarLineIcon className="h-5 w-5 text-success-600 dark:text-success-400" />
              <span className="font-semibold text-gray-900 dark:text-white">
                Expected Pay
              </span>
            </div>
            <span className="text-2xl font-bold text-success-600 dark:text-success-400 tabular-nums">
              ${payrollData.currentPeriod.grossPay.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Last Paycheck */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
          Last Paycheck
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {payrollData.lastPaycheck.date}
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {payrollData.lastPaycheck.period}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <TimeIcon className="h-3 w-3" />
              <span>{payrollData.lastPaycheck.paidHours}h paid</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              ${payrollData.lastPaycheck.amount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Paychecks */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Recent Paychecks
        </h3>
        <div className="space-y-2">
          {payrollData.recentPaychecks.map((check, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-800 dark:bg-gray-800"
            >
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {check.date}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {check.hours}h
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
                ${check.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* YTD Summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Year to Date (2024)
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-500">
              Total Earnings
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              ${payrollData.ytd.grossPay.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-500">
              Total Hours
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums">
              {payrollData.ytd.paidHours}h
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              ({payrollData.ytd.hours}h before lunch)
            </div>
          </div>
        </div>

        {/* Average Hourly */}
        <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Average Hourly Rate
            </span>
            <span className="text-lg font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
              ${(payrollData.ytd.grossPay / payrollData.ytd.paidHours).toFixed(2)}/hr
            </span>
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
        <p className="text-sm text-blue-900 dark:text-blue-300">
          <span className="font-semibold">Note:</span> All hours shown reflect 30-minute lunch
          deduction per day. Contact your manager if you have questions about your payroll.
        </p>
      </div>
    </div>
  );
}
