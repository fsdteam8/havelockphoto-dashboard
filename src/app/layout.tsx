import type { Metadata } from "next";
import "./globals.css";

import { Manrope } from "next/font/google";
import AppProvider from "@/components/provider/AppProvider";
import { Toaster } from "@/components/ui/sonner";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "have lock photo",
  description: "have lock photo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <AppProvider>{children}</AppProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
