"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useContext } from "react";
import { LogChartContext } from "@/src/components/contexts/ChartDataProvider";

const COLORS = {
  "potentially malicious": "#ef4444",
  "benign-like": "#22c55e",
};

const FALLBACK_COLOR = "#94a3b8";

export default function TrafficPieChart() {
  const { logTableData = [] } = useContext(LogChartContext);

  const chartData = Object.entries(
    logTableData.reduce((acc, log) => {
      const type = log.eventType ?? "Unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name] ?? FALLBACK_COLOR}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          labelStyle={{ color: "#e2e8f0" }}
          formatter={(value, name) => [`${value} logs`, name]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}