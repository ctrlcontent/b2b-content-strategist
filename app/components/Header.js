// app/components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="cc-sticky bg-white/70 backdrop-blur border-b">
      <div className="cc-container cc-flex-between cc-header">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600" />
          <span className="font-semibold tracking-tight text-slate-900">
            Ctrl+Content • Beta
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="#planner" className="text-slate-600 hover:text-slate-900">
            Planner
          </Link>
          <Link href="#how-it-works" className="text-slate-600 hover:text-slate-900">
            How it works
          </Link>
          <Link href="#" className="btn px-3 py-1.5" role="button" aria-label="Get started">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
