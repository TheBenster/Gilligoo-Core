"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function GoblinNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inventoryCount, setInventoryCount] = useState(0);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    const fetchInventoryCount = async () => {
      try {
        const response = await fetch('/api/inventory');
        const data = await response.json();
        setInventoryCount(data.items?.length || 0);
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
    { href: "/write", label: "Write" },
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
            {navItems.map((item) => (
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
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-emerald-700">
              {status === "loading" ? (
                <div className="text-emerald-400 text-sm">Loading...</div>
              ) : session?.user?.isAdmin ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-8 h-8 rounded-full border-2 border-emerald-600"
                    />
                    <div className="text-sm">
                      <div className="text-emerald-200 font-medium">Grand Merchant</div>
                      <div className="text-emerald-400 text-xs">{session.user.name}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="text-emerald-300 hover:text-emerald-100 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="text-emerald-300 hover:text-emerald-100 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
                >
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
              {navItems.map((item) => (
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
              ))}
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
