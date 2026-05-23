"use client";

import {FiTrendingUp, FiTrendingDown, FiArrowRight} from "react-icons/fi";

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
        return "border-red-500/30 bg-red-500/5";
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/5";
      case "success":
        return "border-green-500/30 bg-green-500/5";
      default:
        return "border-slate-700/50 bg-slate-800/50";
    }
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-red-400";
    if (trend === "down") return "text-green-400";
    return "text-slate-400";
  };

  return (
    <div
      onClick={onClick}
      className={`
        p-6 rounded-lg border transition-all cursor-pointer
        hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900
        ${getStatusColor()} ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            {trendValue && (
              <div className={`flex items-center gap-1 ${getTrendColor()}`}>
                {trend === "up" ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
                <span className="text-sm font-medium">{trendValue}</span>
              </div>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-2">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="text-slate-500">
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
