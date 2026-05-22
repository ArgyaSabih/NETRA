"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

export default function ResetPasswordForm({token}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tokenMissing = useMemo(() => !token || token.length < 10, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (tokenMissing) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({token, password})
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Failed to reset password.");
        return;
      }

      setMessage("Password updated. Please log in with your new password.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Reset password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl text-black font-inter-bold">Reset Password</h1>
        <p className="text-sm text-gray-600 font-inter-regular">Choose a new password for your account.</p>
      </div>

      {message && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <p className="text-sm text-green-800 font-inter-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-800 font-inter-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block mb-2 text-sm text-black font-inter-semibold">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border text-black rounded-lg font-inter-regular placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition border-gray-300"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 -translate-y-1/2 cursor-pointer right-3 top-1/2 hover:text-gray-600"
            >
              {showPassword ? <IoMdEye className="w-6 h-6" /> : <IoMdEyeOff className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block mb-2 text-sm text-black font-inter-semibold">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border text-black rounded-lg font-inter-regular placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition border-gray-300"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute text-gray-400 -translate-y-1/2 cursor-pointer right-3 top-1/2 hover:text-gray-600"
            >
              {showConfirmPassword ? <IoMdEye className="w-6 h-6" /> : <IoMdEyeOff className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || tokenMissing}
          className="w-full py-2 text-white transition bg-gray-700 rounded-lg cursor-pointer font-inter-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 font-inter-regular">
        <Link href="/auth/login" className="text-gray-700 font-inter-semibold hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
