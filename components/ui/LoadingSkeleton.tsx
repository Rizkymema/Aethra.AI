"use client";

import { cn } from "@/lib/utils";

type SkeletonVariant = "card" | "tableRow" | "textBlock" | "chartPlaceholder" | "avatar" | "inline";

interface LoadingSkeletonProps {
  variant?: SkeletonVariant;
  count?: number;
  className?: string;
}

function SkeletonPulse({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-white/[0.06]",
        className
      )}
      style={style}
    />
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border-glass bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonPulse className="h-3 w-20" />
        <SkeletonPulse className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonPulse className="h-7 w-24" />
      <SkeletonPulse className="h-2 w-full" />
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-6 py-3 border-b border-border-glass/50">
      <SkeletonPulse className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonPulse className="h-3.5 w-32" />
        <SkeletonPulse className="h-2.5 w-24" />
      </div>
      <SkeletonPulse className="h-5 w-14 rounded-full" />
      <SkeletonPulse className="h-3.5 w-16" />
      <SkeletonPulse className="h-3.5 w-20" />
    </div>
  );
}

function TextBlockSkeleton() {
  return (
    <div className="space-y-2.5">
      <SkeletonPulse className="h-3.5 w-full" />
      <SkeletonPulse className="h-3.5 w-4/5" />
      <SkeletonPulse className="h-3.5 w-3/5" />
      <SkeletonPulse className="h-3.5 w-full" />
      <SkeletonPulse className="h-3.5 w-2/3" />
    </div>
  );
}

function ChartPlaceholderSkeleton() {
  return (
    <div className="rounded-xl border border-border-glass bg-surface p-6">
      <SkeletonPulse className="mb-4 h-4 w-32" />
      <div className="flex items-end gap-2 h-40">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonPulse
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${30 + Math.random() * 70}%` } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function AvatarSkeleton() {
  return <SkeletonPulse className="h-10 w-10 rounded-full" />;
}

function InlineSkeleton() {
  return <SkeletonPulse className="h-4 w-24 inline-block" />;
}

const VARIANT_MAP: Record<SkeletonVariant, React.FC> = {
  card: CardSkeleton,
  tableRow: TableRowSkeleton,
  textBlock: TextBlockSkeleton,
  chartPlaceholder: ChartPlaceholderSkeleton,
  avatar: AvatarSkeleton,
  inline: InlineSkeleton,
};

export function LoadingSkeleton({
  variant = "card",
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const Component = VARIANT_MAP[variant];

  return (
    <div className={cn("space-y-3", className)} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
