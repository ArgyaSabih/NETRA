"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useContext } from "react";
import { LogChartContext } from "@/src/components/contexts/ChartDataProvider";

export default function NetworkTrafficChart() {
  const { logTableData = [] } = useContext(LogChartContext);

  const chartData = Object.entries(
    logTableData.reduce((acc, log) => {
      const second = log.timestamp.slice(0, 16);
      acc[second] = (acc[second] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([second, count]) => ({
      time: second.slice(11, 16),
      count,
    }))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="time" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
          labelStyle={{ color: "#e2e8f0" }}
        />
        <Legend />
        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}