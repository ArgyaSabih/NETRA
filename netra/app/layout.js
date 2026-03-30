import "@/src/styles/globals.css";
import {InterBold, InterLight, InterRegular, InterSemiBold, InterMedium} from "@/src/utils/helper/font";
import {getMetaData} from "@/src/utils/helper/getMetaData";
import AnimationProvider from "@/src/components/contexts/AnimationProvider";

export const metadata = getMetaData({
  title: "NETRA",
  description: "NETRA is a web-based and AI-powered SIEM with modern monitoring dashboard."
});

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body
        className={`${InterBold.variable} ${InterLight.variable} ${InterRegular.variable} ${InterSemiBold.variable} ${InterMedium.variable} antialiased`}
      >
        <AnimationProvider>{children}</AnimationProvider>
      </body>
    </html>
  );
}
