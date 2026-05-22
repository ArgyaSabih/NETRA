"use client";

import {signOut} from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({callbackUrl: "/auth/login"})}
      className="px-4 py-2 text-white transition bg-gray-700 rounded-lg cursor-pointer font-inter-semibold hover:bg-gray-800"
    >
      Logout
    </button>
  );
}
