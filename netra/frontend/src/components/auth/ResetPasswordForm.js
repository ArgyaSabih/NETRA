"use client";

import {useMemo, useState} from "react";
import Link from "next/link";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const inputClass =
  "min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.1)] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15";

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
    <div className="mx-auto w-full max-w-md space-y-7">
      <div>
        <p className="text-sm font-inter-semibold tracking-[0.18em] text-emerald-700 uppercase">Account recovery</p>
        <h1 className="mt-3 text-4xl tracking-tight text-slate-950 font-inter-bold">Reset password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Choose a new password for your account.</p>
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
        {[
          ["password", "New password", password, setPassword, showPassword, setShowPassword],
          [
            "confirmPassword",
            "Confirm password",
            confirmPassword,
            setConfirmPassword,
            showConfirmPassword,
            setShowConfirmPassword
          ]
        ].map(([id, label, value, setValue, visible, setVisible]) => (
          <div key={id}>
            <label htmlFor={id} className="mb-2 block text-sm text-slate-900 font-inter-semibold">
              {label}
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                id={id}
                name={id}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={id === "password" ? "Enter new password" : "Confirm new password"}
                className={`${inputClass} pr-12`}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/70 hover:text-slate-700"
                aria-label={visible ? "Hide password" : "Show password"}
              >
                {visible ? <IoMdEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          disabled={loading || tokenMissing}
          className="min-h-12 w-full rounded-2xl bg-slate-950 px-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] cursor-pointer font-inter-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        <Link href="/auth/login" className="text-slate-950 font-inter-semibold hover:underline">
          Back to login
        </Link>
      </p>
    </div>
  );
}
