import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import ThemeProvider from "../components/ThemeProvider";
import Header from "@/components/Header";
import BgAnimation from "@/components/BgAnimation";
import ReduxProvider from "@/components/ReduxProvider";
import { LayoutProps } from "@/types/general/client";

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
  title: "Vec Lovers",
  description: "Share your favorite vector images",
};

const RootLayout = async ({ children }: LayoutProps) => (
  <html lang="en" suppressHydrationWarning>
    <body
      className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col overflow-x-hidden`}
      suppressHydrationWarning
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReduxProvider>
          <Toaster position="top-center" richColors />
          <Header />
          <main className="flex min-h-[calc(100dvh-150px)] mt-[70px] relative overflow-x-hidden py-10">
            <BgAnimation />
            {children}
          </main>
        </ReduxProvider>
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
