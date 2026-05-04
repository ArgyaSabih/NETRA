"use client";

import {usePathname} from "next/navigation";
import Navbar from "@/src/components/navbar/Navbar";
import Footer from "@/src/components/footer/Footer";
import AnimationProvider from "@/src/components/contexts/AnimationProvider";

export default function AppShell({children}) {
  const pathname = usePathname() || "";

  const hideNavFoot = pathname.startsWith("/auth") || pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavFoot && <Navbar />}
      <AnimationProvider>{children}</AnimationProvider>
      {!hideNavFoot && <Footer />}
    </>
  );
}
