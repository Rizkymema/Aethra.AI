"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { cn } from "@/lib/utils";

/**
 * DashboardLayout — Wrapper layout for all authenticated pages.
 * Combines Sidebar (desktop) + Topbar + main content slot.
 * Mobile: sidebar is replaced by bottom nav in Topbar component.
 * Manages sidebar collapsed state so main content padding stays in sync.
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />

      {/* Main content area — offset by sidebar width on desktop only */}
      <div
        className={cn(
          "transition-[padding-left] duration-300 ease-in-out",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
        )}
      >
        <Topbar />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
