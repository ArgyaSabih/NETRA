import {redirect} from "next/navigation";
import {auth} from "@/auth";
import LogoutButton from "@/src/components/auth/LogoutButton";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.email_verified === false) {
    const email = session.user.email ? encodeURIComponent(session.user.email) : "";
    redirect(`/auth/verify-pending?email=${email}`);
  }

  return (
    <div className="h-[100vh] text-white p-6">
      <div className="flex items-center justify-between">
        <div>Ini Dashboard</div>
        <LogoutButton />
      </div>
    </div>
  );
}
