import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DataProvider } from "@/lib/data-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProjectMatch — Team Formation",
  description: "Find the teammate you're missing, fast.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
