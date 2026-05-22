"use client";

import {useRouter} from "next/navigation";
import Image from "next/image";

export default function AuthLayout({children, heading}) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 md:p-8">
      <div className="flex w-full max-w-4xl overflow-hidden bg-white rounded-lg shadow-lg">
        {/* Left Side - Dark Section */}
        <div className="relative items-center justify-center hidden bg-gray-700 md:flex md:w-1/2">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute flex items-center gap-2 text-sm text-white transition cursor-pointer top-6 left-6 font-inter-medium hover:opacity-80"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Illustration */}
          <div className="text-center">
            <div className="flex items-center justify-center w-32 h-32 mb-8 border-4 border-gray-500 rounded-full">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="relative flex flex-col justify-center w-full p-8 md:w-1/2 md:p-12">
          {/* Mobile Back Button */}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 mb-6 text-sm text-gray-700 transition cursor-pointer md:hidden font-inter-medium hover:opacity-80"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}
