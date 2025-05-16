"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./theme/ToggleTheme";

export default function Navbar() {
  const { user, login, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Navbar top */}
      <nav className="transition-colors bg-background  dark:bg-dark-background text-text  dark:text-dark-text px-4 py-3 shadow-md flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Portfolio
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-4 items-center">
          {user && <Link href="/admin" className="hover:underline">Admin</Link>}
          {user ? (
            <button onClick={logout} className="bg-danger hover:bg-red-600 px-3 py-1 rounded">
              Déconnexion
            </button>
          ) : (
            <button onClick={login} className="bg-primary hover:bg-blue-600 px-3 py-1 rounded">
              Connexion
            </button>
          )}
           <ThemeToggle/>
        </div>

        {/* Burger icon for mobile */}
        <div className="md:hidden">
          <button onClick={toggleSidebar} aria-label="Menu">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Overlay (fond noir semi-transparent) */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 transition-colors bg-dark-background/60  dark:bg-background/60  z-40 md:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* Sidebar menu */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 transition-all bg-background dark:bg-dark-background text-text  dark:text-dark-text z-50 transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={toggleSidebar}>
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          <Link onClick={closeSidebar} href="/" className="hover:underline">
            Accueil
          </Link>
          {user && (
            <Link onClick={closeSidebar} href="/admin" className="hover:underline">
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                logout();
                closeSidebar();
              }}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Déconnexion
            </button>
          ) : (
            <button
              onClick={() => {
                login();
                closeSidebar();
              }}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
            >
              Connexion
            </button>
          )}
          <ThemeToggle/>
        </div>
      </aside>
    </>
  );
}
