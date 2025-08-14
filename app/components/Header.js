// app/components/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-[#0B0B1F] text-white">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ backgroundImage: "linear-gradient(120deg,#6D28D9,#A21CAF)" }}
          />
          <span className="font-semibold tracking-tight">Ctrl+Content</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/90">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/#services" className="hover:underline">Services</Link>
          <Link href="/#contact" className="hover:underline">Contact</Link>
          <a href="https://cal.com" className="btn px-3 py-1.5 text-sm">Get Started</a>
        </nav>
      </div>
    </header>
  );
}
