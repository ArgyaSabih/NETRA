import {redirect} from "next/navigation";
import {auth} from "@/auth";
import SOCDashboard from "@/src/components/dashboard/SOCDashboard";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.email_verified === false) {
    const email = session.user.email ? encodeURIComponent(session.user.email) : "";
    redirect(`/auth/verify-pending?email=${email}`);
  }

  return <SOCDashboard />;
}
