"use client";

import Link from "next/link";
import {useSession, signOut} from "next-auth/react";
import {FiActivity, FiShield, FiUpload, FiLogOut} from "react-icons/fi";

const navItems = [
  {icon: FiActivity, label: "Dashboard", href: "/dashboard", id: "dashboard"},
  {icon: FiUpload, label: "Upload Log", href: "/upload-log", id: "upload-log"}
];

const configItems = [
  {icon: FiShield, label: "Settings"},
  {icon: FiActivity, label: "Users"}
];

export default function Sidebar({activePage, sidebarOpen}) {
  const {data: session} = useSession();

  return (
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
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <Link
                key={i}
                href={item.href}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 rounded-lg
                  transition-all text-left
                  ${
                    isActive
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
            {configItems.map((item, i) => {
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
      <div className="absolute left-0 right-0 p-6 bottom-20">
        <button
          onClick={() => signOut({callbackUrl: "/auth/login"})}
          className="flex items-center w-full gap-3 px-4 py-2 text-center text-white transition-colors bg-red-500 rounded-lg cursor-pointer hover:bg-red-600"
        >
          <FiLogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs truncate text-slate-400">{session?.user?.email || ""}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
