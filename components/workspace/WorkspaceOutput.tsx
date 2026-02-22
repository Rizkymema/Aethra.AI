"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  RefreshCw,
  Bookmark,
  Share2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SUGGESTED_PROMPTS } from "@/constants";
import type { WorkspaceOutputProps } from "@/types";

// ── Copy Button ──

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary",
        className
      )}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ── Code Block Renderer ──

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const language = className?.replace("language-", "") || "text";

  return (
    <div className="group relative my-3 overflow-hidden rounded-lg border border-border-glass bg-[#0D0D15]">
      <div className="flex items-center justify-between border-b border-border-glass px-4 py-2">
        <span className="text-[10px] uppercase tracking-widest text-text-muted">{language}</span>
        <CopyButton text={children} />
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm text-text-primary">{children}</code>
      </pre>
    </div>
  );
}

// ── Empty State ──

function EmptyState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      {/* Simple SVG Illustration */}
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-text-primary">Start Creating</h3>
      <p className="mb-6 max-w-sm text-sm text-text-muted">
        Type a prompt below, or choose one of these suggestions to get started.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className={cn(
              "rounded-full border border-border-glass bg-white/5 px-4 py-2 text-xs text-text-muted",
              "transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            )}
          >
            {prompt.length > 45 ? prompt.slice(0, 45) + "..." : prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Loading Skeleton ──

function OutputSkeleton() {
  return (
    <div className="space-y-3 p-6">
      {[100, 80, 90, 60, 85].map((w, i) => (
        <div
          key={i}
          className="h-4 animate-shimmer rounded bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

// ── Main Output Component ──

export function WorkspaceOutput({
  content,
  isStreaming,
  onRegenerateAction,
  onSaveAction,
}: WorkspaceOutputProps & { onSelectPrompt?: (p: string) => void }) {
  const [displayedText, setDisplayedText] = useState("");
  const [copiedAll, setCopiedAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const charIndexRef = useRef(0);

  /** Streaming text simulation using requestAnimationFrame */
  useEffect(() => {
    if (!isStreaming || !content) {
      if (!isStreaming && content) {
        setDisplayedText(content);
      }
      return;
    }

    setDisplayedText("");
    charIndexRef.current = 0;
    let animId: number;

    const streamChar = () => {
      if (charIndexRef.current < content.length) {
        // Stream 2-4 characters per frame for natural pace
        const chunkSize = Math.floor(Math.random() * 3) + 2;
        const nextIndex = Math.min(charIndexRef.current + chunkSize, content.length);
        setDisplayedText(content.slice(0, nextIndex));
        charIndexRef.current = nextIndex;

        // Auto-scroll to bottom
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }

        animId = requestAnimationFrame(streamChar);
      }
    };

    animId = requestAnimationFrame(streamChar);
    return () => cancelAnimationFrame(animId);
  }, [content, isStreaming]);

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Show empty state when no content
  if (!content && !isStreaming) {
    return null; // Empty state is rendered in parent
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col overflow-hidden rounded-xl border border-border-glass bg-surface"
    >
      {/* Floating Action Bar */}
      <div className="flex items-center justify-between border-b border-border-glass px-4 py-2">
        <span className="text-[10px] uppercase tracking-widest text-text-muted">
          {isStreaming ? "Generating..." : "Output"}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyAll}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
            aria-label="Copy all"
          >
            {copiedAll ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={onRegenerateAction}
            disabled={isStreaming}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary disabled:opacity-40"
            aria-label="Regenerate"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isStreaming && "animate-spin")} />
          </button>
          <button
            onClick={onSaveAction}
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
            aria-label="Save"
          >
            <Bookmark className="h-3.5 w-3.5" />
          </button>
          <button
            className="rounded-md p-1.5 text-text-muted transition-colors hover:bg-white/10 hover:text-text-primary"
            aria-label="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        ref={containerRef}
        className="max-h-[500px] overflow-y-auto px-6 py-4"
      >
        {isStreaming && !displayedText ? (
          <OutputSkeleton />
        ) : (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code
                        className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-secondary"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <CodeBlock className={className}>
                      {String(children).replace(/\n$/, "")}
                    </CodeBlock>
                  );
                },
                h2: ({ children }) => (
                  <h2 className="mb-3 mt-6 text-lg font-bold text-text-primary">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-base font-semibold text-text-primary">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="mb-3 text-sm leading-relaxed text-text-primary/90">{children}</p>
                ),
                li: ({ children }) => (
                  <li className="mb-1 text-sm leading-relaxed text-text-primary/90">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-text-primary">{children}</strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="my-3 border-l-2 border-primary/40 pl-4 italic text-text-muted">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {displayedText}
            </ReactMarkdown>

            {/* Streaming cursor */}
            {isStreaming && charIndexRef.current < content.length && (
              <span className="inline-block h-4 w-0.5 animate-pulse bg-primary" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export { EmptyState };
