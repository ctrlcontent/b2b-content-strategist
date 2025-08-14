// app/layout.js
import "./globals.css";
import Header from "./components/Header";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Ctrl+Content • B2B Content Strategist",
  description:
    "Plan goal-aligned B2B content calendars and briefs, tailored to your brand voice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Header />

        {/* Centered, wide container */}
        <main className="mx-auto max-w-7xl px-6 md:px-8 py-10">
          {children}
        </main>

        <footer className="border-t mt-20">
          <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 text-center text-sm text-slate-500">
            Built with ❤️ by Ctrl+Content
          </div>
        </footer>
      </body>
    </html>
  );
}
