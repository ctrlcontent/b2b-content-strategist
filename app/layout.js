// app/layout.js
import "./globals.css";
import Header from "./components/Header";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Ctrl+Content • B2B Content Strategist",
  description: "Plan goal-aligned B2B content calendars and briefs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="border-t py-10 text-center text-sm text-slate-500">
          Built with ❤️ by Ctrl+Content
        </footer>
      </body>
    </html>
  );
}
