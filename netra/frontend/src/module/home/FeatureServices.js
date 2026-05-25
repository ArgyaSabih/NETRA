"use client";
import Image from "next/image";
import DefaultLayout from "@/src/components/layout/DefaultLayout";

export default function FeatureServices() {
  const features = [
    {
      id: 1,
      title: "AI Log Visualization",
      description:
        "Get a real-time overview of your network health with AI-powered dashboards — track total alerts, active threats, system health, and AI risk scores at a glance.",
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
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
            OUR FEATURES AND SERVICES
          </p>
          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Transforming Network Security with
            <br />
            AI-Powered Detection
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-lg"
            >
              {/* Feature Image */}
              <div className="relative w-full h-64">
                <Image src={feature.image} alt={feature.alt} fill className="object-cover" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}
