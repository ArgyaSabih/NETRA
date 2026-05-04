"use client";
import DefaultLayout from "@/src/components/layout/DefaultLayout";

export default function FeatureServices() {
  const features = [
    {
      id: 1,
      title: "DDoS Detection",
      description:
        "AI-driven traffic analysis instantly flags and mitigates volumetric DDoS attacks, ensuring your services stay online."
    },
    {
      id: 2,
      title: "Bruteforce Prevention",
      description:
        "Detect and block repeated unauthorized access attempts with intelligent behavioral analysis."
    },
    {
      id: 3,
      title: "AI Log Analysis",
      description:
        "Automated parsing of system logs to identify anomalies and potential security breaches in real-time."
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
            AI-Powered Detection & Prevention
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="overflow-hidden transition-shadow duration-300 bg-white border border-gray-200 rounded-lg hover:shadow-lg"
            >
              {/* Image Placeholder */}
              <div className="w-full h-64 bg-gray-300"></div>

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
