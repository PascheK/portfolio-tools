import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/toast/ToastProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";



export const metadata: Metadata = {
  title: "UNOPS - GPO Compass AI", 
  description: "UNOPS - GPO Compass AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans antialiased flex flex-col min-h-screen transition-colors bg-surface  dark:bg-dark-surface text-text  dark:text-dark-text`}
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
