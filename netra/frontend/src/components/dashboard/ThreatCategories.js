"use client";

import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer} from "recharts";
import {useContext} from "react";
import {LogChartContext} from "@/src/components/contexts/ChartDataProvider";

const COLORS = {
  "potentially malicious": "oklch(0.72 0.17 25)",
  "benign-like": "oklch(0.74 0.13 155)"
};

const FALLBACK_COLOR = "oklch(0.7 0.018 240)";

export default function TrafficPieChart() {
  const {logTableData = []} = useContext(LogChartContext);

  const chartData = Object.entries(
    logTableData.reduce((acc, log) => {
      const type = log.eventType ?? "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({name, value}));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl bg-[oklch(0.2_0.016_240)] p-4 shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-inter-bold">Classification mix</h2>
          <p className="mt-1 text-xs text-[oklch(0.7_0.018_240)]">AI event labels</p>
        </div>
        <span className="rounded-md bg-[oklch(0.16_0.014_240)] px-2.5 py-1 text-xs text-[oklch(0.74_0.018_240)] shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]">
          <span className="tabular-nums">{total}</span> total
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={3} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] ?? FALLBACK_COLOR} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(0.18 0.014 240)",
              border: "1px solid oklch(0.38 0.018 240)",
              borderRadius: "10px",
              color: "oklch(0.94 0.006 240)"
            }}
            labelStyle={{color: "oklch(0.94 0.006 240)"}}
            formatter={(value, name) => [`${value} logs`, name]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 space-y-2">
        {chartData.length === 0 ? (
          <p className="text-center text-xs text-[oklch(0.62_0.018_240)]">No category data</p>
        ) : (
          chartData.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg bg-[oklch(0.17_0.014_240)] px-3 py-2 text-xs shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]"
            >
              <span className="flex items-center gap-2 truncate text-[oklch(0.84_0.01_240)]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{backgroundColor: COLORS[item.name] ?? FALLBACK_COLOR}}
                />
                {item.name}
              </span>
              <span className="text-[oklch(0.7_0.018_240)] tabular-nums">{item.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
