"use client";

import Link from "next/link";
import Image from "next/image";
import {useSession, signOut} from "next-auth/react";
import {FiActivity, FiUpload, FiLogOut} from "react-icons/fi";

const navItems = [
  {icon: FiActivity, label: "Dashboard", href: "/dashboard", id: "dashboard"},
  {icon: FiUpload, label: "Upload Log", href: "/upload-log", id: "upload-log"}
];

export default function Sidebar({activePage, sidebarOpen}) {
  const {data: session} = useSession();

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-40
        w-[17rem] border-r border-[oklch(0.34_0.018_240)] bg-[oklch(0.18_0.015_240)]
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <div className="p-4">
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-[oklch(0.21_0.016_240)] p-3 shadow-[inset_0_0_0_1px_oklch(0.34_0.018_240)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[oklch(0.93_0.01_160)]">
            <Image src="/assets/favicon/favicon.svg" alt="NETRA logo" width={28} height={28} />
          </div>
          <div>
            <span className="block text-base tracking-tight font-inter-bold">NETRA</span>
            <span className="text-xs text-[oklch(0.68_0.018_240)]">Security workspace</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <Link
                key={i}
                href={item.href}
                className={`
                  flex min-h-10 w-full items-center gap-3 rounded-lg px-3 py-2 text-left
                  ${
                    isActive
                      ? "bg-[oklch(0.78_0.14_155)] text-[oklch(0.16_0.014_240)]"
                      : "text-[oklch(0.7_0.018_240)] hover:bg-[oklch(0.23_0.018_240)] hover:text-[oklch(0.94_0.006_240)]"
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="absolute left-0 right-0 p-4 bottom-24">
        <button
          onClick={() => signOut({callbackUrl: "/auth/login"})}
          className="flex min-h-10 w-full items-center gap-3 rounded-lg bg-[oklch(0.22_0.035_25)] px-3 py-2 text-center text-[oklch(0.78_0.13_25)] shadow-[inset_0_0_0_1px_oklch(0.43_0.09_25)] cursor-pointer hover:bg-[oklch(0.25_0.045_25)]"
        >
          <FiLogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 space-y-3 border-t border-[oklch(0.34_0.018_240)] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[oklch(0.21_0.016_240)] p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[oklch(0.78_0.14_155)] text-sm text-[oklch(0.16_0.014_240)] font-inter-bold">
            {(session?.user?.name || session?.user?.email || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
            <p className="text-xs truncate text-[oklch(0.68_0.018_240)]">{session?.user?.email || ""}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
