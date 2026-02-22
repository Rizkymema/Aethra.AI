"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { truncate, formatRelativeTime } from "@/lib/utils";
import { showSuccess } from "@/lib/toast";
import { MOCK_STREAMING_TEXT, MOCK_PROMPT_HISTORY } from "@/constants";
import { WorkspaceInput } from "@/components/workspace/WorkspaceInput";
import { WorkspaceOutput, EmptyState } from "@/components/workspace/WorkspaceOutput";
import type { WorkspaceMode, AIModel, Prompt } from "@/types";

// ── Session Item in History Sidebar ──

function SessionItem({
  prompt,
  isActive,
  onClick,
}: {
  prompt: Prompt;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
        isActive ? "bg-primary/10" : "hover:bg-white/5"
      )}
      aria-label={`View prompt: ${prompt.input.slice(0, 40)}`}
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px]",
          prompt.mode === "generator" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
        )}
      >
        {prompt.mode === "generator" ? (
          <Sparkles className="h-3 w-3" />
        ) : (
          <FileText className="h-3 w-3" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-xs font-medium", isActive ? "text-primary" : "text-text-primary")}>
          {truncate(prompt.input, 40)}
        </p>
        <p className="text-[10px] text-text-muted">{formatRelativeTime(prompt.createdAt)}</p>
      </div>
    </button>
  );
}

// ── Main AI Workspace Component ──

export function AIWorkspace() {
  const [mode, setMode] = useState<WorkspaceMode>("generator");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentOutput, setCurrentOutput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessions] = useState<Prompt[]>(MOCK_PROMPT_HISTORY.slice(0, 10));

  /**
   * Handle prompt submission — simulates streaming.
   * TODO: Replace with actual API call using Vercel AI SDK useChat
   */
  const handleSubmit = useCallback(
    (input: string, model: AIModel, temperature: number) => {
      console.log("Submitting:", { input, model, temperature, mode });

      setIsStreaming(true);
      setCurrentOutput(MOCK_STREAMING_TEXT);

      // Simulate streaming completion
      const streamDuration = MOCK_STREAMING_TEXT.length * 16; // ~16ms per chunk
      setTimeout(() => {
        setIsStreaming(false);
      }, Math.min(streamDuration, 5000));
    },
    [mode]
  );

  const handleRegenerate = useCallback(() => {
    setIsStreaming(true);
    setCurrentOutput(MOCK_STREAMING_TEXT);
    setTimeout(() => setIsStreaming(false), 4000);
  }, []);

  const handleSave = useCallback(() => {
    // TODO: Implement save to history API
    showSuccess("Response saved to history");
  }, []);

  const handleSelectPrompt = useCallback(
    (prompt: string) => {
      // Auto-fill and submit
      handleSubmit(prompt, "gpt-4o", 0.7);
    },
    [handleSubmit]
  );

  const handleSessionClick = useCallback((prompt: Prompt) => {
    setActiveSessionId(prompt.id);
    setCurrentOutput(prompt.output);
    setIsStreaming(false);
    setMode(prompt.mode);
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* ── History Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden shrink-0 overflow-hidden border-r border-border-glass bg-surface md:block"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border-glass px-4 py-3">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  Sessions
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setActiveSessionId(null);
                      setCurrentOutput("");
                    }}
                    className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-primary"
                    aria-label="New session"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
                    aria-label="Close session sidebar"
                  >
                    <PanelLeftClose className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Session List */}
              <div className="flex-1 space-y-0.5 overflow-y-auto p-2">
                {sessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    prompt={session}
                    isActive={activeSessionId === session.id}
                    onClick={() => handleSessionClick(session)}
                  />
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Workspace Panel ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Sidebar reopen button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute left-2 top-20 z-20 hidden rounded-lg border border-border-glass bg-surface p-2 text-text-muted shadow-lg transition-colors hover:text-text-primary md:block lg:left-[248px]"
            aria-label="Open session sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}

        {/* Output area (scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!currentOutput && !isStreaming ? (
            <EmptyState onSelectPrompt={handleSelectPrompt} />
          ) : (
            <WorkspaceOutput
              content={currentOutput}
              isStreaming={isStreaming}
              onRegenerateAction={handleRegenerate}
              onSaveAction={handleSave}
            />
          )}
        </div>

        {/* Input area (bottom-anchored) */}
        <div className="shrink-0 border-t border-border-glass bg-surface/80 p-4 backdrop-blur-xl sm:p-6">
          <WorkspaceInput
            onSubmit={handleSubmit}
            isLoading={isStreaming}
            mode={mode}
            onModeChange={setMode}
          />
        </div>
      </div>
    </div>
  );
}
