"use client";

import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  X,
  Clock,
  Cpu,
  Thermometer,
  Zap,
  Play,
  Copy,
  Check,
  Sparkles,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import type { HistoryDrawerProps } from "@/types";

// ── Metadata Row ──

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-text-muted" />
      <span className="text-xs text-text-muted">{label}:</span>
      <span className="text-xs font-medium text-text-primary">{value}</span>
    </div>
  );
}

// ── Main Drawer Component ──

export function HistoryDrawer({ prompt, isOpen, onClose, onRerun }: HistoryDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && prompt && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border-glass bg-surface shadow-2xl"
            role="dialog"
            aria-label="Prompt details"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-glass px-6 py-4">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider",
                    prompt.mode === "generator"
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary/10 text-secondary"
                  )}
                >
                  {prompt.mode === "generator" ? (
                    <Sparkles className="h-3 w-3" />
                  ) : (
                    <FileText className="h-3 w-3" />
                  )}
                  {prompt.mode}
                </span>
                <span className="text-xs text-text-muted">
                  {prompt.createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 border-b border-border-glass px-6 py-4">
                <MetaItem icon={Cpu} label="Model" value={prompt.model} />
                <MetaItem icon={Thermometer} label="Temp" value={prompt.temperature.toFixed(1)} />
                <MetaItem icon={Zap} label="Tokens" value={formatNumber(prompt.tokensUsed)} />
                <MetaItem
                  icon={Clock}
                  label="Time"
                  value={prompt.createdAt.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                />
              </div>

              {/* Prompt Input */}
              <div className="border-b border-border-glass px-6 py-5">
                <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  Prompt
                </h4>
                <p className="text-sm leading-relaxed text-text-primary">{prompt.input}</p>
              </div>

              {/* Output */}
              <div className="px-6 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                    Output
                  </h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
                    aria-label="Copy output"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-success" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const isInline = !className;
                        if (isInline) {
                          return (
                            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-secondary" {...props}>
                              {children}
                            </code>
                          );
                        }
                        return (
                          <pre className="my-3 overflow-x-auto rounded-lg border border-border-glass bg-[#0D0D15] p-4">
                            <code className="font-mono text-sm text-text-primary">{children}</code>
                          </pre>
                        );
                      },
                      h2: ({ children }) => <h2 className="mb-3 mt-6 text-lg font-bold text-text-primary">{children}</h2>,
                      h3: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold text-text-primary">{children}</h3>,
                      p: ({ children }) => <p className="mb-3 text-sm leading-relaxed text-text-primary/90">{children}</p>,
                      strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
                    }}
                  >
                    {prompt.output}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-border-glass px-6 py-4">
              <button
                onClick={() => onRerun(prompt)}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white",
                  "bg-gradient-to-r from-primary to-secondary",
                  "transition-shadow hover:shadow-[0_4px_20px_rgba(108,99,255,0.4)]"
                )}
                aria-label="Re-run this prompt"
              >
                <Play className="h-4 w-4" />
                Re-run Prompt
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
