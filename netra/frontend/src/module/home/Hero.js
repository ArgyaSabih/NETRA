"use client";

import Image from "next/image";
import Link from "next/link";
import DefaultLayout from "@/src/components/layout/DefaultLayout";
import {FiActivity, FiArrowRight, FiShield, FiZap} from "react-icons/fi";

export default function Hero() {
  return (
    <DefaultLayout className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#e8fff6_0,#f6f8fb_34%,#ffffff_72%)]">
      <section className="px-4 pt-28 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col gap-7">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 text-xs text-emerald-700 shadow-[0_10px_30px_rgba(15,23,42,0.08),inset_0_0_0_1px_rgba(16,185,129,0.18)] font-inter-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              AI-assisted network monitoring
            </div>

            <h1 className="max-w-3xl text-5xl leading-[1.02] tracking-tight text-slate-950 font-inter-bold md:text-6xl">
              Threat detection dashboard for modern network logs
            </h1>

            <p className="max-w-xl text-lg leading-8 text-slate-600 font-inter-regular">
              Detect threats in real-time with our advanced SIEM platform. Analyze logs, visualize traffic,
              and secure your infrastructure instantly with AI-driven insights.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/sign-up"
                role="button"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-white shadow-[0_18px_45px_rgba(15,23,42,0.22)] font-inter-semibold hover:bg-slate-800"
              >
                Get Started
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/auth/login"
                role="button"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-6 py-3 text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.08),inset_0_0_0_1px_rgba(15,23,42,0.1)] font-inter-semibold hover:bg-slate-50"
              >
                Login
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3 pt-2">
              {[
                ["Real-time", "Log analysis"],
                ["AI", "Risk scoring"],
                ["Private", "AI service"]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl bg-white px-4 py-3 shadow-[0_12px_30px_rgba(15,23,42,0.07),inset_0_0_0_1px_rgba(15,23,42,0.06)]"
                >
                  <p className="text-sm text-slate-950 font-inter-bold">{label}</p>
                  <p className="mt-1 text-xs text-slate-500">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-emerald-200/60 via-sky-200/40 to-orange-200/50 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-4 shadow-[0_28px_80px_rgba(15,23,42,0.3)]">
              <div className="rounded-[1.5rem] bg-[#0b1220] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white">
                      <Image src="/assets/favicon/favicon.svg" alt="NETRA logo" width={28} height={28} />
                    </div>
                    <div>
                      <p className="text-sm text-white font-inter-bold">NETRA SOC</p>
                      <p className="text-xs text-slate-400">Network threat overview</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    [FiShield, "Health", "98%", "text-emerald-300"],
                    [FiZap, "Threats", "07", "text-orange-300"],
                    [FiActivity, "Events", "1.2k", "text-sky-300"]
                  ].map(([Icon, label, value, color]) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-white/[0.06] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    >
                      <Icon className={`mb-4 h-5 w-5 ${color}`} />
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-2xl text-white tabular-nums font-inter-bold">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl bg-white/[0.06] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-white font-inter-semibold">Traffic pattern</p>
                    <p className="text-xs text-slate-400">last 24h</p>
                  </div>
                  <div className="flex h-32 items-end gap-2">
                    {[38, 52, 44, 72, 58, 86, 64, 92, 70, 76, 54, 82].map((height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-sky-500 to-emerald-300"
                        style={{height: `${height}%`}}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-red-500/10 p-4 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.2)]">
                  <p className="text-sm text-red-200 font-inter-semibold">Potential anomaly detected</p>
                  <p className="mt-1 text-xs text-red-200/70">High-volume request pattern from unknown source.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
