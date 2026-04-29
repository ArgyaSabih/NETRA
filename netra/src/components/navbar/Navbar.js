"use client";

import {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import HamburgerButton from "./HamburgerButton";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-[999] w-full bg-white border-b shadow-md border-gray-200">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link className="flex items-center gap-4" href="#">
            <Image src="/assets/favicon/favicon.svg" alt="NETRA Logo" width={32} height={32} />
            <span className="text-xl text-black font-inter-bold">NETRA</span>
          </Link>

          {/* Navigation Links and Buttons */}
          <div className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="items-center hidden gap-6 md:gap-8 font-inter-semibold sm:flex">
              <Link
                href="#"
                className="text-sm text-gray-700 transition cursor-pointer hover:text-black hover:scale-105"
              >
                About Us
              </Link>
              <Link
                href="#feature"
                className="text-sm text-gray-700 transition cursor-pointer hover:text-black hover:scale-105"
              >
                Feature
              </Link>
              <Link
                href="#setting"
                className="text-sm text-gray-700 transition cursor-pointer hover:text-black hover:scale-105"
              >
                Setting
              </Link>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4">
              <button className="hidden w-[6.5rem] px-6 py-2 text-sm text-white transition bg-gray-600 rounded cursor-pointer font-inter-medium sm:block hover:bg-gray-700">
                Sign Up
              </button>
              <button className="hidden w-[6.5rem] px-6 py-2 text-sm text-white transition bg-gray-600 rounded cursor-pointer font-inter-medium sm:block hover:bg-gray-700">
                Login
              </button>
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
            <Link
              href="#"
              className="block py-1 text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
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
            <button className="w-full px-6 py-2 text-sm font-medium text-white transition bg-gray-600 rounded cursor-pointer hover:bg-gray-700">
              Sign Up
            </button>
            <button className="w-full px-6 py-2 text-sm font-medium text-white transition bg-gray-600 rounded cursor-pointer hover:bg-gray-700">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
