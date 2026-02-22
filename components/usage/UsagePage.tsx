"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Calendar,
  Hash,
  Crown,
  ArrowUpDown,
  Check,
  X,
  TrendingUp,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import {
  MOCK_USAGE_STATS,
  MOCK_MONTHLY_DATA,
  MOCK_USAGE_HISTORY,
  PLAN_CONFIGS,
  PLAN_FEATURES,
} from "@/constants";
import type { SortDirection } from "@/types";

// ── Animation Variants ──

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ── Stat Card ──

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-xl border border-border-glass bg-surface p-5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          {label}
        </span>
        <div className={cn("rounded-lg p-2", color)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-text-primary">{value}</p>
    </motion.div>
  );
}

// ── Animated Progress Bar ──

function UsageProgressBar({
  label,
  current,
  max,
}: {
  label: string;
  current: number;
  max: number;
}) {
  const percentage = Math.min(Math.round((current / max) * 100), 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        <span className="text-sm font-medium text-text-primary">
          {formatNumber(current)} / {formatNumber(max)}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full transition-colors duration-500",
            percentage < 60
              ? "bg-success"
              : percentage < 85
                ? "bg-warning"
                : "bg-danger"
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-xs font-medium",
            percentage < 60
              ? "text-success"
              : percentage < 85
                ? "text-warning"
                : "text-danger"
          )}
        >
          {percentage}% used
        </span>
        {percentage >= 85 && (
          <span className="text-[10px] text-danger">⚠ Consider upgrading</span>
        )}
      </div>
    </div>
  );
}

// ── Custom Chart Tooltip ──

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border-glass bg-surface px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-text-primary">{label}</p>
      <p className="text-xs text-primary">{formatNumber(payload[0].value)} tokens</p>
    </div>
  );
}

// ── Plan Comparison ──

