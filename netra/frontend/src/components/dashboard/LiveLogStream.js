"use client";

import {useState, useContext} from "react";
import {FiChevronDown, FiRefreshCw} from "react-icons/fi";
import {LogDataContext} from "@/src/components/contexts/LogDataProvider";

export default function LiveLogStream() {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const { logTableData } = useContext(LogDataContext);
  const displayLogs = logTableData || [];
  console.log("displayed logs:", displayLogs)
  const loading = false;

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
            onClick={() => {}}
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
              <th className="text-left py-3 px-4 text-slate-400 font-medium">SOURCE IP</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">DESTINATION IP</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">PROTOCOL</th>
              <th className="text-left py-3 px-4 text-slate-400 font-medium">EVENT TYPE</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs && displayLogs.length > 0 ? (
              displayLogs.map((log, index) => (
                <tr
                  key={log.id || index}
                  className={`border-b border-slate-700/30 hover:bg-slate-700/30`}
                >
                  <td className="py-3 px-4">
                    <code className="text-xs text-slate-300">{log.timestamp}</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-slate-300">{log.sourceIp}</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-slate-300">{log.destIp}</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-slate-300">{log.protocol}</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-slate-400">{log.eventType}</code>
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
