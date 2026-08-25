import type { Metadata } from "next";
import Link from "next/link";
import { Archivo_Black, JetBrains_Mono } from "next/font/google";
import { DataProvider } from "@/lib/data-context";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ProjectMatch — Team Formation",
  description: "Find the teammate you're missing, fast.",
};

// Applies a saved theme preference to <html> before first paint, so the
// page never flashes dark-then-light (or vice versa) on load.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivoBlack.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-mono">
        <DataProvider>
          <header className="border-b border-surface-border">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
              <Link href="/" className="text-meta font-mono text-muted hover:text-accent-text">
                [PROJECTMATCH]
              </Link>
              <ThemeToggle />
            </div>
          </header>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
