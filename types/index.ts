/* ══════════════════════════════════════════════════
   AETHRA AI SaaS — TypeScript Type Definitions
   ══════════════════════════════════════════════════ */

// ── Enums & Literal Types ──

export type PlanTier = "free" | "pro" | "enterprise";

export type UserRole = "user" | "admin" | "blocked";

export type AIModel = "gpt-4o" | "gpt-3.5-turbo" | "claude-3";

export type WorkspaceMode = "generator" | "summarizer";

export type ToolType = "generator" | "summarizer" | "all";

export type SortDirection = "asc" | "desc";

// ── User ──

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  plan: PlanTier;
  createdAt: Date;
}

// ── Admin User (extends User with management fields) ──

export interface AdminUser extends User {
  tokensUsed: number;
  lastActive: Date;
  isBlocked: boolean;
}

// ── Auth ──

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
}

export type AuthMode = "login" | "register";

// ── Prompt / Message ──

export interface Prompt {
  id: string;
  userId: string;
  mode: WorkspaceMode;
  input: string;
  output: string;
  tokensUsed: number;
  model: AIModel;
  temperature: number;
  createdAt: Date;
}

// ── Usage Stats ──

export interface UsageStats {
  tokensToday: number;
  tokensMonth: number;
  totalRequests: number;
  planTier: PlanTier;
  tokenLimit: number;
}

// ── Usage History Entry ──

export interface UsageHistoryEntry {
  id: string;
  date: Date;
  tool: WorkspaceMode;
  tokensUsed: number;
  cost: number;
}

// ── Navigation ──

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

// ── Plan ──

export interface PlanFeature {
  label: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

export interface PlanConfig {
  name: string;
  tier: PlanTier;
  price: string;
  tokenLimit: number;
  features: string[];
  highlighted?: boolean;
}

// ── Chart Data ──

export interface ActivityDataPoint {
  day: string;
  requests: number;
  tokens: number;
}

export interface MonthlyUsageDataPoint {
  month: string;
  tokens: number;
  cost: number;
}

// ── Recent Activity ──

export interface RecentActivity {
  id: string;
  mode: WorkspaceMode;
  promptPreview: string;
  tokensUsed: number;
  createdAt: Date;
}

// ── Component Props ──

export interface WorkspaceInputProps {
  onSubmit: (input: string, model: AIModel, temperature: number) => void;
  isLoading: boolean;
  mode: WorkspaceMode;
  onModeChange: (mode: WorkspaceMode) => void;
}

export interface WorkspaceOutputProps {
  content: string;
  isStreaming: boolean;
  onRegenerateAction: () => void;
  onSaveAction: () => void;
}

export interface HistoryDrawerProps {
  prompt: Prompt | null;
  isOpen: boolean;
  onClose: () => void;
  onRerun: (prompt: Prompt) => void;
}
