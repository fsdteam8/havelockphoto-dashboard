import type { Metadata } from "next";
import "./globals.css";

import { Manrope } from "next/font/google";
import AppProvider from "@/components/provider/AppProvider";
import { Toaster } from "@/components/ui/toaster";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "PRO VIZ | Event Photography Dashboard",
  description:
    "Event Photography Dashboard. Manage your events, bookings, and more with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <AppProvider>
          {children}
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
