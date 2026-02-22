"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowUpDown,
  Eye,
  Copy,
  Trash2,
  Sparkles,
  FileText,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { truncate, formatRelativeTime, formatNumber } from "@/lib/utils";
import { showSuccess, showError } from "@/lib/toast";
import { MOCK_PROMPT_HISTORY } from "@/constants";
import { HistoryDrawer } from "@/components/history/HistoryDrawer";
import type { Prompt, WorkspaceMode, SortDirection } from "@/types";

// ── Animation Variants ──

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// ── Empty State ──

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
        <Inbox className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">No prompts yet</h3>
      <p className="mb-6 max-w-sm text-sm text-text-muted">
        Your prompt history will appear here once you start using the AI Workspace.
      </p>
      <a
        href="/workspace"
        className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-medium text-white transition-shadow hover:shadow-[0_4px_16px_rgba(108,99,255,0.3)]"
      >
        Go to Workspace
      </a>
    </div>
  );
}

// ── History List Item ──

function HistoryItem({
  prompt,
  onView,
  onCopy,
  onDelete,
}: {
  prompt: Prompt;
  onView: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="group flex items-center gap-4 rounded-xl border border-border-glass bg-surface p-4 transition-all duration-200 hover:border-border-glass-hover hover:shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
    >
      {/* Date Badge */}
      <div className="hidden shrink-0 flex-col items-center rounded-lg bg-white/5 px-3 py-2 sm:flex">
        <span className="text-lg font-bold text-text-primary">
          {prompt.createdAt.getDate()}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-text-muted">
          {prompt.createdAt.toLocaleDateString("en-US", { month: "short" })}
        </span>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
              prompt.mode === "generator"
                ? "bg-primary/10 text-primary"
                : "bg-secondary/10 text-secondary"
            )}
          >
            {prompt.mode === "generator" ? (
              <Sparkles className="h-2.5 w-2.5" />
            ) : (
              <FileText className="h-2.5 w-2.5" />
            )}
            {prompt.mode}
          </span>
          <span className="text-[10px] text-text-muted">{prompt.model}</span>
        </div>
        <p className="truncate text-sm text-text-primary">{truncate(prompt.input, 80)}</p>
        <div className="mt-1 flex items-center gap-3">
          <span className="text-[11px] text-text-muted">{formatNumber(prompt.tokensUsed)} tokens</span>
          <span className="text-[11px] text-text-muted">{formatRelativeTime(prompt.createdAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onView}
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-primary"
          aria-label="View details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={onCopy}
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
          aria-label="Copy prompt"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-md p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-danger"
          aria-label="Delete prompt"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main History Page ──

export function HistoryPage() {
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>(MOCK_PROMPT_HISTORY);
  const [search, setSearch] = useState("");
  const [toolFilter, setToolFilter] = useState<WorkspaceMode | "all">("all");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Prompt | null>(null);

  const filteredPrompts = useMemo(() => {
    let result = [...prompts];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.input.toLowerCase().includes(q) || p.output.toLowerCase().includes(q)
      );
    }

    // Tool filter
    if (toolFilter !== "all") {
      result = result.filter((p) => p.mode === toolFilter);
    }

    // Sort
    result.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      return mul * (a.createdAt.getTime() - b.createdAt.getTime());
    });

    return result;
  }, [prompts, search, toolFilter, sortDir]);

  const handleView = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setDrawerOpen(true);
  };

  const handleCopy = async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.input);
      showSuccess("Prompt copied to clipboard");
    } catch {
      showError("Failed to copy to clipboard");
    }
  };

  const handleDelete = (prompt: Prompt) => {
    setDeleteConfirm(prompt);
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setPrompts((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
    showSuccess("Prompt deleted");
    setDeleteConfirm(null);
    if (selectedPrompt?.id === deleteConfirm.id) {
      setDrawerOpen(false);
      setSelectedPrompt(null);
    }
  };

  const handleRerun = (prompt: Prompt) => {
    router.push(`/workspace?mode=${prompt.mode}`);
  };

  return (
    <>
      {/* ── Delete Confirmation Dialog ── */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-xl border border-border-glass bg-surface p-6 shadow-2xl"
              role="dialog"
              aria-label="Delete confirmation"
            >
              <h3 className="mb-2 text-lg font-semibold text-text-primary">Delete Prompt</h3>
              <p className="mb-6 text-sm text-text-muted">
                Are you sure you want to delete this prompt? This action cannot be undone.
              </p>
              <p className="mb-6 truncate rounded-lg bg-white/5 px-3 py-2 text-xs text-text-primary">
                &quot;{truncate(deleteConfirm.input, 60)}&quot;
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-lg border border-border-glass px-4 py-2 text-sm text-text-muted transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition-shadow hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <div className="space-y-6 p-6 pb-24 lg:pb-6">
        {/* ── Sticky Filter Bar ── */}
        <div className="sticky top-16 z-20 -mx-6 border-b border-border-glass bg-surface/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts..."
                className={cn(
                  "h-9 w-full rounded-lg border border-border-glass bg-white/5 pl-9 pr-3 text-sm text-text-primary",
                  "outline-none transition-all placeholder:text-text-muted",
                  "focus:border-primary focus:shadow-[0_0_10px_rgba(108,99,255,0.1)]"
                )}
                aria-label="Search prompts"
              />
            </div>

            {/* Tool Filter */}
            <div className="flex items-center gap-1 rounded-lg border border-border-glass bg-white/5 p-0.5">
              {(["all", "generator", "summarizer"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setToolFilter(filter)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    toolFilter === filter
                      ? "bg-primary/20 text-primary"
                      : "text-text-muted hover:text-text-primary"
                  )}
                  aria-label={`Filter by ${filter}`}
                >
                  {filter === "all" ? "All" : filter === "generator" ? "Generator" : "Summarizer"}
                </button>
              ))}
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="flex items-center gap-1.5 rounded-lg border border-border-glass bg-white/5 px-3 py-1.5 text-xs text-text-muted transition-colors hover:text-text-primary"
              aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>{sortDir === "desc" ? "Newest" : "Oldest"}</span>
            </button>

            {/* Result count */}
            <span className="ml-auto text-xs text-text-muted">
              {filteredPrompts.length} result{filteredPrompts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* ── Prompt List ── */}
        {filteredPrompts.length === 0 ? (
          <EmptyHistory />
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filteredPrompts.map((prompt) => (
              <HistoryItem
                key={prompt.id}
                prompt={prompt}
                onView={() => handleView(prompt)}
                onCopy={() => handleCopy(prompt)}
                onDelete={() => handleDelete(prompt)}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Drawer ── */}
      <HistoryDrawer
        prompt={selectedPrompt}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onRerun={handleRerun}
      />
    </>
  );
}
