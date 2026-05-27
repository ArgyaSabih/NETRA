"use client";

import Image from "next/image";
import DefaultLayout from "@/src/components/layout/DefaultLayout";
import {FiArrowUpRight} from "react-icons/fi";

export default function FeatureServices() {
  const features = [
    {
      id: 1,
      title: "AI Log Visualization",
      description:
        "Get a real-time overview of your network health with AI-powered dashboards, active threats, system health, and AI risk scores at a glance.",
      image: "/assets/featureService/ai_log_visualiztion.png",
      alt: "AI log visualization dashboard showing alerts, active threats, system health, and risk score"
    },
    {
      id: 2,
      title: "Live Log Stream",
      description:
        "Monitor every network event as it happens with a live-updating log stream that captures timestamps, source and destination IPs, protocols, and threat classifications.",
      image: "/assets/featureService/live_log_stream.png",
      alt: "Live log stream table showing real-time network traffic with source IP, destination IP, protocol, and event type"
    }
  ];

  return (
    <DefaultLayout id="feature" className="bg-white">
      <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.18em] text-emerald-700 uppercase">
            Features and services
          </p>
          <h2 className="mt-4 text-4xl tracking-tight text-slate-950 font-inter-bold md:text-5xl">
            Network visibility that feels built for incident review
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Upload logs, inspect traffic, and review AI classifications in one focused workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_20px_60px_rgba(15,23,42,0.09),inset_0_0_0_1px_rgba(15,23,42,0.08)] hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.13)]"
            >
              <div className="relative h-64 w-full overflow-hidden rounded-[1.25rem] bg-slate-100 outline outline-1 outline-black/10">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl text-slate-950 font-inter-bold">{feature.title}</h3>
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <FiArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
