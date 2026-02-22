"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Clock,
  Settings,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { getGreeting, formatRelativeTime, formatNumber, truncate } from "@/lib/utils";
import {
  MOCK_USER,
  MOCK_ACTIVITY_DATA,
  MOCK_RECENT_ACTIVITY,
  MOCK_USAGE_STATS,
  QUICK_ACTIONS,
} from "@/constants";

// ── Icon Resolver for Quick Actions ──

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  FileText,
  Clock,
  Settings,
};

// ── Animation Variants ──

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

// ── Custom Recharts Tooltip ──

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-glass bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-text-primary">{label}</p>
      <p className="text-xs text-primary">{formatNumber(payload[0].value)} requests</p>
    </div>
  );
}

// ── Main Dashboard Content ──

export function DashboardContent() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6 pb-24 lg:pb-6"
    >
      {/* ── Greeting Banner ── */}
      <motion.div variants={fadeUpItem} className="space-y-1">
        <h2 className="text-2xl font-bold sm:text-3xl">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {getGreeting()}, {MOCK_USER.name.split(" ")[0]}
          </span>{" "}
          <span className="inline-block animate-float">👋</span>
        </h2>
        <p className="text-sm text-text-muted">{today}</p>
      </motion.div>

      {/* ── Quick Action Cards (2×2) ── */}
      <motion.div variants={fadeUpItem}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = ICON_MAP[action.icon] || Sparkles;
            return (
              <Link key={action.label} href={action.href}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={cn(
                    "group relative overflow-hidden rounded-xl border border-border-glass bg-surface p-5",
                    "transition-all duration-300 hover:border-border-glass-hover hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                  )}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5",
                      action.gradient
                    )}
                  />

                  <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                          action.gradient
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-text-primary">{action.label}</h3>
                        <p className="text-xs text-text-muted">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* ── Stats + Activity Chart Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Stats Overview */}
        <motion.div variants={fadeUpItem} className="lg:col-span-1">
          <div className="rounded-xl border border-border-glass bg-surface p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Quick Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: "Tokens Today", value: formatNumber(MOCK_USAGE_STATS.tokensToday), color: "text-primary" },
                { label: "This Month", value: formatNumber(MOCK_USAGE_STATS.tokensMonth), color: "text-secondary" },
                { label: "Total Requests", value: formatNumber(MOCK_USAGE_STATS.totalRequests), color: "text-success" },
                { label: "Plan", value: MOCK_USAGE_STATS.planTier.charAt(0).toUpperCase() + MOCK_USAGE_STATS.planTier.slice(1), color: "text-warning" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{stat.label}</span>
                  <span className={cn("text-sm font-semibold", stat.color)}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Activity Chart */}
        <motion.div variants={fadeUpItem} className="lg:col-span-2">
          <div className="rounded-xl border border-border-glass bg-surface p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              Activity — Last 7 Days
            </h3>
            {/* TODO: Replace mock data with API call */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_ACTIVITY_DATA} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#64748B", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar
                    dataKey="requests"
                    fill="#6C63FF"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Recent Activity Feed ── */}
      <motion.div variants={fadeUpItem}>
        <div className="rounded-xl border border-border-glass bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              Recent Activity
            </h3>
            <Link
              href="/history"
              className="text-xs font-medium text-primary transition-colors hover:text-primary-hover"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-1">
            {MOCK_RECENT_ACTIVITY.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs",
                    activity.mode === "generator"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  )}
                >
                  {activity.mode === "generator" ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <FileText className="h-3.5 w-3.5" />
                  )}
                </span>
                <p className="flex-1 truncate text-sm text-text-primary">
                  {truncate(activity.promptPreview, 60)}
                </p>
                <span className="shrink-0 text-[11px] text-text-muted">
                  {activity.tokensUsed} tokens
                </span>
                <span className="shrink-0 text-[11px] text-text-muted">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
