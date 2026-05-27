"use client";

import {useContext} from "react";
import {LogDataContext} from "@/src/components/contexts/LogDataProvider";

export default function LiveLogStream() {
  const {logTableData} = useContext(LogDataContext);
  const displayLogs = logTableData || [];
  const loading = false;
  const eventTone = (eventType = "") => {
    const normalized = eventType.toLowerCase();
    if (normalized.includes("malicious") || normalized.includes("threat")) {
      return "bg-[oklch(0.24_0.045_25)] text-[oklch(0.78_0.14_25)] shadow-[inset_0_0_0_1px_oklch(0.48_0.12_25)]";
    }
    if (normalized.includes("benign") || normalized.includes("clean")) {
      return "bg-[oklch(0.22_0.04_155)] text-[oklch(0.78_0.12_155)] shadow-[inset_0_0_0_1px_oklch(0.48_0.1_155)]";
    }
    return "bg-[oklch(0.22_0.018_240)] text-[oklch(0.76_0.018_240)] shadow-[inset_0_0_0_1px_oklch(0.36_0.018_240)]";
  };

  return (
    <div className="rounded-xl bg-[oklch(0.2_0.016_240)] p-4 shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-inter-bold">Event stream</h2>
          <p className="mt-1 text-xs text-[oklch(0.7_0.018_240)]">Latest parsed network events</p>
        </div>
        <span className="rounded-md bg-[oklch(0.16_0.014_240)] px-2.5 py-1 text-xs text-[oklch(0.74_0.018_240)] tabular-nums shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]">
          {displayLogs?.length || 0} events
        </span>
      </div>

      <div className="overflow-hidden rounded-lg shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-[oklch(0.17_0.014_240)]">
                <th className="px-3 py-2.5 text-left text-[11px] font-inter-semibold tracking-[0.14em] text-[oklch(0.66_0.018_240)]">
                  TIME
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-inter-semibold tracking-[0.14em] text-[oklch(0.66_0.018_240)]">
                  SOURCE
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-inter-semibold tracking-[0.14em] text-[oklch(0.66_0.018_240)]">
                  DESTINATION
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-inter-semibold tracking-[0.14em] text-[oklch(0.66_0.018_240)]">
                  PROTOCOL
                </th>
                <th className="px-3 py-2.5 text-left text-[11px] font-inter-semibold tracking-[0.14em] text-[oklch(0.66_0.018_240)]">
                  CLASSIFICATION
                </th>
              </tr>
            </thead>
            <tbody>
              {displayLogs && displayLogs.length > 0 ? (
                displayLogs.map((log, index) => (
                  <tr key={log.id || index} className="border-t border-[oklch(0.31_0.016_240)] hover:bg-[oklch(0.23_0.018_240)]">
                    <td className="px-3 py-2.5">
                      <code className="text-xs text-[oklch(0.78_0.018_240)] tabular-nums">{log.timestamp}</code>
                    </td>
                    <td className="px-3 py-2.5">
                      <code className="text-xs text-[oklch(0.86_0.01_240)] tabular-nums">{log.sourceIp}</code>
                    </td>
                    <td className="px-3 py-2.5">
                      <code className="text-xs text-[oklch(0.86_0.01_240)] tabular-nums">{log.destIp}</code>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-md bg-[oklch(0.23_0.035_205)] px-2 py-1 text-[11px] text-[oklch(0.78_0.1_205)]">
                        {log.protocol}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-md px-2 py-1 text-[11px] ${eventTone(log.eventType)}`}>
                        {log.eventType}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-10 text-center text-[oklch(0.66_0.018_240)]">
                    {loading ? "Loading logs..." : "No logs available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
