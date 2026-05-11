import {useState, useEffect, useCallback} from "react";

export function useDashboardData() {
  const [data, setData] = useState({
    totalAlerts: 0,
    activeThreats: 0,
    systemHealth: 100,
    aiRiskScore: "N/A",
    hasData: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Polling setiap 30 detik
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {data, loading, error};
}

export function useThreatData() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const response = await fetch("/api/dashboard/threats");
        if (!response.ok) throw new Error("Failed to fetch threat data");
        const result = await response.json();
        setThreats(result.threats || []);
      } catch (err) {
        console.error("Error fetching threat data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
    // Polling setiap 60 detik
    const interval = setInterval(fetchThreats, 60000);
    return () => clearInterval(interval);
  }, []);

  return {threats, loading, error};
}

export function useLiveLogsData(limit = 10) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/logs?limit=${limit}`);
      if (!response.ok) throw new Error("Failed to fetch logs");
      const result = await response.json();
      setLogs(result.logs);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLogs();
    // Polling setiap 10 detik untuk live updates
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [fetchLogs]);

  return {logs, loading, error, refetch: fetchLogs};
}

export function useNetworkTrafficData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateData = () => {
      return Array.from({length: 24}, (_, i) => ({
        hour: `${String(i).padStart(2, "0")}:00`,
        normal: Math.floor(Math.random() * 800 + 200),
        suspicious: Math.floor(Math.random() * 300 + 50),
        critical: Math.floor(Math.random() * 100 + 10)
      }));
    };

    setData(generateData());
    setLoading(false);

    // Update data setiap 5 menit
    const interval = setInterval(() => {
      setData(generateData());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  return {data, loading};
}
