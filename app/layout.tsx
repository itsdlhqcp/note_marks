import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NetworkStatus from "@/components/NetworkStatus";
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
  title: "Note Marks",
  description: "Note marking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('note-marks-theme');document.documentElement.classList.add(t==='light'?'':'dark');})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-900 dark:text-zinc-50`}
      >
        <ThemeProvider>
          <AuthProvider>
            <NetworkStatus />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
