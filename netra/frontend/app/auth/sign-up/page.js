import AuthLayout from "@/src/components/auth/AuthLayout";
import SignUpForm from "@/src/components/auth/SignUpForm";

export const metadata = {
  title: "Sign Up | NETRA",
  description: "Create your NETRA account"
};

export default async function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
