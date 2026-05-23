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
    <nav className="fixed top-0 z-[999] w-full bg-white border-b shadow-md border-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex items-center gap-4" href="/" onClick={goHomeTop}>
            <Image src="/assets/favicon/favicon.svg" alt="NETRA Logo" width={32} height={32} />
            <span className="text-xl text-black font-inter-bold">NETRA</span>
          </Link>

          {/* Navigation Links and Buttons */}
          <div className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="items-center hidden gap-6 md:gap-8 font-inter-semibold sm:flex">
              <Link href="/">
                <button
                  onClick={goHomeTop}
                  className="text-sm text-gray-700 transition cursor-pointer hover:text-black hover:scale-105"
                >
                  About Us
                </button>
              </Link>
              <button
                onClick={() => router.push("/#feature")}
                className="text-sm text-gray-700 transition cursor-pointer hover:text-black hover:scale-105"
              >
                Feature
              </button>
              <button
                onClick={() => router.push("/#setting")}
                className="text-sm text-gray-700 transition cursor-pointer hover:text-black hover:scale-105"
              >
                Setting
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
                    className="hidden px-4 py-2 text-sm text-gray-700 transition hover:text-black sm:block font-inter-medium"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({redirect: true, callbackUrl: "/"})}
                    className="hidden w-[6.5rem] px-6 py-2 text-sm text-white transition-all duration-300 bg-gray-600 rounded cursor-pointer font-inter-medium sm:block hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth/sign-up"
                    className="hidden w-[6.5rem] px-6 py-2 text-sm text-center text-gray-700 transition-all duration-300 bg-white border-gray-700 border-1 rounded cursor-pointer font-inter-medium sm:block hover:text-black hover:border-black"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/auth/login"
                    className="hidden w-[6.5rem] px-6 py-2 text-sm text-center text-white hover:border-black border-1 transition-all duration-300 bg-gray-600 rounded cursor-pointer font-inter-medium sm:block hover:bg-gray-700"
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
          className={`bg-white border-t border-gray-200 cursor-pointer sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-3 text-center font-inter-semibold">
            <button
              type="button"
              className="block w-full py-1 text-sm text-gray-700 transition hover:text-black"
              onClick={goHomeTop}
            >
              About Us
            </button>
            <Link
              href="#feature"
              className="block py-1 text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              Feature
            </Link>
            <Link
              href="#setting"
              className="block py-1 text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              Setting
            </Link>
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm font-medium text-gray-700 transition hover:text-black"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({redirect: true, callbackUrl: "/"});
                  }}
                  className="w-full px-6 py-2 text-sm font-medium text-white transition bg-gray-600 rounded cursor-pointer hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/sign-up"
                  className="block w-full px-6 py-2 text-sm font-medium text-white transition bg-gray-600 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
                <Link
                  href="/auth/login"
                  className="block w-full px-6 py-2 text-sm font-medium text-white transition bg-gray-600 rounded cursor-pointer hover:bg-gray-700"
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
