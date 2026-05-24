import AuthLayout from "@/src/components/auth/AuthLayout";
import LoginForm from "@/src/components/auth/LoginForm";
import {auth} from "@/auth";
import {redirect} from "next/navigation";

export const metadata = {
  title: "Login | NETRA",
  description: "Login to your NETRA account"
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.email_verified === false) {
    const email = session.user.email ? encodeURIComponent(session.user.email) : "";
    redirect(`/auth/verify-pending?email=${email}`);
  }
  if (session?.user?.id) redirect("/dashboard");

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
