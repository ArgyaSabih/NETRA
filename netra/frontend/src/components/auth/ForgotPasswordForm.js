"use client";

import {useState} from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email})
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Failed to request password reset.");
        return;
      }

      setMessage(data?.message || "If an account exists, a reset link has been sent.");
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
      <div>
        <p className="text-sm font-inter-semibold tracking-[0.18em] text-emerald-700 uppercase">Account recovery</p>
        <h1 className="mt-3 text-4xl tracking-tight text-slate-950 font-inter-bold">Forgot password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Enter your email and we will send you a reset link.</p>
      </div>

      {message && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)] font-inter-medium">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.18)] font-inter-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-slate-900 font-inter-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.1)] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-2xl bg-slate-950 px-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] cursor-pointer font-inter-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Remember your password?{" "}
        <Link href="/auth/login" className="text-slate-950 font-inter-semibold hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
