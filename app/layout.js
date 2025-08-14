// app/layout.js
import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Ctrl+Content • B2B Content Strategist",
  description: "Plan goal-aligned B2B content calendars in minutes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="mx-auto max-w-6xl px-4 pb-16">
          {children}
        </div>
        <footer className="mt-16 border-t py-8 text-center text-sm text-slate-500">
          Built with ❤️ by Ctrl+Content
        </footer>
      </body>
    </html>
  );
}
