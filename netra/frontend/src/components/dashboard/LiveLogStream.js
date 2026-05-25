"use client";

import {useState, useContext} from "react";
import {FiChevronDown, FiRefreshCw} from "react-icons/fi";
import {LogDataContext} from "@/src/components/contexts/LogDataProvider";

export default function LiveLogStream() {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const {logTableData} = useContext(LogDataContext);
  const displayLogs = logTableData || [];
  console.log("displayed logs:", displayLogs);
  const loading = false;

  return (
    <div className="p-6 border rounded-lg border-slate-700/50 bg-slate-800/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Live Log Stream</h2>
        <div className="flex items-center gap-3"></div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 font-medium text-left text-slate-400">TIMESTAMP</th>
              <th className="px-4 py-3 font-medium text-left text-slate-400">SOURCE IP</th>
              <th className="px-4 py-3 font-medium text-left text-slate-400">DESTINATION IP</th>
              <th className="px-4 py-3 font-medium text-left text-slate-400">PROTOCOL</th>
              <th className="px-4 py-3 font-medium text-left text-slate-400">EVENT TYPE</th>
            </tr>
          </thead>
          <tbody>
            {displayLogs && displayLogs.length > 0 ? (
              displayLogs.map((log, index) => (
                <tr key={log.id || index} className={`border-b border-slate-700/30 hover:bg-slate-700/30`}>
                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-300">{log.timestamp}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-300">{log.sourceIp}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-xs text-slate-300">{log.destIp}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-slate-300">{log.protocol}</code>
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-slate-400">{log.eventType}</code>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                  {loading ? "Loading logs..." : "No logs available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-center text-slate-500">
        Showing last {displayLogs?.length || 0} events
      </div>
    </div>
  );
}
