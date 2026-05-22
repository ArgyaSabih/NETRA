"use client";

import DefaultLayout from "@/src/components/layout/DefaultLayout";

export default function Hero() {
  return (
    <DefaultLayout className="bg-white">
      <section className="px-4 pt-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl leading-tight text-black font-inter-bold md:text-5xl">
              Next-Gen AI-Powered
              <br />
              Network Security
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-gray-600 font-inter-regular">
              Detect threats in real-time with our advanced SIEM platform. Analyze logs, visualize traffic,
              and secure your infrastructure instantly with AI-driven insights.
            </p>

            <div>
              <button className="px-6 py-3 text-white transition bg-gray-600 rounded cursor-pointer font-inter-medium hover:bg-gray-700">
                Get Started
              </button>
            </div>
          </div>

          {/* Right Image Placeholder */}
          <div className="flex items-center justify-center">
            <div className="w-full bg-gray-400 rounded-lg aspect-video"></div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
