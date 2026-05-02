"use client";

import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";
import DefaultLayout from "../layout/DefaultLayout";
import {FaPhoneAlt} from "react-icons/fa";
import {IoMdMail} from "react-icons/io";
import {FaLocationDot} from "react-icons/fa6";

export default function Footer() {
  const router = useRouter();

  const goHomeTop = () => {
    const isAlreadyHome = typeof window !== "undefined" && window.location?.pathname === "/";
    if (!isAlreadyHome) router.push("/");
    setTimeout(() => {
      if (typeof window !== "undefined") window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }, 0);
  };

  return (
    <DefaultLayout className="w-full !py-8 bg-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 xl:gap-40 md:grid-cols-3">
          {/* Left Section - Logo and Description */}
          <div className="space-y-4 ">
            <div className="flex items-center gap-4">
              <Image src="/assets/favicon/favicon.svg" alt="NETRA Logo" width={32} height={32} />
              <span className="text-lg text-black font-inter-bold">NETRA</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 font-inter-regular">
              An AI-powered SIEM platform designed to enhance network security, accountability, and efficiency
              in threat management.
            </p>
            {/* Colored Circles */}
            <div className="flex gap-3 mt-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
          </div>

          {/* Middle Section - Pages */}
          <div className="space-y-4 px-0 md:px-[20%]">
            <h3 className="text-sm tracking-wide text-black uppercase font-inter-bold">Pages</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <button
                    type="button"
                    onClick={goHomeTop}
                    className="text-sm text-gray-600 transition cursor-pointer font-inter-regular hover:text-black"
                  >
                    About Us
                  </button>
                </Link>
              </li>
              <li>
                <Link
                  href="#feature"
                  className="text-sm text-gray-600 transition font-inter-regular hover:text-black"
                >
                  Feature
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Section - Contact */}
          <div className="space-y-4">
            <h3 className="text-sm tracking-wide text-black uppercase font-inter-bold">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FaPhoneAlt className="text-gray-600" />
                <span className="text-sm text-gray-600 font-inter-regular">(+62) 888-888-888</span>
              </li>
              <li className="flex items-start gap-3">
                <IoMdMail className="text-gray-600" />
                <span className="text-sm text-gray-600 font-inter-regular">netra@mail.ugm.ac.id</span>
              </li>
              <li className="flex items-start gap-3">
                <FaLocationDot className="text-gray-600" />
                <span className="text-sm text-gray-600 font-inter-regular">Sieman, Yogyakarta</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="pt-8 text-xs text-center text-gray-500 font-inter-regular">
          © 2026 NETRA. All rights reserved.
        </p>
      </div>
    </DefaultLayout>
  );
}
