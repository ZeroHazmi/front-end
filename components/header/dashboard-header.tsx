"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import reportPersister from '@/lib/reportPersister'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { translations } from '@/translations'
import { getStringTranslation } from '@/lib/translation'

export function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() || ''
  const router = useRouter()

  const { language, setLanguage, t } = useLanguage()

  // Use label keys and resolve from `t` at render time so labels update when language changes
  // Only use translation keys which are string values (not nested objects)
  type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T]
  type TransKey = StringKeys<typeof translations.en>
  const navItems: { key: TransKey; href: string }[] = [
    { key: 'home', href: '/dashboard' },
    { key: 'printReport', href: '/dashboard/print-report' },
    { key: 'personalInfo', href: '/dashboard/personal-info' },
  ]

  const normalize = (p?: string) => (p ? p.replace(/\/+$/, '') : '')
  const normalizedPath = normalize(pathname)

  let activeHref = ''
  for (const item of navItems) {
    const href = normalize(item.href)
    if (normalizedPath === href || normalizedPath.startsWith(href + '/')) {
      if (href.length > activeHref.length) activeHref = href
    }
  }

  const handleLogout = () => {
    try {
      // best-effort cookie/localStorage cleanup
      document.cookie = `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0;`;
      try { localStorage.removeItem('session') } catch {}
    } catch {}
    // navigate to home/login
    try { reportPersister.clearAll() } catch (e) {}
    router.push('/')
  }
  
  // clear drafts only when the user navigates away from any /report route
  const prevPathRef = useRef<string | null>(null)
  useEffect(() => {
    const prev = prevPathRef.current || ''
    const curr = pathname || ''
    const prevIsReport = prev.includes('/report')
    const currIsReport = curr.includes('/report')
    if (prevIsReport && !currIsReport) {
      try { reportPersister.clearAll() } catch (e) {}
    }
    prevPathRef.current = curr
  }, [pathname])
  return (
    <header className="bg-[#2563eb] text-white sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-semibold text-white">{t.pras || 'PRAS'}</Link>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            {navItems.map((it) => {
              const href = normalize(it.href)
              const isActive = activeHref && href === activeHref
              const label = getStringTranslation(t, it.key)
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`px-3 py-2 rounded text-sm ${isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="text-white">{label}</span>
                </Link>
              )
            })}
          </nav>
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              aria-label="Open menu"
              className="p-2 rounded-md bg-white/10 text-white"
              onClick={() => setMobileOpen((s) => !s)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button onClick={() => setLanguage(language === 'en' ? 'bm' : 'en')} className="border-white text-white hover:bg-white/10">
              {language === 'en' ? t.bmShortLabel || 'BM' : t.enShortLabel || 'EN'}
            </Button>
          </div>
          <div>
            <Button onClick={handleLogout} className="border-white text-white hover:bg-white/10">{t.logout}</Button>
          </div>
        </div>
      </div>
      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden absolute left-0 right-0 top-full bg-[#2563eb] text-white z-40 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-3 border-t border-white/10">
            <nav className="flex flex-col gap-2">
              {navItems.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded text-sm hover:bg-white/10"
                >
                  {getStringTranslation(t, it.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

export default DashboardHeader