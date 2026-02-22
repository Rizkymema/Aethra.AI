"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Clock,
  BarChart3,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEM, MOCK_USER, MOCK_USAGE_STATS } from "@/constants";
import type { NavItem } from "@/types";

// ── Icon Resolver ──

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Sparkles,
  Clock,
  BarChart3,
  Shield,
};

function resolveIcon(iconName: string) {
  return ICON_MAP[iconName] || LayoutDashboard;
}

// ── Usage Mini Widget ──

function UsageWidget({ collapsed }: { collapsed: boolean }) {
  const { tokensMonth, tokenLimit } = MOCK_USAGE_STATS;
  const percentage = Math.round((tokensMonth / tokenLimit) * 100);

  return (
    <div
      className={cn(
        "rounded-xl border border-border-glass bg-white/5 p-3 transition-all duration-300",
        collapsed && "px-2"
      )}
    >
      {!collapsed && (
        <>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-text-muted">
              Token Usage
            </span>
            <span className="text-xs font-medium text-text-primary">{percentage}%</span>
          </div>
        </>
      )}
      <div className={cn("h-1.5 overflow-hidden rounded-full bg-white/10", collapsed && "h-1")}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            percentage < 60
              ? "bg-success"
              : percentage < 85
                ? "bg-warning"
                : "bg-danger"
          )}
        />
      </div>
      {!collapsed && (
        <p className="mt-1.5 text-[10px] text-text-muted">
          {(tokensMonth / 1000).toFixed(0)}K / {(tokenLimit / 1000).toFixed(0)}K tokens
        </p>
      )}
    </div>
  );
}

// ── Nav Link Item ──

function SidebarLink({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  const Icon = resolveIcon(item.icon);

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-text-muted hover:bg-white/5 hover:text-text-primary",
        collapsed && "justify-center px-2"
      )}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
    >
      {/* Active indicator (left glow border) */}
      {isActive && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full bg-primary shadow-[0_0_8px_rgba(108,99,255,0.6)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Badge */}
      {item.badge && !collapsed && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 px-1.5 text-[10px] font-semibold text-primary">
          {item.badge}
        </span>
      )}
      {item.badge && collapsed && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// ── Main Sidebar Component ──

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const allNavItems =
    MOCK_USER.role === "admin" ? [...NAV_ITEMS, ADMIN_NAV_ITEM] : NAV_ITEMS;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border-glass bg-surface",
        "hidden lg:flex"
      )}
    >
      {/* Logo Area */}
      <div className={cn("flex items-center gap-3 border-b border-border-glass px-4 py-5", collapsed && "justify-center px-2")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
          <span className="text-sm font-bold text-white">A</span>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold text-text-primary"
            >
              Aethra
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        {allNavItems.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </nav>

      {/* Bottom Section */}
      <div className={cn("border-t border-border-glass p-3 space-y-3")}>
        {/* Usage Widget */}
        <UsageWidget collapsed={collapsed} />

        {/* User Info */}
        <div className={cn("flex items-center gap-3 rounded-lg p-2", collapsed && "justify-center")}>
          <Image
            src={MOCK_USER.avatarUrl}
            alt={MOCK_USER.name}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full border border-border-glass"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0 flex-1"
              >
                <p className="truncate text-sm font-medium text-text-primary">{MOCK_USER.name}</p>
                <p className="truncate text-[11px] text-text-muted">{MOCK_USER.plan} plan</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              className="text-text-muted transition-colors hover:text-danger"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs text-text-muted",
            "transition-colors hover:bg-white/5 hover:text-text-primary"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Collapse
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
