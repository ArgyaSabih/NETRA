"use client";

import {FiTrendingUp, FiTrendingDown} from "react-icons/fi";

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  status = "normal",
  onClick,
  className = ""
}) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "bg-[oklch(0.2_0.02_25)] shadow-[inset_0_0_0_1px_oklch(0.48_0.12_25)]";
      case "warning":
        return "bg-[oklch(0.2_0.02_65)] shadow-[inset_0_0_0_1px_oklch(0.52_0.11_65)]";
      case "success":
        return "bg-[oklch(0.2_0.02_155)] shadow-[inset_0_0_0_1px_oklch(0.5_0.1_155)]";
      default:
        return "bg-[oklch(0.2_0.016_240)] shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]";
    }
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-[oklch(0.74_0.15_25)]";
    if (trend === "down") return "text-[oklch(0.76_0.13_155)]";
    return "text-[oklch(0.7_0.018_240)]";
  };

  return (
    <div
      onClick={onClick}
      className={`
        min-h-[132px] rounded-xl p-4 hover:bg-[oklch(0.23_0.018_240)]
        ${getStatusColor()} ${className}
      `}
    >
      <div className="flex h-full flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-inter-semibold uppercase tracking-[0.16em] text-[oklch(0.68_0.018_240)]">
            {title}
          </p>
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[oklch(0.16_0.014_240)] text-[oklch(0.78_0.03_240)]">
              <Icon size={16} />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-[2rem] leading-none tracking-tight tabular-nums font-inter-bold">{value}</h3>
            {trendValue && (
              <div className={`flex items-center gap-1 pb-1 ${getTrendColor()}`}>
                {trend === "up" ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
                <span className="text-xs font-inter-semibold tabular-nums">{trendValue}</span>
              </div>
            )}
          </div>
          {subtitle && <p className="mt-2 truncate text-xs text-[oklch(0.68_0.018_240)]">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
