"use client";

import {useState} from "react";
import Link from "next/link";
import StatCard from "./StatCard";
import NetworkTrafficChart from "./NetworkTrafficChart";
import ThreatCategories from "./ThreatCategories";
import LiveLogStream from "./LiveLogStream";
import {FiAlertTriangle, FiZap, FiActivity, FiShield, FiMenu, FiX, FiUpload} from "react-icons/fi";
import {useDashboardData, useThreatData} from "@/src/hooks/useDashboard";

export default function SOCDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {data: dashboardMetrics} = useDashboardData();
  const {threats} = useThreatData();

  return (
    <div className="flex h-screen overflow-hidden text-white bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-slate-900 border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <span className="text-lg font-bold">NETRA</span>
          </div>

          <nav className="space-y-2">
            {[
              {icon: FiActivity, label: "Dashboard", href: "/dashboard", active: true},
              {icon: FiUpload, label: "Upload Log", href: "/upload-log", active: false}
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 rounded-lg
                    transition-all text-left
                    ${
                      item.active
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                        : "text-slate-400 hover:bg-slate-800"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-8 mt-8 border-t border-slate-800">
            <p className="mb-3 text-xs font-medium text-slate-500">CONFIGURATION</p>
            <nav className="space-y-2">
              {[
                {icon: FiShield, label: "Settings"},
                {icon: FiActivity, label: "Users"}
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    className="flex items-center w-full gap-3 px-4 py-2 text-left transition-all rounded-lg text-slate-400 hover:bg-slate-800"
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Username</p>
              <p className="text-xs truncate text-slate-400">Admin Role</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="px-6 py-4 border-b bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg md:hidden hover:bg-slate-800"
              >
                {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
              <h1 className="text-xl font-semibold">Security Operations Center</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="items-center hidden gap-2 text-sm sm:flex text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time AI Monitoring active • System Stable
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-slate-950">
          {!dashboardMetrics.hasData ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800">
                  <FiUpload size={32} className="text-slate-400" />
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-white">Dashboard Kosong</h2>
                <p className="max-w-md mb-6 text-slate-400">
                  Silahkan upload log terlebih dahulu untuk melihat data analisis keamanan jaringan Anda.
                </p>
                <Link
                  href="/upload-log"
                  className="inline-flex items-center gap-2 px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <FiUpload size={18} />
                  Upload Log Sekarang
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-6 md:p-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title="Total Alerts (24h)"
                  value={`${dashboardMetrics.totalAlerts}`}
                  subtitle="Avg 50/hour"
                  trend="up"
                  trendValue="+12%"
                  icon={FiAlertTriangle}
                  status="warning"
                />
                <StatCard
                  title="Active Threats"
                  value={`${dashboardMetrics.activeThreats}`}
                  subtitle="Requires attention"
                  icon={FiZap}
                  status="critical"
                />
                <StatCard
                  title="System Health"
                  value={`${dashboardMetrics.systemHealth}%`}
                  subtitle="All nodes operational"
                  trend="down"
                  trendValue="-2%"
                  icon={FiActivity}
                  status="success"
                />
                <StatCard
                  title="AI Risk Score"
                  value={dashboardMetrics.aiRiskScore}
                  subtitle="Score: 12/100"
                  icon={FiShield}
                />
              </div>

              {/* Charts and Logs */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <NetworkTrafficChart />
                </div>
                <div>
                  <ThreatCategories threats={threats} />
                </div>
              </div>

              {/* Live Log Stream */}
              <LiveLogStream />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
}
