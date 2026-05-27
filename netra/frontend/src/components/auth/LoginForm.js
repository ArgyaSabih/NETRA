"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

const inputClass =
  "min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-slate-950 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.1)] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15";
const errorInputClass = "shadow-[inset_0_0_0_1px_rgba(239,68,68,0.55)] focus:ring-red-500/15";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const hasShownVerifyAlert = useRef(false);
  const [formData, setFormData] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const verified = searchParams.get("verified");
  const errorParam = searchParams.get("error");
  const errorCode = searchParams.get("code");

  useEffect(() => {
    if (errorParam === "CredentialsSignin" && errorCode === "email_not_verified") {
      if (hasShownVerifyAlert.current) return;
      hasShownVerifyAlert.current = true;
    }
  }, [errorParam, errorCode]);

  const errorMessage = (() => {
    if (!errorParam) return null;
    if (errorParam === "CredentialsSignin") {
      if (errorCode === "email_not_verified") return "Please verify your email first.";
      return "Invalid email or password.";
    }
    return errorParam;
  })();

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
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard"
      });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({general: "An error occurred. Please try again."});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
      <div>
        <p className="text-sm font-inter-semibold tracking-[0.18em] text-emerald-700 uppercase">Welcome back</p>
        <h1 className="mt-3 text-4xl tracking-tight text-slate-950 font-inter-bold">Login to NETRA</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Use your verified account to continue.</p>
      </div>

      {verified && (
        <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.2)] font-inter-medium">
          Email verified. You can now log in with your account.
        </div>
      )}

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.18)] font-inter-medium">
          {errorMessage}
        </div>
      )}

      {errors.general && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-800 shadow-[inset_0_0_0_1px_rgba(239,68,68,0.18)] font-inter-medium">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-slate-900 font-inter-semibold">
            Email or username
          </label>
          <input
            type="text"
            id="email"
            name="email"
            autoComplete="username"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email or username"
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
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
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
        </div>

        <div className="flex justify-end">
          <Link href="/auth/forgot-password" className="text-sm text-slate-600 hover:text-slate-950 font-inter-semibold">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-2xl bg-slate-950 px-5 text-white shadow-[0_18px_45px_rgba(15,23,42,0.2)] cursor-pointer font-inter-semibold hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        No account yet?{" "}
        <Link href="/auth/sign-up" className="text-slate-950 font-inter-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
