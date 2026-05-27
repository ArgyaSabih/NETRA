"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const inputClass =
  "min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.1)] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15";
const errorInputClass = "shadow-[inset_0_0_0_1px_rgba(239,68,68,0.55)] focus:ring-red-500/15";

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({username: "", email: "", password: ""});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
    if (errors[name]) setErrors((prev) => ({...prev, [name]: ""}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch("/api/auth-signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({general: data.error || "Email already registered."});
          return;
        }
        setErrors({general: data.error || "Sign up failed. Please try again."});
        return;
      }

      setSuccessMessage(data.message);

      setTimeout(() => {
        router.push(`/auth/verify-pending?email=${encodeURIComponent(formData.email)}`);
      }, 2000);
    } catch (error) {
      console.error("Sign up error:", error);
      setErrors({general: "An error occurred. Please try again."});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
      <div>
        <p className="text-sm font-inter-semibold tracking-[0.18em] text-emerald-700 uppercase">Create account</p>
        <h1 className="mt-3 text-4xl tracking-tight text-slate-950 font-inter-bold">Start with NETRA</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Verify your email, then upload logs for AI-assisted threat review.
        </p>
      </div>

      {successMessage && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)] font-inter-medium">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.18)] font-inter-medium">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="username" className="mb-2 block text-sm text-slate-900 font-inter-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className={`${inputClass} ${errors.username ? errorInputClass : ""}`}
            disabled={loading}
          />
          {errors.username && <p className="mt-2 text-xs text-red-500">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-slate-900 font-inter-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`${inputClass} ${errors.email ? errorInputClass : ""}`}
            disabled={loading}
          />
          {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-slate-900 font-inter-semibold">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Enter your password"
              className={`${inputClass} pr-12 ${errors.password ? errorInputClass : ""}`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-200/70 hover:text-slate-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoMdEye className="h-5 w-5" /> : <IoMdEyeOff className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password}</p>}
          <p className="mt-2 text-xs leading-5 text-slate-500">
            At least 8 characters, 1 uppercase, 1 lowercase, and 1 number.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-2xl bg-slate-950 px-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] cursor-pointer font-inter-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-slate-950 font-inter-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
