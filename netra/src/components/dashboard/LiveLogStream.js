"use client";

import {useState} from "react";
import {FiChevronDown, FiRefreshCw} from "react-icons/fi";
import {useLiveLogsData} from "@/src/hooks/useDashboard";

export default function LiveLogStream() {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const {logs: displayLogs, loading, refetch} = useLiveLogsData(4);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-6 rounded-lg border border-slate-700/50 bg-slate-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Live Log Stream</h2>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAutoScroll}
              onChange={(e) => setIsAutoScroll(e.target.checked)}
              className="rounded"
            />
            <span className="text-xs text-slate-400">AUTO-SCROLL ON</span>
          </label>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 hover:bg-slate-700/50 rounded-lg transition-all disabled:opacity-50 ${
              loading ? "animate-spin" : ""
            }`}
          >
            <FiRefreshCw size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left py-3 px-4 text-slate-400 font-medium">TIMESTAMP</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">SEVERITY</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">SOURCE IP</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">EVENT TYPE</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">MESSAGE</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs && displayLogs.length > 0 ? (
              displayLogs.map((log, index) => (
                <tr
                  key={log.id || index}
                  className={`border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors ${log.statusColor}`}
                >
                  <td className="py-3 px-4">
                    <code className="text-xs text-slate-300">
                      {typeof log.timestamp === "string"
                        ? new Date(log.timestamp).toLocaleString()
                        : log.timestamp}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${log.severityColor}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-slate-300">{log.sourceIp}</code>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-300">{log.eventType}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-400">{log.message}</span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                      {log.action}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-slate-400">
                  {loading ? "Loading logs..." : "No logs available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-center text-xs text-slate-500">
        Showing last {displayLogs?.length || 0} events • Real-time data from AI analysis
      </div>
    </div>
  );
}
