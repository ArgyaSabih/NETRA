"use client";

import {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {signIn} from "next-auth/react";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const hasShownVerifyAlert = useRef(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
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
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl text-black font-inter-bold">Welcome Back!</h1>
        <p className="text-sm text-gray-600 font-inter-regular">Fill your account information</p>
      </div>

      {verified && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <p className="text-sm text-green-800 font-inter-medium">
            ✓ Email verified! You can now log in with your account.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-800 font-inter-medium">{errorMessage}</p>
        </div>
      )}

      {errors.general && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-800 font-inter-medium">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm text-black font-inter-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-2 border rounded-lg text-black font-inter-regular placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block mb-2 text-sm text-black font-inter-semibold">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              autoComplete="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border text-black rounded-lg font-inter-regular placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute text-gray-400 -translate-y-1/2 cursor-pointer right-3 top-1/2 hover:text-gray-600"
            >
              {showPassword ? <IoMdEye className="w-6 h-6" /> : <IoMdEyeOff className="w-6 h-6" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
        </div>

        <div className="flex justify-end">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-gray-700 font-inter-semibold hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white transition bg-gray-700 rounded-lg cursor-pointer font-inter-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-sm text-center text-gray-600 font-inter-regular">
        Didn't have an Account?{" "}
        <Link href="/auth/sign-up" className="text-gray-700 font-inter-semibold hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
