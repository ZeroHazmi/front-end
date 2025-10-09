import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import { Header } from '@/components/header/header'

//"@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRAS",
  description: "Police Reporting Ai System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout always renders the public Header. Dashboard pages use their own
  // nested layout in `app/dashboard/layout.tsx` which renders the
  // `DashboardHeader`. This avoids toggling the header purely based on cookie
  // presence and keeps header selection deterministic via Next.js layout nesting.

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className={inter.className}>
        <main>
          <LanguageProvider>
            <LanguageWrapper>
              <Header />
              {children}
            </LanguageWrapper>
          </LanguageProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
