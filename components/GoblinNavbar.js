"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "./ThemeProvider";

export default function GoblinNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inventoryCount, setInventoryCount] = useState(0);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();

  // Debug logging
  useEffect(() => {
    if (session) {
      console.log("🔍 NAVBAR SESSION DEBUG:");
      console.log("User ID:", session.user?.id);
      console.log("User Email:", session.user?.email);
      console.log("User Name:", session.user?.name);
      console.log("Is Admin:", session.user?.isAdmin);
      console.log("Full session:", session);
    }
  }, [session]);

  useEffect(() => {
    const fetchInventoryCount = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        setInventoryCount(data.total || 0);
      } catch (error) {
        console.error('Error fetching inventory count:', error);
      }
    };

    fetchInventoryCount();
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Chronicles" },
    { href: "/lore", label: "Lore" },
    { href: "/inventory", label: "Inventory" },
    { href: "/write", label: "Write", adminOnly: true },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-slate-900 bg-opacity-95 backdrop-blur-sm border-b border-emerald-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl text-emerald-400 font-bold">GC</span>
            <div>
              <h1 className="text-xl font-bold text-emerald-200">
                Goblin Chronicles
              </h1>
              <p className="text-xs text-emerald-400">Closet Merchant Tales</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              // Hide admin-only items if user is not admin
              if (item.adminOnly && !session?.user?.isAdmin) {
                return null;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-emerald-700 text-emerald-100 shadow-lg"
                      : "text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800 hover:bg-opacity-50"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-emerald-800 hover:bg-opacity-50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-emerald-700">
              {status === "loading" ? (
                <div className="text-emerald-400 text-sm">Loading...</div>
              ) : session ? (
                session.user?.isAdmin ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-emerald-700 bg-opacity-30 px-3 py-1 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full border-2 border-emerald-600"
                      />
                      <div className="text-sm">
                        <div className="text-emerald-200 font-medium">Admin</div>
                        <div className="text-emerald-400 text-xs">{session.user.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-700 bg-opacity-30 px-3 py-2 rounded-lg">
                      <div className="text-red-300 text-sm font-medium">Not Admin</div>
                      <div className="text-red-400 text-xs">{session.user.name}</div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="text-emerald-300 hover:text-emerald-100 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                )
              ) : (
                <button
                  onClick={() => signIn("github")}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                  Admin Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-emerald-300 hover:text-emerald-100 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                // Hide admin-only items if user is not admin
                if (item.adminOnly && !session?.user?.isAdmin) {
                  return null;
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? "bg-emerald-700 text-emerald-100"
                        : "text-emerald-300 hover:text-emerald-100 hover:bg-emerald-800 hover:bg-opacity-50"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Goblin Status Bar */}
      <div className="bg-emerald-900 bg-opacity-30 border-t border-emerald-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4 text-emerald-300">
              <span>Stealth: Active</span>
              <span>Shop Status: Open</span>
              <span>Inventory: {inventoryCount} items</span>
            </div>
            <div className="text-emerald-400">
              Last human detection: Never
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
