"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  LayoutDashboard,
  Sparkles,
  Clock,
  BarChart3,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { MOCK_USER, NAV_ITEMS } from "@/constants";

// ── Icon Resolver for Mobile Nav ──

const MOBILE_ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Sparkles,
  Clock,
  BarChart3,
};

// ── Topbar Component ──

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Prevent hydration mismatch: theme is undefined on server,
  // so we only render theme-dependent UI after mount.
  useEffect(() => {
    setMounted(true);
  }, []);
  const pathname = usePathname();

  const pageTitle = (() => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/workspace") return "AI Workspace";
    if (pathname === "/history") return "Prompt History";
    if (pathname === "/usage") return "Usage & Billing";
    if (pathname === "/admin") return "Admin Console";
    return "Aethra";
  })();

  return (
    <>
      {/* Desktop Topbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border-glass bg-surface/80 px-6 backdrop-blur-xl">
        {/* Left: Page Title */}
        <h1 className="text-lg font-semibold text-text-primary">{pageTitle}</h1>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className={cn(
                "h-9 w-56 rounded-lg border border-border-glass bg-white/5 pl-9 pr-3 text-sm text-text-primary",
                "placeholder:text-text-muted outline-none transition-all duration-200",
                "focus:w-72 focus:border-primary focus:shadow-[0_0_10px_rgba(108,99,255,0.15)]"
              )}
              aria-label="Search"
            />
          </div>

          {/* Notification Bell */}
          <button
            className="relative rounded-lg p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
            aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
          >
            {mounted ? (
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              // Static placeholder to avoid hydration mismatch
              <Sun className="h-5 w-5" />
            )}
          </button>

          {/* User Avatar + Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                "hover:bg-white/5",
                showUserMenu && "bg-white/5"
              )}
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <Image
                src={MOCK_USER.avatarUrl}
                alt={MOCK_USER.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-border-glass"
              />
              <span className="hidden text-sm font-medium text-text-primary md:block">
                {MOCK_USER.name}
              </span>
              <ChevronDown
                className={cn(
                  "hidden h-4 w-4 text-text-muted transition-transform md:block",
                  showUserMenu && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-border-glass",
                      "bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <div className="border-b border-border-glass px-4 py-3">
                      <p className="text-sm font-medium text-text-primary">{MOCK_USER.name}</p>
                      <p className="text-xs text-text-muted">{MOCK_USER.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/usage"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      {MOCK_USER.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="h-4 w-4" />
                          Admin Console
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-border-glass py-1">
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-danger transition-colors hover:bg-danger/10"
                        aria-label="Log out"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-border-glass bg-surface/95 px-2 py-2 backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = MOBILE_ICON_MAP[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] transition-colors",
                isActive ? "text-primary" : "text-text-muted"
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-active"
                  className="absolute -top-2 h-0.5 w-8 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
