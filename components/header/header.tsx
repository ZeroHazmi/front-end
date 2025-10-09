"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

interface HeaderProps {
  currentPage?: "main" | "reminder" | "guide"
}

export function Header({ currentPage = "main" }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-[#0f1654] border-b border-blue-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white text-xl font-bold">
              E-Reporting
            </Link>

            {/* Desktop nav */}
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

          {/* Right side: languages and mobile burger */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <button className="text-white hover:text-blue-200 transition-colors">Malay</button>
              <button className="text-white hover:text-blue-200 transition-colors">English</button>
            </div>

            {/* Mobile burger */}
            <button
              aria-label="Open menu"
              className="md:hidden text-white p-2 rounded hover:bg-white/10"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`fixed inset-0 bg-black/40 z-40 md:hidden ${mobileOpen ? 'block' : 'hidden'}`} onClick={() => setMobileOpen(false)} />

      {/* Mobile vertical menu */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f1654] text-white z-50 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-200 md:hidden`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/" className="text-white text-lg font-bold">
            E-Reporting
          </Link>
          <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="p-2 rounded hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-2">
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
          </div>
        </div>
      </nav>
    </header>
  )
}