function PlanComparison() {
  return (
    <motion.div variants={fadeUp}>
      {/* Upgrade CTA Banner */}
      <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary p-[1px]">
        <div className="rounded-xl bg-surface p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-lg font-bold text-text-primary">Upgrade Your Plan</h3>
              <p className="text-sm text-text-muted">Unlock more tokens, models, and features.</p>
            </div>
            <button
              className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white transition-shadow hover:shadow-[0_4px_20px_rgba(108,99,255,0.4)]"
              aria-label="Upgrade plan"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLAN_CONFIGS.map((plan) => (
          <div
            key={plan.tier}
            className={cn(
              "relative rounded-xl border p-6",
              plan.highlighted
                ? "border-primary/50 bg-primary/5 shadow-[0_0_24px_rgba(108,99,255,0.1)]"
                : "border-border-glass bg-surface"
            )}
          >
            {plan.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                Popular
              </span>
            )}
            <h4 className="text-lg font-bold text-text-primary">{plan.name}</h4>
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-text-primary">{plan.price}</span>
              <span className="text-sm text-text-muted">/month</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2 text-sm text-text-muted">
                  <Check className="h-3.5 w-3.5 shrink-0 text-success" />
                  {feat}
                </li>
              ))}
            </ul>
            <button
              className={cn(
                "mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition-all",
                plan.highlighted
                  ? "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_4px_16px_rgba(108,99,255,0.3)]"
                  : "border border-border-glass bg-white/5 text-text-primary hover:bg-white/10"
              )}
              aria-label={`Select ${plan.name} plan`}
            >
              {plan.highlighted ? "Get Started" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-border-glass">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border-glass bg-white/5">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-text-muted">
                Feature
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
                Free
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-primary">
                Pro
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-text-muted">
                Enterprise
              </th>
            </tr>
          </thead>
          <tbody>
            {PLAN_FEATURES.map((feat, i) => (
              <tr
                key={feat.label}
                className={cn("border-b border-border-glass/50", i % 2 === 0 && "bg-white/[0.02]")}
              >
                <td className="px-4 py-3 text-sm text-text-primary">{feat.label}</td>
                {(["free", "pro", "enterprise"] as const).map((tier) => (
                  <td key={tier} className="px-4 py-3 text-center">
                    {typeof feat[tier] === "boolean" ? (
                      feat[tier] ? (
                        <Check className="mx-auto h-4 w-4 text-success" />
                      ) : (
                        <X className="mx-auto h-4 w-4 text-text-muted/30" />
                      )
                    ) : (
                      <span className="text-sm text-text-muted">{feat[tier]}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ── Main Usage Page ──

export function UsagePage() {
  const [sortKey, setSortKey] = useState<"date" | "tokens" | "cost">("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const sortedHistory = [...MOCK_USAGE_HISTORY].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1;
    if (sortKey === "date") return mul * (a.date.getTime() - b.date.getTime());
    if (sortKey === "tokens") return mul * (a.tokensUsed - b.tokensUsed);
    return mul * (a.cost - b.cost);
  });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="space-y-6 p-6 pb-24 lg:pb-6"
    >
      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Tokens Today" value={formatNumber(MOCK_USAGE_STATS.tokensToday)} icon={Zap} color="bg-primary/10 text-primary" />
        <StatCard label="Tokens This Month" value={formatNumber(MOCK_USAGE_STATS.tokensMonth)} icon={Calendar} color="bg-secondary/10 text-secondary" />
        <StatCard label="Total Requests" value={formatNumber(MOCK_USAGE_STATS.totalRequests)} icon={Hash} color="bg-success/10 text-success" />
        <StatCard label="Plan Tier" value={MOCK_USAGE_STATS.planTier.charAt(0).toUpperCase() + MOCK_USAGE_STATS.planTier.slice(1)} icon={Crown} color="bg-warning/10 text-warning" />
      </div>

      {/* ── Progress Bars ── */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border-glass bg-surface p-6">
        <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-text-muted">Usage Limits</h3>
        <div className="space-y-6">
          <UsageProgressBar label="Daily Tokens" current={MOCK_USAGE_STATS.tokensToday} max={20000} />
          <UsageProgressBar label="Monthly Tokens" current={MOCK_USAGE_STATS.tokensMonth} max={MOCK_USAGE_STATS.tokenLimit} />
        </div>
      </motion.div>

      {/* ── Monthly Usage Chart ── */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border-glass bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Monthly Usage Trend
          </h3>
          <div className="flex items-center gap-1 text-xs text-success">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12% from last month</span>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_MONTHLY_DATA}>
              <defs>
                <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#64748B", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="tokens"
                stroke="#6C63FF"
                fill="url(#tokenGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Plan Comparison ── */}
      <PlanComparison />

      {/* ── Usage History Table ── */}
      <motion.div variants={fadeUp} className="rounded-xl border border-border-glass bg-surface">
        <div className="border-b border-border-glass px-6 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Usage History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border-glass bg-white/[0.02]">
                {[
                  { key: "date" as const, label: "Date" },
                  { key: "date" as const, label: "Tool" },
                  { key: "tokens" as const, label: "Tokens" },
                  { key: "cost" as const, label: "Cost" },
                ].map((col, i) => (
                  <th
                    key={`${col.key}-${i}`}
                    className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted"
                  >
                    <button
                      onClick={() => i !== 1 && toggleSort(col.key)}
                      className={cn("flex items-center gap-1", i !== 1 && "cursor-pointer hover:text-text-primary")}
                      aria-label={`Sort by ${col.label}`}
                    >
                      {col.label}
                      {i !== 1 && <ArrowUpDown className="h-3 w-3" />}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedHistory.slice(0, 15).map((entry, i) => (
                <tr
                  key={entry.id}
                  className={cn("border-b border-border-glass/50 transition-colors hover:bg-white/[0.02]", i % 2 === 0 && "bg-white/[0.01]")}
                >
                  <td className="px-6 py-3 text-sm text-text-primary">
                    {entry.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        entry.tool === "generator"
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary/10 text-secondary"
                      )}
                    >
                      {entry.tool}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-text-primary">{formatNumber(entry.tokensUsed)}</td>
                  <td className="px-6 py-3 text-sm text-text-muted">${entry.cost.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
