
'use client';

import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  count: number;
  icon?: "shield" | "ban" | "clock" | "list";
  variant?: "primary" | "error" | "warning" | "neutral";
};

const iconMap: Record<string, ReactNode> = {
  shield: (
    <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"/>
    </svg>
  ),
  ban: (
    <svg className="w-7 h-7 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <line x1="8" y1="8" x2="16" y2="16" strokeWidth={2} strokeLinecap="round" />
    </svg>
  ),
  clock: (
    <svg className="w-7 h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth={2} />
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"/>
    </svg>
  ),
  list: (
    <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="4" y="6" width="16" height="2" rx="1" />
      <rect x="4" y="11" width="16" height="2" rx="1" />
      <rect x="4" y="16" width="16" height="2" rx="1" />
    </svg>
  ),
};

const variantStyle: Record<string, string> = {
  primary: "bg-blue-50 border-blue-200",
  error: "bg-rose-50 border-rose-200",
  warning: "bg-yellow-50 border-yellow-200",
  neutral: "bg-gray-50 border-gray-200",
};

export default function DashboardCard({
  title,
  count,
  icon = "list",
  variant = "neutral",
}: DashboardCardProps) {
  return (
    <div
      className={`flex flex-col items-start p-5 border rounded-xl shadow-sm ${variantStyle[variant]}`}
    >
      <div className="mb-2">{iconMap[icon]}</div>
      <span className="text-3xl font-semibold text-gray-900">{count}</span>
      <span className="mt-1 text-sm text-gray-600">{title}</span>
    </div>
  );
}
