import AuthLayout from "@/src/components/auth/AuthLayout";
import ResetPasswordForm from "@/src/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | NETRA",
  description: "Set a new password"
};

export default async function ResetPasswordPage({searchParams}) {
  const {token} = (await searchParams) ?? {};

  return (
    <AuthLayout>
      <ResetPasswordForm token={token ?? ""} />
    </AuthLayout>
  );
}
