import Link from "next/link"

interface HeaderProps {
  currentPage?: "main" | "reminder" | "guide"
}

export function Header({ currentPage = "main" }: HeaderProps) {
  return (
    <header className="bg-[#0f1654] border-b border-blue-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-white text-xl font-bold">
              E-Reporting
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === "main"
                    ? "bg-white text-[#0f1654] ring-1 ring-white/30"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Utama
              </Link>
              <Link
                href="/reminder"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === "reminder"
                    ? "bg-white text-[#0f1654] ring-1 ring-white/30"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Peringatan
              </Link>
              <Link
                href="/guide"
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentPage === "guide"
                    ? "bg-white text-[#0f1654] ring-1 ring-white/30"
                    : "text-white hover:bg-white/10"
                }`}
              >
                Panduan
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white hover:text-blue-200 transition-colors">Malay</button>
            <button className="text-white hover:text-blue-200 transition-colors">English</button>
          </div>
        </div>
      </div>
    </header>
  )
}
