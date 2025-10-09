"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState, useRef } from "react"
import { useFocusTrap } from "./useFocusTrap"

export function DashboardHeader() {
  const pathname = usePathname() || ""
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const menuNodeRef = useRef<HTMLElement | null>(null)
  useFocusTrap(mobileOpen, menuNodeRef, () => setMobileOpen(false))
  const openerRef = useRef<HTMLElement | null>(null)

  const closeMenu = () => {
    setMobileOpen(false)
    setTimeout(() => openerRef.current?.focus(), 0)
    try {
      const site = document.getElementById("site-content")
      if (site) site.setAttribute("aria-hidden", "false")
    } catch {
      /* ignore */
    }
  }

  const navItems = [
    { name: "Repot Polis", href: "/dashboard" },
    { name: "Cetak Repot Polis", href: "/dashboard/print-report" },
    { name: "Butiran Peribadi", href: "/dashboard/personal-info" },
  ]

  const handleLogout = () => {
    // Clear authentication cookies (client-side) and local storage, then fully reload to the public landing page
    try {
      const deleteCookie = (name: string) => {
        // ensure Path=/ so cookie is removed for the entire site
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; SameSite=Lax;`;
      };

      ["session", "roles", "userId", "language"].forEach(deleteCookie);

      // Clear any client-side storage that may hold auth info
      try {
        localStorage.removeItem("session");
        localStorage.removeItem("roles");
        localStorage.removeItem("userId");
      } catch {
        /* ignore localStorage errors */
      }
    } catch {
      /* ignore cookie errors on client */
    }

    // Use a full-page navigation so server-side middleware sees the cleared cookies immediately
    if (typeof window !== "undefined") {
      window.location.href = "/";
    } else {
      router.push("/");
    }
  }

  // normalize paths so trailing slashes don't break active state
  const normalize = (p?: string) => (p ? p.replace(/\/\/+$/, "") : "")
  const normalizedPath = normalize(pathname)

  // Pick the single best-matching nav item: prefer the longest href that matches the pathname.
  // This avoids marking a parent route (e.g. '/dashboard') active when a child route
  // like '/dashboard/cetak' should be considered active instead.
  let activeHref = ""
  for (const item of navItems) {
    const href = normalize(item.href)
    if (normalizedPath === href || normalizedPath.startsWith(href + "/")) {
      if (href.length > activeHref.length) {
        activeHref = href
      }
    }
  }

  return (
    <header className="bg-[#1a2470] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">
              e-Reporting PDRM
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const href = normalize(item.href)
                const isActive = activeHref && href === activeHref

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-6 py-4 text-sm font-medium transition-colors ${
                      isActive ? "bg-white text-[#1a2470]" : "text-white hover:bg-[#2a3480]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop logout */}
            <div className="hidden md:block">
              <Button
                onClick={handleLogout}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2"
                aria-label="Keluar (Log out)"
              >
                Keluar
              </Button>
            </div>

            {/* Mobile burger */}
            <button
              aria-label="Open menu"
              className="md:hidden text-white p-2 rounded hover:bg-white/10"
              onClick={(e) => { openerRef.current = e.currentTarget as HTMLElement; setMobileOpen(true); try { const site = document.getElementById("site-content"); if (site) site.setAttribute("aria-hidden", "true") } catch {} }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        onClick={closeMenu}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile vertical menu for dashboard */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-[#0f1654] text-white z-50 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 md:hidden`}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard menu"
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/dashboard" className="text-white text-lg font-bold">
            e-Reporting PDRM
          </Link>
          <button aria-label="Close menu" onClick={closeMenu} className="p-2 rounded hover:bg-white/10">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`w-full text-left px-4 py-3 rounded font-medium transition-colors ${
                normalize(item.href) === activeHref ? 'bg-white text-[#0f1650]' : 'hover:bg-white/10'
              }`}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-white/10" ref={(el) => { menuNodeRef.current = el ?? null }}>
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3">Malay</button>
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3">English</button>
            <button onClick={() => { setMobileOpen(false); handleLogout() }} className="w-full text-left px-4 py-3">Keluar</button>
          </div>
        </div>
      </nav>
    </header>
  )
}