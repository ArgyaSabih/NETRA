"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";

export default function SignUpForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const response = await fetch("/api/auth-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({general: data.error || "Email already registered."});
          return;
        }
        if (data.error) {
          setErrors({general: data.error});
        } else {
          setErrors({general: "Sign up failed. Please try again."});
        }
        return;
      }

      // Success - show verification message
      setSuccessMessage(data.message);

      // Redirect after delay or show success screen
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
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl text-black font-inter-bold">Get Started Now!</h1>
        <p className="text-sm text-gray-600 font-inter-regular">Enter your data to create your account</p>
      </div>

      {successMessage && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <p className="text-sm text-green-800 font-inter-medium">{successMessage}</p>
        </div>
      )}

      {errors.general && (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-800 font-inter-medium">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block mb-2 text-sm text-black font-inter-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={`w-full px-4 py-2 border text-black rounded-lg font-inter-regular placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading}
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block mb-2 text-sm text-black font-inter-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full px-4 py-2 border text-black rounded-lg font-inter-regular placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600 transition ${
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
              value={formData.password}
              onChange={handleChange}
              autoComplete="password"
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
          <p className="mt-1 ml-2 text-xs text-gray-400 font-inter-regular">
            <sup>*</sup>At least 8 characters, 1 uppercase, 1 lowercase, 1 number
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white transition bg-gray-700 rounded-lg cursor-pointer font-inter-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-sm text-center text-gray-600 font-inter-regular">
        Have an Account already?{" "}
        <Link href="/auth/login" className="text-gray-700 font-inter-semibold hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
