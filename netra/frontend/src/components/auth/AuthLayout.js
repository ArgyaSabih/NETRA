"use client";

import {useRouter} from "next/navigation";
import Image from "next/image";
import {FiArrowLeft} from "react-icons/fi";

export default function AuthLayout({children}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8fff6_0,#f6f8fb_38%,#ffffff_100%)] p-4 text-slate-950 md:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center md:min-h-[calc(100vh-4rem)]">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.16),inset_0_0_0_1px_rgba(15,23,42,0.08)] md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden min-h-[680px] overflow-hidden bg-slate-950 p-8 text-white md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.24),transparent_28%),radial-gradient(circle_at_75%_35%,rgba(56,189,248,0.2),transparent_26%),radial-gradient(circle_at_70%_80%,rgba(251,146,60,0.16),transparent_30%)]" />
            <button
              type="button"
              onClick={() => router.push("/")}
              className="relative z-10 inline-flex min-h-10 items-center gap-2 rounded-xl bg-white/10 px-3 text-sm text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/15 font-inter-medium"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back
            </button>

            <div className="relative z-10 flex h-full flex-col justify-center">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-white">
                <Image src="/assets/favicon/favicon.svg" alt="NETRA logo" width={40} height={40} />
              </div>
              <h1 className="max-w-sm text-4xl leading-tight tracking-tight font-inter-bold">
                Secure access for network incident review
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
                Sign in to upload logs, inspect AI classifications, and review threat activity.
              </p>
            </div>
          </div>

          <div className="relative flex min-h-[620px] flex-col justify-center p-6 sm:p-10 md:p-14">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mb-8 inline-flex min-h-10 w-fit items-center gap-2 rounded-xl bg-slate-100 px-3 text-sm text-slate-700 md:hidden font-inter-medium hover:bg-slate-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back
            </button>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
