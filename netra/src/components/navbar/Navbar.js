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
          <div className="flex items-center gap-4">
            <Image src="/assets/favicon/favicon.svg" alt="NETRA Logo" width={32} height={32} />
            <span className="text-xl text-black font-inter-bold">NETRA</span>
          </div>

          {/* Navigation Links */}
          <div className="items-center hidden gap-8 cursor-pointer font-inter-semibold lg:flex">
            <Link href="#about" className="text-sm text-gray-700 transition hover:text-black hover:scale-105">
              About Us
            </Link>
            <Link
              href="#partner"
              className="text-sm text-gray-700 transition hover:text-black hover:scale-105"
            >
              Partner
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-700 transition hover:text-black hover:scale-105"
            >
              Pricing
            </Link>
            <Link href="#api" className="text-sm text-gray-700 transition hover:text-black hover:scale-105">
              API
            </Link>
            <Link
              href="#setting"
              className="text-sm text-gray-700 transition hover:text-black hover:scale-105"
            >
              Setting
            </Link>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden px-6 py-2 text-sm text-white transition bg-gray-600 rounded cursor-pointer font-inter-medium lg:block hover:bg-gray-700">
              Login
            </button>
            <button className="hidden px-6 py-2 text-sm text-white transition bg-gray-600 rounded cursor-pointer font-inter-medium lg:block hover:bg-gray-700">
              Sign Up
            </button>
            <HamburgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`bg-white border-t border-gray-200 cursor-pointer lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-4 space-y-3 font-inter-semibold">
            <Link
              href="#about"
              className="block text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="#partner"
              className="block text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              Partner
            </Link>
            <Link
              href="#pricing"
              className="block text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#api"
              className="block text-sm text-gray-700 transition hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              API
            </Link>
            <Link
              href="#setting"
              className="block text-sm text-gray-700 transition hover:text-black"
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
