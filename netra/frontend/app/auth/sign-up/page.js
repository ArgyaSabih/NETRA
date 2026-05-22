import AuthLayout from "@/src/components/auth/AuthLayout";
import SignUpForm from "@/src/components/auth/SignUpForm";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata = {
  title: "Sign Up | NETRA",
  description: "Create your NETRA account"
};

export default async function SignUpPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
