// TODO: implement role-check middleware — only admin users should access this component

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Activity,
  Zap,
  DollarSign,
  Search,
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
  ShieldBan,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { showSuccess, showInfo } from "@/lib/toast";
import { MOCK_ADMIN_USERS } from "@/constants";
import type { AdminUser, UserRole, SortDirection } from "@/types";

// ── Animation Variants ──

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Admin Stat Card ──

function AdminStatCard({
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

// ── Role Badge ──

function RoleBadge({ role }: { role: UserRole }) {
  const config = {
    user: { label: "User", className: "bg-blue-500/10 text-blue-400" },
    admin: { label: "Admin", className: "bg-violet-500/10 text-violet-400" },
    blocked: { label: "Blocked", className: "bg-red-500/10 text-red-400" },
  };

  const { label, className } = config[role];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        className
      )}
    >
      {label}
    </span>
  );
}

// ── Inline Role Editor ──

function RoleEditor({
  user,
  onRoleChange,
}: {
  user: AdminUser;
  onRoleChange: (userId: string, role: UserRole) => void;
}) {
  const [open, setOpen] = useState(false);
  const roles: UserRole[] = ["user", "admin", "blocked"];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
        aria-label="Change role"
        aria-expanded={open}
      >
        <RoleBadge role={user.role} />
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-8 z-40 overflow-hidden rounded-lg border border-border-glass bg-surface shadow-lg">
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => {
                  onRoleChange(user.id, role);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2 text-left text-xs transition-colors hover:bg-white/5",
                  user.role === role && "bg-white/5"
                )}
              >
                <RoleBadge role={role} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Confirm Dialog ──

function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-xl border border-border-glass bg-surface p-6 shadow-2xl"
        role="dialog"
        aria-label={title}
      >
        <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
        <p className="mb-6 text-sm text-text-muted">{message}</p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border-glass px-4 py-2 text-sm text-text-muted transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-shadow hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Admin Panel ──

export function AdminPanel() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "tokensUsed" | "lastActive">("lastActive");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // Computed stats
  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeToday: users.filter((u) => {
      const today = new Date();
      return u.lastActive.toDateString() === today.toDateString();
    }).length,
    totalTokens: users.reduce((sum, u) => sum + u.tokensUsed, 0),
    revenueMRR: users.filter((u) => u.plan === "pro").length * 19 + users.filter((u) => u.plan === "enterprise").length * 99,
  }), [users]);

  // Filtered & sorted users
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mul * a.name.localeCompare(b.name);
      if (sortKey === "tokensUsed") return mul * (a.tokensUsed - b.tokensUsed);
      return mul * (a.lastActive.getTime() - b.lastActive.getTime());
    });

    return result;
  }, [users, search, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role, isBlocked: role === "blocked" } : u
      )
    );
    showSuccess(`Role updated to "${role}"`);
  };

  const handleResetUsage = (user: AdminUser) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reset Usage",
      message: `Are you sure you want to reset usage stats for ${user.name}? This action cannot be undone.`,
      onConfirm: () => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, tokensUsed: 0 } : u))
        );
        showSuccess(`Usage reset for ${user.name}`);
        setConfirmDialog((d) => ({ ...d, isOpen: false }));
      },
    });
  };

  const handleToggleBlock = (user: AdminUser) => {
    const newRole: UserRole = user.isBlocked ? "user" : "blocked";
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, role: newRole, isBlocked: !user.isBlocked } : u
      )
    );
    showInfo(user.isBlocked ? `${user.name} has been unblocked` : `${user.name} has been blocked`);
  };

  return (
    <>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="space-y-6 p-6 pb-24 lg:pb-6"
      >
        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AdminStatCard label="Total Users" value={String(stats.totalUsers)} icon={Users} color="bg-primary/10 text-primary" />
          <AdminStatCard label="Active Today" value={String(stats.activeToday)} icon={Activity} color="bg-success/10 text-success" />
          <AdminStatCard label="Total Tokens" value={formatNumber(stats.totalTokens)} icon={Zap} color="bg-secondary/10 text-secondary" />
          <AdminStatCard label="Revenue MRR" value={`$${formatNumber(stats.revenueMRR)}`} icon={DollarSign} color="bg-warning/10 text-warning" />
        </div>

        {/* ── Search + Table ── */}
        <motion.div variants={fadeUp} className="rounded-xl border border-border-glass bg-surface">
          {/* Search Header */}
          <div className="flex items-center justify-between border-b border-border-glass px-6 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
              User Management
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="h-9 w-48 rounded-lg border border-border-glass bg-white/5 pl-9 pr-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-primary focus:shadow-[0_0_10px_rgba(108,99,255,0.1)]"
                aria-label="Search users"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-border-glass bg-white/[0.02]">
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-text-primary" aria-label="Sort by name">
                      User <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">Email</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">Role</th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    <button onClick={() => toggleSort("tokensUsed")} className="flex items-center gap-1 hover:text-text-primary" aria-label="Sort by tokens">
                      Tokens Used <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    <button onClick={() => toggleSort("lastActive")} className="flex items-center gap-1 hover:text-text-primary" aria-label="Sort by last active">
                      Last Active <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-[10px] font-semibold uppercase tracking-widest text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr
                    key={user.id}
                    className={cn(
                      "border-b border-border-glass/50 transition-colors hover:bg-white/[0.02]",
                      i % 2 === 0 && "bg-white/[0.01]"
                    )}
                  >
                    {/* Avatar + Name */}
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.avatarUrl}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full border border-border-glass"
                        />
                        <div>
                          <p className="text-sm font-medium text-text-primary">{user.name}</p>
                          <p className="text-[10px] text-text-muted capitalize">{user.plan} plan</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-3 text-sm text-text-muted">{user.email}</td>

                    {/* Role (inline editor) */}
                    <td className="px-6 py-3">
                      <RoleEditor user={user} onRoleChange={handleRoleChange} />
                    </td>

                    {/* Tokens */}
                    <td className="px-6 py-3 text-sm text-text-primary">
                      {formatNumber(user.tokensUsed)}
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-3 text-sm text-text-muted">
                      {formatRelativeTime(user.lastActive)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleResetUsage(user)}
                          className="rounded-md p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-warning"
                          aria-label={`Reset usage for ${user.name}`}
                          title="Reset Usage"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleBlock(user)}
                          className={cn(
                            "rounded-md p-2 transition-colors",
                            user.isBlocked
                              ? "text-success hover:bg-success/10"
                              : "text-text-muted hover:bg-white/10 hover:text-danger"
                          )}
                          aria-label={user.isBlocked ? `Unblock ${user.name}` : `Block ${user.name}`}
                          title={user.isBlocked ? "Unblock" : "Block"}
                        >
                          {user.isBlocked ? (
                            <ShieldCheck className="h-4 w-4" />
                          ) : (
                            <ShieldBan className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((d) => ({ ...d, isOpen: false }))}
      />
    </>
  );
}
