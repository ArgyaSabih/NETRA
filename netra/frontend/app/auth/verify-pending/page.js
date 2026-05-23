import Link from "next/link";

export const metadata = {
  title: "Verify Email | NETRA",
  description: "Verify your email to complete registration"
};

export default async function VerifyPendingPage({searchParams}) {
  const {email} = (await searchParams) ?? {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Check Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-2xl font-inter-bold text-black">Check Your Email!</h1>
          <p className="text-gray-600 font-inter-regular">We've sent a verification link to:</p>
          <p className="text-lg font-inter-semibold text-gray-800">{email ?? ""}</p>

          <div className="pt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-inter-regular">
              Please check your email and click the verification link to complete your registration. The link
              will expire in 24 hours.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <p className="text-sm text-gray-600 font-inter-regular">Didn't receive the email?</p>
            <button className="text-sm text-gray-700 font-inter-semibold hover:underline">
              Resend verification email
            </button>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 font-inter-regular mb-4">
              After verifying your email, you can log in to your account
            </p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-2 bg-gray-700 text-white font-inter-semibold rounded-lg hover:bg-gray-800 transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
