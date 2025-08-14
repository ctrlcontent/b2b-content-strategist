// app/layout.js
import "./globals.css";
import Header from "./components/Header";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ctrl+Content • B2B Content Strategist",
  description:
    "Plan goal-aligned B2B content calendars and briefs, tailored to your brand voice.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Header />
        {/* Centered, wide container using our CSS utilities */}
        <main className="container-pro section">{children}</main>

        <footer className="border-t cc-mt-24">
          <div
            className="cc-container"
            style={{
              padding: "28px 0",
              textAlign: "center",
              fontSize: "0.9rem",
              color: "#64748B",
            }}
          >
            Built with ❤️ by Ctrl+Content
          </div>
        </footer>
      </body>
    </html>
  );
}
