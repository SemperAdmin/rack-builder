import type { Metadata } from "next";
import "./globals.css";
import { ConsentBanner } from "@/components/ConsentBanner";

export const metadata: Metadata = {
  title: "Rack Builder",
  description: "USMC awards and ribbon rack management. Marines-only scope. Regulation-first.",
  applicationName: "Rack Builder"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="chrome-floating mx-4 mt-4 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="USMC"
                width={36}
                height={36}
                className="rounded-xs object-contain"
              />
              <span className="font-display text-2xl tracking-wide">RACK BUILDER</span>
              <span className="font-mono text-xs text-subtle-foreground uppercase">USMC // SECNAV M-1650.1</span>
            </div>
            <nav className="flex items-center gap-4 text-sm">
              <a href="/" className="hover:text-usmc-scarlet-300 transition-colors">Builder</a>
              <a href="/audit" className="hover:text-usmc-scarlet-300 transition-colors">Audit</a>
              <a href="/legal" className="hover:text-usmc-scarlet-300 transition-colors">Legal</a>
            </nav>
          </header>
          <main className="flex-1 px-4 py-6">{children}</main>
          <footer className="px-6 py-4 text-xs text-subtle-foreground border-t border-border">
            <div className="flex items-center justify-between">
              <span>Authority: MCO 1020.34H, SECNAVINST 1650.1J, SECNAV M-1650.1. No PII stored.</span>
              <div className="flex items-center gap-4 text-xs">
                <a href="/legal/privacy" className="hover:text-usmc-scarlet-300 transition-colors">Privacy</a>
                <a href="/legal/terms" className="hover:text-usmc-scarlet-300 transition-colors">Terms</a>
                <a href="/legal" className="hover:text-usmc-scarlet-300 transition-colors">Legal Hub</a>
              </div>
            </div>
          </footer>
        </div>
        <ConsentBanner />
      </body>
    </html>
  );
}
