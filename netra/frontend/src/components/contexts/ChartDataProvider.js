"use client";

import { createContext, useState, useCallback } from "react";

export const LogChartContext = createContext();

// Helper to transform AI service response to LiveLogStream format
const transformAIDataToLogs = (data) => {
  if (!data) return [];

  // data sendiri yang berupa JSON string
  const raw = typeof data === "string" ? JSON.parse(data) : data;

  if (!raw?.ts) return [];

  const indices = Object.keys(raw["ts"]);

  return indices.map((i) => ({
    timestamp: raw["ts"]?.[i]
    ? new Date(raw["ts"][i] * 1000).toISOString()  // × 1000 karena Unix = seconds
    : new Date().toISOString(),
    sourceIp: raw["id.orig_h"]?.[i] ?? "192.168.100.1",
    destIp: raw["id.resp_h"]?.[i] ?? "192.168.100.2",
    protocol: raw["proto"]?.[i] ?? "tcp",
    eventType: raw["prediction"]?.[i] ?? "Malicious",
  }));
};

export function LogChartProvider({ children }) {
  const [logTableData, setLogTableData] = useState([]);

  const setChartfromUpload = useCallback((tableData) => {
    const transformedLogs = transformAIDataToLogs(tableData);
    setLogTableData(transformedLogs);
  }, []);

  return (
    <LogChartContext.Provider value={{ logTableData, setChartfromUpload }}>
      {children}
    </LogChartContext.Provider>
  );
}
