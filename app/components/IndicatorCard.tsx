"use client";

import React from "react";

export interface IndicatorCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  changePercent: number;
  unit?: string;
  onHover?: () => void;
  onLeave?: () => void;
}

export function IndicatorCard({ label, value, icon, changePercent, unit, onHover, onLeave }: IndicatorCardProps) {
  const isPositive = changePercent >= 0;
  // keep component lightweight; hover handled by parent via callbacks

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 cursor-pointer"
    >
      {/* Header with label and icon */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {label}
        </h3>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
          {icon}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-zinc-900 dark:text-white">{value}</span>
        {unit && <span className="text-sm text-zinc-500 dark:text-zinc-400">{unit}</span>}
      </div>

      {/* Change percentage */}
      {changePercent !== 0 ? (
        <div
          className={`text-sm font-medium flex items-center gap-1 ${
            isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          <span>{isPositive ? "↗" : "↘"}</span>
          <span>{Math.abs(changePercent)}%</span>
        </div>
      ) : null}

      {/* Chart is displayed in parent DashboardRow on hover */}
    </div>
  );
}
