import React from "react"
import { DashboardHeader } from "@/components/header/dashboard-header"

export const metadata = {
  title: "Dashboard - PRAS",
}

// Nested dashboard layout: do not render <html> or <body> here
// (the root layout already renders them). Render only the header and
// content wrapper so we don't mount multiple html/body tags.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardHeader />
      <main>{children}</main>
    </>
  )
}
