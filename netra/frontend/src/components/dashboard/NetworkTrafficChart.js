"use client";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import {useContext} from "react";
import {LogChartContext} from "@/src/components/contexts/ChartDataProvider";

export default function NetworkTrafficChart() {
  const {logTableData = []} = useContext(LogChartContext);

  const chartData = Object.entries(
    logTableData.reduce((acc, log) => {
      const second = log.timestamp.slice(0, 16);
      acc[second] = (acc[second] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([second, count]) => ({
      time: second.slice(11, 16),
      count
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
  const totalEvents = chartData.reduce((sum, item) => sum + item.count, 0);
  const peak = chartData.reduce((max, item) => Math.max(max, item.count), 0);

  return (
    <div className="rounded-xl bg-[oklch(0.2_0.016_240)] p-4 shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-inter-bold">Traffic density</h2>
          <p className="mt-1 text-xs text-[oklch(0.7_0.018_240)]">
            Parsed events grouped by minute
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-md bg-[oklch(0.16_0.014_240)] px-2.5 py-1 text-[oklch(0.74_0.018_240)] shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]">
            <span className="tabular-nums">{totalEvents}</span> events
          </span>
          <span className="rounded-md bg-[oklch(0.16_0.014_240)] px-2.5 py-1 text-[oklch(0.74_0.018_240)] shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]">
            peak <span className="tabular-nums">{peak}</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={264}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="2 4" stroke="oklch(0.32 0.018 240)" vertical={false} />
          <XAxis
            dataKey="time"
            tick={{fill: "oklch(0.67 0.018 240)", fontSize: 11}}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{fill: "oklch(0.67 0.018 240)", fontSize: 11}}
            axisLine={false}
            tickLine={false}
            width={34}
          />
          <Tooltip
            cursor={{fill: "oklch(0.35 0.04 205 / 0.24)"}}
            contentStyle={{
              backgroundColor: "oklch(0.18 0.014 240)",
              border: "1px solid oklch(0.38 0.018 240)",
              borderRadius: "10px",
              color: "oklch(0.94 0.006 240)"
            }}
            labelStyle={{color: "oklch(0.94 0.006 240)"}}
          />
          <Bar dataKey="count" fill="oklch(0.72 0.12 205)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
