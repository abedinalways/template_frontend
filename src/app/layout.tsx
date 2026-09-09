import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js Production Architecture Template",
  description:
    "Production-grade Next.js template featuring Redux Toolkit, RTK Query with Mutex reauth, Auth with proactive silent refresh, and Socket.io client.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-blue-500 selection:text-white`}
      >
        <AppProviders>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
