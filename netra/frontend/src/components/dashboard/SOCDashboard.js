"use client";

import {useState, useContext, useEffect} from "react";
import Link from "next/link";
import StatCard from "./StatCard";
import NetworkTrafficChart from "./NetworkTrafficChart";
import ThreatCategories from "./ThreatCategories";
import LiveLogStream from "./LiveLogStream";
import Sidebar from "@/src/components/shared/Sidebar";
import {
  FiActivity,
  FiAlertTriangle,
  FiCpu,
  FiMenu,
  FiRadio,
  FiShield,
  FiUpload,
  FiX,
  FiZap
} from "react-icons/fi";
import {useDashboardData} from "@/src/hooks/useDashboard";
import {LogDataContext} from "@/src/components/contexts/LogDataProvider";
import {LogChartContext} from "@/src/components/contexts/ChartDataProvider";

export default function SOCDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {data: dashboardMetrics} = useDashboardData();
  const {logTableData, setLogsFromUpload} = useContext(LogDataContext);
  const {logTableData: chartTableData, setChartfromUpload} = useContext(LogChartContext);
  const visibleEvents = logTableData?.length || dashboardMetrics?.tableData?.length || 0;
  const fullEvents = chartTableData?.length || dashboardMetrics?.fullTable?.length || visibleEvents;
  const lastUpdated = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date());
  const activeThreats = Number(dashboardMetrics?.activeThreats || 0);
  const operatingState = activeThreats > 0 ? "Attention required" : "Nominal";
  const signalItems = [
    {label: "Ingest", value: `${fullEvents} rows`, icon: FiRadio},
    {label: "Model", value: "Anomaly scan", icon: FiCpu},
    {label: "Review", value: activeThreats > 0 ? "Open cases" : "Clear queue", icon: FiShield}
  ];

  // Rehydrate in-memory contexts from persisted dashboard data after a refresh,
  // so LiveLogStream/Charts don't go blank when only StatCards survive.
  useEffect(() => {
    if (!dashboardMetrics?.hasData) return;
    if (dashboardMetrics.tableData && (!logTableData || logTableData.length === 0)) {
      setLogsFromUpload(dashboardMetrics.tableData);
    }
    if (dashboardMetrics.fullTable && (!chartTableData || chartTableData.length === 0)) {
      setChartfromUpload(dashboardMetrics.fullTable);
    }
  }, [
    dashboardMetrics?.hasData,
    dashboardMetrics?.tableData,
    dashboardMetrics?.fullTable,
    logTableData,
    chartTableData,
    setLogsFromUpload,
    setChartfromUpload
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-[oklch(0.16_0.014_240)] text-[oklch(0.96_0.006_240)]">
      <Sidebar activePage="dashboard" sidebarOpen={sidebarOpen} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="border-b border-[oklch(0.34_0.018_240)] bg-[oklch(0.19_0.015_240)] px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-lg md:hidden hover:bg-[oklch(0.24_0.018_240)]"
                aria-label="Toggle navigation"
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <div>
                <p className="text-[11px] font-inter-semibold tracking-[0.2em] text-[oklch(0.72_0.1_160)] uppercase">
                  Security operations center
                </p>
                <h1 className="mt-0.5 text-lg tracking-tight font-inter-bold">Network threat dashboard</h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-xs text-[oklch(0.7_0.018_240)] md:flex">
              <span className="h-2 w-2 rounded-full bg-[oklch(0.74_0.16_152)]" />
              Updated <span className="tabular-nums">{lastUpdated}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[oklch(0.16_0.014_240)]">
          {!dashboardMetrics.hasData ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
              <div className="max-w-xl rounded-xl bg-[oklch(0.2_0.016_240)] p-7 text-center shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[oklch(0.93_0.01_160)] text-[oklch(0.22_0.02_240)]">
                  <FiUpload size={28} />
                </div>
                <h2 className="mb-3 text-xl font-inter-bold">No log data loaded</h2>
                <p className="mb-6 text-sm leading-6 text-[oklch(0.74_0.018_240)]">
                  Upload a network log to populate alerts, traffic distribution, and event stream.
                </p>
                <Link
                  href="/upload-log"
                  role="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[oklch(0.78_0.14_155)] px-5 py-2.5 text-sm text-[oklch(0.17_0.018_240)] font-inter-semibold hover:bg-[oklch(0.84_0.13_155)]"
                >
                  <FiUpload size={18} />
                  Upload log
                </Link>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-[1440px] space-y-4 p-4 md:p-5">
              <section className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="rounded-xl bg-[oklch(0.2_0.016_240)] p-4 shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[oklch(0.68_0.018_240)]">
                        Current investigation
                      </p>
                      <h2 className="mt-1 text-2xl tracking-tight font-inter-bold">{operatingState}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                      {signalItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.label}
                            className="min-w-32 rounded-lg bg-[oklch(0.17_0.014_240)] px-3 py-2 shadow-[inset_0_0_0_1px_oklch(0.31_0.016_240)]"
                          >
                            <div className="flex items-center gap-2 text-[oklch(0.73_0.018_240)]">
                              <Icon size={14} />
                              <span>{item.label}</span>
                            </div>
                            <p className="mt-1 truncate text-[13px] text-[oklch(0.94_0.006_240)] tabular-nums">
                              {item.value}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Alerts, 24h"
                  value={`${dashboardMetrics.totalAlerts}`}
                  subtitle={`${visibleEvents} visible events`}
                  trend="up"
                  trendValue="+12%"
                  icon={FiAlertTriangle}
                  status="warning"
                />
                <StatCard
                  title="Active Threats"
                  value={`${dashboardMetrics.activeThreats}`}
                  subtitle={activeThreats > 0 ? "Manual review needed" : "No active cases"}
                  icon={FiZap}
                  status="critical"
                />
                <StatCard
                  title="System Health"
                  value={`${dashboardMetrics.systemHealth}%`}
                  subtitle="Frontend, backend, AI task"
                  trend="down"
                  trendValue="-2%"
                  icon={FiActivity}
                  status="success"
                />
                <StatCard
                  title="AI Risk Score"
                  value={dashboardMetrics.aiRiskScore}
                  subtitle="Isolation Forest output"
                  icon={FiShield}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.75fr)]">
                <div>
                  <NetworkTrafficChart />
                </div>
                <div>
                  <ThreatCategories />
                </div>
              </div>

              <LiveLogStream />
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}
