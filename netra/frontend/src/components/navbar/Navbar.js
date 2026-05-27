"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useSession, signOut} from "next-auth/react";
import HamburgerButton from "./HamburgerButton";
import {useRouter} from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {data: session, status} = useSession();
  const router = useRouter();

  const goHomeTop = () => {
    setIsOpen(false);
    const isAlreadyHome = typeof window !== "undefined" && window.location?.pathname === "/";
    if (!isAlreadyHome) router.push("/");
    setTimeout(() => {
      if (typeof window !== "undefined") window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }, 0);
  };

  return (
    <nav className="fixed top-0 z-[999] w-full border-b border-white/70 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex min-h-10 items-center gap-3 rounded-xl pr-2" href="/" onClick={goHomeTop}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
              <Image src="/assets/favicon/favicon.svg" alt="NETRA Logo" width={26} height={26} />
            </span>
            <span className="text-xl tracking-tight text-slate-950 font-inter-bold">NETRA</span>
          </Link>

          {/* Navigation Links and Buttons */}
          <div className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="items-center hidden gap-6 md:gap-8 font-inter-semibold sm:flex">
              <Link href="/">
                <button
                  onClick={goHomeTop}
                  className="min-h-10 rounded-xl px-3 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 hover:text-slate-950"
                >
                  About Us
                </button>
              </Link>
              <button
                onClick={() => router.push("/#feature")}
                className="min-h-10 rounded-xl px-3 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 hover:text-slate-950"
              >
                Feature
              </button>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              {status === "loading" ? (
                <div className="hidden sm:block w-[6.5rem] px-6 py-2 text-sm bg-gray-200 rounded animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard"
                    className="hidden min-h-10 rounded-xl px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950 sm:block font-inter-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({redirect: true, callbackUrl: "/"})}
                    className="hidden min-h-10 w-[6.5rem] rounded-xl bg-slate-950 px-6 py-2 text-sm text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] cursor-pointer font-inter-medium sm:block hover:bg-slate-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/sign-up"
                    className="hidden min-h-10 w-[6.5rem] rounded-xl bg-white px-6 py-2 text-center text-sm text-slate-700 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.12)] cursor-pointer font-inter-medium sm:block hover:bg-slate-50 hover:text-slate-950"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/auth/login"
                    className="hidden min-h-10 w-[6.5rem] rounded-xl bg-slate-950 px-6 py-2 text-center text-sm text-white shadow-[0_10px_24px_rgba(15,23,42,0.18)] cursor-pointer font-inter-medium sm:block hover:bg-slate-800"
                  >
                    Login
                  </Link>
                </>
              )}
              <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden border-t border-slate-200 bg-white cursor-pointer sm:hidden transition-[max-height,opacity] duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-3 text-center font-inter-semibold">
            <button
              type="button"
              className="block min-h-10 w-full rounded-xl py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              onClick={goHomeTop}
            >
              About Us
            </button>
            <Link
              href="#feature"
              className="block min-h-10 rounded-xl py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              onClick={() => setIsOpen(false)}
            >
              Feature
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block min-h-10 rounded-xl py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({redirect: true, callbackUrl: "/"});
                  }}
                  className="min-h-10 w-full rounded-xl bg-slate-950 px-6 py-2 text-sm font-medium text-white cursor-pointer hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-up"
                  className="block min-h-10 w-full rounded-xl bg-slate-950 px-6 py-2 text-sm font-medium text-white cursor-pointer hover:bg-slate-800"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="block min-h-10 w-full rounded-xl bg-white px-6 py-2 text-sm font-medium text-slate-800 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.12)] cursor-pointer hover:bg-slate-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
