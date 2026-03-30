import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen font-sans bg-zinc-50 dark:bg-black">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl min-h-screen gap-8 px-16 py-32 bg-white dark:bg-black">
        <Image src="/assets/favicon/favicon.svg" alt="Next.js logo" width={150} height={100} priority />
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            NETRA
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A web-based and AI-powered SIEM with modern monitoring dashboard. Explore our{" "}
          </p>
        </div>
      </main>
    </div>
  );
}
