import {redirect} from "next/navigation";
import {auth} from "@/auth";
import UploadLogForm from "@/src/components/upload/UploadLogForm";

export default async function UploadLogPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if (session.user.email_verified === false) {
    const email = session.user.email ? encodeURIComponent(session.user.email) : "";
    redirect(`/auth/verify-pending?email=${email}`);
  }

  return <UploadLogForm />;
}
