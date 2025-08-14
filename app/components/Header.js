export default function Header(){
  return (
    <header className="w-full">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-2">
          {/* Simple CC mark */}
          <div className="h-8 w-8 rounded-xl"
               style={{backgroundImage:'linear-gradient(120deg,#6D28D9,#A21CAF)'}} />
          <span className="font-semibold">Ctrl+Content</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="/" className="hover:underline">Home</a>
          <a href="/#services" className="hover:underline">Services</a>
          <a href="/#contact" className="hover:underline">Contact</a>
          <a href="https://cal.com" className="btn px-3 py-1.5 text-sm">Get Started</a>
        </nav>
      </div>
    </header>
  );
}
