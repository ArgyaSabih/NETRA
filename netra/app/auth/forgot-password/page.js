import AuthLayout from "@/src/components/auth/AuthLayout";
import ForgotPasswordForm from "@/src/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | NETRA",
  description: "Request a password reset link"
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
