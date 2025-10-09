"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  const pathname = usePathname() || ""
  const router = useRouter()

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
          <Link href="/dashboard" className="text-xl font-bold">
            e-Reporting PDRM
          </Link>

          <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
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

          <div className="flex items-center gap-4">
            <div className="relative" aria-hidden="false" title="Security status">
              <Lock className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#1a2470] text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2"
              aria-label="Keluar (Log out)"
            >
              Keluar
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}