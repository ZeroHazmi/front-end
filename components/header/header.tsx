"use client"

import Link from "next/link"
import { useState, useRef } from "react"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useFocusTrap } from "./useFocusTrap"

interface HeaderProps {
  currentPage?: "main" | "reminder" | "guide"
}

export function Header({ currentPage = "main" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() || ""
  const menuNodeRef = useRef<HTMLElement | null>(null)

  // keep track of the element that opened the menu so we can restore focus when it closes
  const openerRef = useRef<HTMLElement | null>(null)

  const closeMenu = () => {
    setMobileOpen(false)
    // restore focus to the opener after menu is hidden
    setTimeout(() => openerRef.current?.focus(), 0)
    try {
      const site = document.getElementById("site-content")
      if (site) site.setAttribute("aria-hidden", "false")
    } catch {
      /* ignore */
    }
  }

  useFocusTrap(mobileOpen, menuNodeRef, () => setMobileOpen(false))

  // Don't show the public header on dashboard pages (dashboard has its own header)
  if (pathname.startsWith("/dashboard")) return null

  // Hide Keluar (logout) on the public landing/login/signup pages
  const hideLogoutOn = new Set(["/", "/login", "/signup"])

  return (
    <header className="bg-[#0f1654] border-b border-blue-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white text-xl font-bold">
              E-Reporting
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentPage === "main"
                    ? "bg-white text-[#0f1654]"
                    : "text-white hover:bg-white/20"
                }`}
              >
                Utama
              </Link>
              <Link
                href="/reminder"
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentPage === "reminder"
                    ? "bg-white text-[#0f1654]"
                    : "text-white hover:bg-white/20"
                }`}
              >
                Peringatan
              </Link>
              <Link
                href="/guide"
                className={`px-4 py-2 rounded font-medium transition-colors ${
                  currentPage === "guide"
                    ? "bg-white text-[#0f1654]"
                    : "text-white hover:bg-white/20"
                }`}
              >
                Panduan
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <button className="text-white hover:text-blue-200 transition-colors">Malay</button>
              <button className="text-white hover:text-blue-200 transition-colors">English</button>
            </div>

            {/* Mobile burger */}
            <button
              aria-label="Open menu"
              className="md:hidden text-white p-2 rounded hover:bg-white/10"
              onClick={(e) => {
                openerRef.current = e.currentTarget as HTMLElement
                setMobileOpen(true)
                try {
                  const site = document.getElementById("site-content")
                  if (site) site.setAttribute("aria-hidden", "true")
                } catch {
                  /* ignore */
                }
              }}
            >
              <Menu className="w-6 h-6" />
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

      {/* Mobile vertical menu */}
      <nav
        ref={menuRef => { /* placeholder to satisfy TS; replaced by hook below via menuNodeRef */ }}
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f1654] text-white z-50 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 md:hidden`}
        role="dialog"
        aria-modal="true"
        aria-label="Main menu"
        aria-hidden={!mobileOpen}
        id="public-mobile-menu"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/" className="text-white text-lg font-bold">
            E-Reporting
          </Link>
          <button aria-label="Close menu" onClick={closeMenu} className="p-2 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

  <div ref={(el) => { menuNodeRef.current = el ?? null }} className="flex flex-col p-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={`w-full text-left px-4 py-3 rounded font-medium transition-colors ${
              currentPage === 'main' ? 'bg-white text-[#0f1654]' : 'hover:bg-white/10'
            }`}
          >
            Utama
          </Link>
          <Link
            href="/reminder"
            onClick={() => setMobileOpen(false)}
            className={`w-full text-left px-4 py-3 rounded font-medium transition-colors ${
              currentPage === 'reminder' ? 'bg-white text-[#0f1654]' : 'hover:bg-white/10'
            }`}
          >
            Peringatan
          </Link>
          <Link
            href="/guide"
            onClick={() => setMobileOpen(false)}
            className={`w-full text-left px-4 py-3 rounded font-medium transition-colors ${
              currentPage === 'guide' ? 'bg-white text-[#0f1654]' : 'hover:bg-white/10'
            }`}
          >
            Panduan
          </Link>

          <div className="pt-4 border-t border-white/10">
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3">Malay</button>
            <button onClick={() => setMobileOpen(false)} className="w-full text-left px-4 py-3">English</button>
            {!hideLogoutOn.has(pathname) && (
              <button onClick={() => { setMobileOpen(false); /* no-op logout here - dashboard handles logout */ }} className="w-full text-left px-4 py-3">Keluar</button>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

// Focus trap hook for both public and dashboard menus
// useFocusTrap is provided by ./useFocusTrap