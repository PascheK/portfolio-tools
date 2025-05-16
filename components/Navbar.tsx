"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/theme/ToggleTheme";
import NavLink from "@/components/NavLink";
import { AuthButton } from "./AuthButton";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Top navigation bar */}
      <nav className="transition-colors bg-background dark:bg-dark-background text-text dark:text-dark-text px-4 py-3 shadow-md flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Compass Landing Page
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <NavLink href="/">Home</NavLink>
          {user && (
            <NavLink href="/admin">My projects</NavLink>

          )}
             <ThemeToggle />
          <AuthButton user={user} login={login} logout={logout} closeSidebar={closeSidebar} />
       
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={toggleSidebar} aria-label="Menu">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay background when mobile menu is open */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 transition-colors bg-dark-background/60 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar menu for mobile */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 transition-all bg-background dark:bg-dark-background text-text dark:text-dark-text z-50 transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={toggleSidebar}>
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col justify-between min-h-[95vh] max-h-screen p-4 ">
          <div className="flex flex-col items-center justify-between space-y-4">
          <NavLink href="/">Home</NavLink>
          {user && (
          <NavLink href="/admin">My projects</NavLink>
          )}
       </div>
       <div className="flex flex-col items-end justify-between space-y-4 mt-4">
            <ThemeToggle />
            <AuthButton user={user} login={login} logout={logout} closeSidebar={closeSidebar} />
      
          </div>
        </div>
      </aside>
    </>
  );
}
