"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Send,
  ChevronDown,
  Keyboard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { estimateTokens } from "@/lib/utils";
import { AI_MODELS } from "@/constants";
import type { WorkspaceInputProps, AIModel, WorkspaceMode } from "@/types";

// ── Max Characters ──

const MAX_CHARS = 4000;

// ── Mode Toggle Pill ──

function ModeToggle({
  mode,
  onModeChange,
}: {
  mode: WorkspaceMode;
  onModeChange: (m: WorkspaceMode) => void;
}) {
  return (
    <div className="relative flex rounded-xl bg-white/5 p-1">
      {(
        [
          { value: "generator", label: "Text Generator", icon: Sparkles },
          { value: "summarizer", label: "Summarizer", icon: FileText },
        ] as const
      ).map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onModeChange(opt.value)}
          className={cn(
            "relative z-10 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200",
            mode === opt.value ? "text-white" : "text-text-muted hover:text-text-primary"
          )}
          aria-label={`Switch to ${opt.label}`}
        >
          <opt.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
      <motion.div
        layout
        layoutId="mode-toggle-indicator"
        className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-primary/80"
        style={{ left: mode === "generator" ? 4 : "calc(50%)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
}

// ── Model Selector ──

function ModelSelector({
  model,
  onModelChange,
}: {
  model: AIModel;
  onModelChange: (m: AIModel) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = AI_MODELS.find((m) => m.value === model);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border-glass bg-white/5 px-3 py-2 text-sm text-text-primary",
          "transition-all hover:border-border-glass-hover",
          open && "border-primary"
        )}
        aria-label="Select AI model"
        aria-expanded={open}
      >
        <span className="font-medium">{current?.label}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-text-muted transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 top-11 z-40 w-56 overflow-hidden rounded-xl border border-border-glass bg-surface shadow-lg"
          >
            {AI_MODELS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => {
                  onModelChange(m.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full flex-col items-start px-4 py-2.5 text-left transition-colors hover:bg-white/5",
                  model === m.value && "bg-primary/10"
                )}
              >
                <span className={cn("text-sm font-medium", model === m.value ? "text-primary" : "text-text-primary")}>
                  {m.label}
                </span>
                <span className="text-[11px] text-text-muted">{m.description}</span>
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

// ── Temperature Slider ──

function TemperatureSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-text-muted">Temperature</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.1}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-white/10 accent-primary outline-none"
        aria-label={`Temperature: ${value}`}
      />
      <span className="min-w-[2rem] text-xs font-medium text-primary">{value.toFixed(1)}</span>
    </div>
  );
}

// ── Main Workspace Input ──

export function WorkspaceInput({ onSubmit, isLoading, mode, onModeChange }: WorkspaceInputProps) {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<AIModel>("gpt-4o");
  const [temperature, setTemperature] = useState(0.7);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tokens = estimateTokens(input);
  const charPercent = (input.length / MAX_CHARS) * 100;

  /** Auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [input]);

  /** Handle submit */
  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim(), model, temperature);
    setInput("");
  }, [input, isLoading, model, temperature, onSubmit]);

  /** Ctrl+Enter keyboard shortcut */
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode + Model Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ModeToggle mode={mode} onModeChange={onModeChange} />
        <div className="flex items-center gap-3">
          <TemperatureSlider value={temperature} onChange={setTemperature} />
          <ModelSelector model={model} onModelChange={setModel} />
        </div>
      </div>

      {/* Input Area */}
      <div
        className={cn(
          "relative rounded-xl border bg-white/5 transition-all duration-300",
          input.length > 0 ? "border-primary/30" : "border-border-glass",
          "focus-within:border-primary focus-within:shadow-[0_0_16px_rgba(108,99,255,0.1)]"
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) setInput(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            mode === "generator"
              ? "What would you like me to create?"
              : "Paste text to summarize..."
          }
          rows={3}
          className={cn(
            "w-full resize-none bg-transparent px-4 pb-12 pt-4 text-sm text-text-primary outline-none",
            "placeholder:text-text-muted"
          )}
          aria-label={mode === "generator" ? "Text generation prompt" : "Text to summarize"}
        />

        {/* Bottom bar inside textarea */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-border-glass px-4 py-2">
          <div className="flex items-center gap-3">
            {/* Token counter */}
            <span className={cn("text-xs", charPercent > 80 ? (charPercent > 95 ? "text-danger" : "text-warning") : "text-text-muted")}>
              {tokens} tokens · {input.length}/{MAX_CHARS}
            </span>
            {/* Character limit warning */}
            {charPercent > 80 && (
              <span className="text-[10px] text-warning">
                {charPercent > 95 ? "Almost at limit!" : "Approaching limit"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[10px] text-text-muted sm:flex">
              <Keyboard className="h-3 w-3" />
              Ctrl+Enter
            </span>
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-medium text-white",
                "transition-all duration-200 hover:shadow-[0_4px_16px_rgba(108,99,255,0.3)]",
                "disabled:cursor-not-allowed disabled:opacity-40"
              )}
              aria-label="Submit prompt"
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{isLoading ? "Generating..." : "Send"}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
