import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LanguageWrapper } from "@/components/LanguageWrapper";
import { cookies } from 'next/headers'
import { Header } from '@/components/header/header'
import { DashboardHeader } from '@/components/header/dashboard-header'
import { decodeToken } from '@/app/lib/auth'

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
  // Await cookies() per Next.js synchronous dynamic API guidance
  const cookieStore: any = await cookies()
  const session = cookieStore?.get?.('session')?.value || ""

  // Validate token payload before showing DashboardHeader
  let HeaderToUse = Header
  if (session) {
    try {
      const payload: any = await decodeToken(session)
      // Check expiry if present (payload.exp is in seconds)
      const now = Math.floor(Date.now() / 1000)
      if (payload && (payload.exp ? payload.exp > now : true)) {
        HeaderToUse = DashboardHeader
      }
    } catch (err) {
      // invalid token -> fall back to public header
      HeaderToUse = Header
    }
  }

  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <body className={inter.className}>
        <main>
          <LanguageProvider>
            <LanguageWrapper>
              {/* Render the appropriate header for public vs authenticated pages */}
              <HeaderToUse />
              {children}
            </LanguageWrapper>
          </LanguageProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
