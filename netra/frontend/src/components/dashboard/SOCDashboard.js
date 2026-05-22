"use client";

import {useState} from "react";
import Link from "next/link";
import StatCard from "./StatCard";
import NetworkTrafficChart from "./NetworkTrafficChart";
// import ThreatCategories from "./ThreatCategories";
import LiveLogStream from "./LiveLogStream";
import Sidebar from "@/src/components/shared/Sidebar";
import {FiAlertTriangle, FiZap, FiActivity, FiShield, FiMenu, FiX, FiUpload} from "react-icons/fi";
import {useDashboardData, useThreatData} from "@/src/hooks/useDashboard";

export default function SOCDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {data: dashboardMetrics} = useDashboardData();
  // const {threats} = useThreatData();

  return (
    <div className="flex h-screen overflow-hidden text-white bg-slate-950">
      <Sidebar activePage="dashboard" sidebarOpen={sidebarOpen} />

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

              {/* Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
                <div className="lg:col-span-1">
                  <NetworkTrafficChart />
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
