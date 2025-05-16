import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio tools", 
  description: "A collection of tools to help",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen transition-colors bg-surface  dark:bg-dark-surface text-text  dark:text-dark-text`}
      >
        <ThemeProvider>
         <ToastProvider>
         <Navbar />
        <main className="flex-grow container mx-auto  py-8 ">{children}</main>
        <Footer />
        </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
