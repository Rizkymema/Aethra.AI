/* ══════════════════════════════════════════════════
   AETHRA AI SaaS — Constants & Mock Data
   ══════════════════════════════════════════════════ */

import type {
  NavItem,
  PlanConfig,
  PlanFeature,
  AdminUser,
  Prompt,
  UsageStats,
  ActivityDataPoint,
  MonthlyUsageDataPoint,
  RecentActivity,
  UsageHistoryEntry,
  AIModel,
} from "@/types";

// ── Navigation Items ──

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Workspace", href: "/workspace", icon: "Sparkles", badge: 2 },
  { label: "History", href: "/history", icon: "Clock" },
  { label: "Usage & Billing", href: "/usage", icon: "BarChart3" },
];

export const ADMIN_NAV_ITEM: NavItem = {
  label: "Admin Console",
  href: "/admin",
  icon: "Shield",
};

// ── AI Model Options ──

export const AI_MODELS: { value: AIModel; label: string; description: string }[] = [
  { value: "gpt-4o", label: "GPT-4o", description: "Most capable, slower" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Fast & efficient" },
  { value: "claude-3", label: "Claude 3", description: "Great for analysis" },
];

// ── Plan Configurations ──

export const PLAN_CONFIGS: PlanConfig[] = [
  {
    name: "Free",
    tier: "free",
    price: "$0",
    tokenLimit: 10000,
    features: [
      "10,000 tokens/month",
      "GPT-3.5 Turbo only",
      "Basic text generation",
      "5 saved prompts",
      "Community support",
    ],
  },
  {
    name: "Pro",
    tier: "pro",
    price: "$19",
    tokenLimit: 500000,
    features: [
      "500,000 tokens/month",
      "All AI models",
      "Advanced summarizer",
      "Unlimited saved prompts",
      "Priority support",
      "API access",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    tier: "enterprise",
    price: "$99",
    tokenLimit: 5000000,
    features: [
      "5,000,000 tokens/month",
      "All AI models + custom",
      "Team workspace",
      "Admin panel",
      "SSO & SAML",
      "Dedicated support",
      "Custom integrations",
    ],
  },
];

export const PLAN_FEATURES: PlanFeature[] = [
  { label: "Monthly Tokens", free: "10K", pro: "500K", enterprise: "5M" },
  { label: "AI Models", free: "GPT-3.5", pro: "All Models", enterprise: "All + Custom" },
  { label: "Saved Prompts", free: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { label: "Text Generator", free: true, pro: true, enterprise: true },
  { label: "Summarizer", free: false, pro: true, enterprise: true },
  { label: "API Access", free: false, pro: true, enterprise: true },
  { label: "Team Workspace", free: false, pro: false, enterprise: true },
  { label: "Admin Panel", free: false, pro: false, enterprise: true },
  { label: "SSO / SAML", free: false, pro: false, enterprise: true },
  { label: "Support", free: "Community", pro: "Priority", enterprise: "Dedicated" },
];

// ── Mock Current User ──

export const MOCK_USER = {
  id: "usr_001",
  name: "Alex Chen",
  email: "alex@aethra.dev",
  role: "admin" as const,
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  plan: "pro" as const,
  createdAt: new Date("2025-06-15"),
};

// ── Mock Usage Stats ──

export const MOCK_USAGE_STATS: UsageStats = {
  tokensToday: 2847,
  tokensMonth: 187432,
  totalRequests: 1243,
  planTier: "pro",
  tokenLimit: 500000,
};

// ── Mock Activity Data (Last 7 Days) ──

export const MOCK_ACTIVITY_DATA: ActivityDataPoint[] = [
  { day: "Mon", requests: 23, tokens: 4520 },
  { day: "Tue", requests: 18, tokens: 3210 },
  { day: "Wed", requests: 31, tokens: 6430 },
  { day: "Thu", requests: 27, tokens: 5100 },
  { day: "Fri", requests: 42, tokens: 8920 },
  { day: "Sat", requests: 15, tokens: 2800 },
  { day: "Sun", requests: 8, tokens: 1560 },
];

// ── Mock Monthly Usage Data ──

export const MOCK_MONTHLY_DATA: MonthlyUsageDataPoint[] = [
  { month: "Aug", tokens: 120000, cost: 2.4 },
  { month: "Sep", tokens: 185000, cost: 3.7 },
  { month: "Oct", tokens: 210000, cost: 4.2 },
  { month: "Nov", tokens: 165000, cost: 3.3 },
  { month: "Dec", tokens: 240000, cost: 4.8 },
  { month: "Jan", tokens: 195000, cost: 3.9 },
  { month: "Feb", tokens: 187432, cost: 3.75 },
];

// ── Mock Recent Activity ──

export const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: "act_001",
    mode: "generator",
    promptPreview: "Write a professional email to decline a job offer politely...",
    tokensUsed: 342,
    createdAt: new Date("2026-02-22T09:30:00"),
  },
  {
    id: "act_002",
    mode: "summarizer",
    promptPreview: "Summarize the key findings from this research paper on quantum computing...",
    tokensUsed: 567,
    createdAt: new Date("2026-02-22T08:15:00"),
  },
  {
    id: "act_003",
    mode: "generator",
    promptPreview: "Create a TypeScript utility function for deep object merging...",
    tokensUsed: 891,
    createdAt: new Date("2026-02-21T17:45:00"),
  },
  {
    id: "act_004",
    mode: "generator",
    promptPreview: "Explain the difference between Server Components and Client Components...",
    tokensUsed: 456,
    createdAt: new Date("2026-02-21T14:20:00"),
  },
  {
    id: "act_005",
    mode: "summarizer",
    promptPreview: "Summarize the following meeting transcript into action items...",
    tokensUsed: 234,
    createdAt: new Date("2026-02-21T10:00:00"),
  },
];

// ── Mock Prompt History (20 entries) ──

export const MOCK_PROMPT_HISTORY: Prompt[] = Array.from({ length: 20 }, (_, i) => ({
  id: `prompt_${String(i + 1).padStart(3, "0")}`,
  userId: "usr_001",
  mode: (i % 3 === 0 ? "summarizer" : "generator") as "generator" | "summarizer",
  input: [
    "Write a professional bio for a software engineer with 5 years of experience in React and Node.js",
    "Summarize this article about the future of artificial intelligence in healthcare",
    "Create a marketing copy for a new SaaS productivity tool",
    "Explain microservices architecture to a junior developer",
    "Write unit tests for a React custom hook that manages form state",
    "Summarize the key points from this quarterly business report",
    "Generate a SQL query to find the top 10 customers by revenue",
    "Create a README template for an open-source TypeScript library",
    "Explain the CAP theorem with real-world examples",
    "Write a Dockerfile for a Next.js application with multi-stage builds",
    "Summarize the pros and cons of serverless architecture",
    "Create a design system documentation outline",
    "Write an API endpoint for user authentication with JWT",
    "Explain the Observer pattern with TypeScript examples",
    "Generate a project proposal for a mobile app MVP",
    "Summarize the latest trends in web development for 2026",
    "Create a bash script for automated database backups",
    "Write a technical blog post about WebSocket vs SSE",
    "Explain how garbage collection works in JavaScript",
    "Generate test data for an e-commerce application",
  ][i],
  output: `This is mock output for prompt ${i + 1}. In production, this would contain the AI-generated response with full markdown formatting, code blocks, and structured content.\n\n## Key Points\n\n- Point one with detailed explanation\n- Point two with code example\n- Point three with actionable insight\n\n\`\`\`typescript\nconst example = "This is a code block";\nconsole.log(example);\n\`\`\`\n\nThe response would typically be much longer and more detailed.`,
  tokensUsed: Math.floor(Math.random() * 800) + 200,
  model: (["gpt-4o", "gpt-3.5-turbo", "claude-3"] as const)[i % 3],
  temperature: [0.3, 0.5, 0.7, 0.9][i % 4],
  createdAt: new Date(Date.now() - i * 3600000 * (Math.random() * 12 + 2)),
}));

// ── Mock Usage History ──

export const MOCK_USAGE_HISTORY: UsageHistoryEntry[] = Array.from({ length: 30 }, (_, i) => ({
  id: `usage_${String(i + 1).padStart(3, "0")}`,
  date: new Date(Date.now() - i * 86400000),
  tool: (i % 3 === 0 ? "summarizer" : "generator") as "generator" | "summarizer",
  tokensUsed: Math.floor(Math.random() * 5000) + 500,
  cost: parseFloat((Math.random() * 0.5 + 0.01).toFixed(3)),
}));

// ── Mock Admin Users (15 entries) ──

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "usr_001", name: "Alex Chen", email: "alex@aethra.dev", role: "admin", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", plan: "enterprise", createdAt: new Date("2025-01-15"), tokensUsed: 487320, lastActive: new Date("2026-02-22T10:30:00"), isBlocked: false },
  { id: "usr_002", name: "Sarah Kim", email: "sarah@company.com", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", plan: "pro", createdAt: new Date("2025-03-20"), tokensUsed: 234100, lastActive: new Date("2026-02-22T09:15:00"), isBlocked: false },
  { id: "usr_003", name: "James Wong", email: "james@startup.io", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=James", plan: "free", createdAt: new Date("2025-05-10"), tokensUsed: 8750, lastActive: new Date("2026-02-21T16:45:00"), isBlocked: false },
  { id: "usr_004", name: "Maria Garcia", email: "maria@design.co", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria", plan: "pro", createdAt: new Date("2025-04-01"), tokensUsed: 312450, lastActive: new Date("2026-02-22T08:00:00"), isBlocked: false },
  { id: "usr_005", name: "David Park", email: "david@spam.net", role: "blocked", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=David", plan: "free", createdAt: new Date("2025-07-22"), tokensUsed: 9800, lastActive: new Date("2026-01-15T12:30:00"), isBlocked: true },
  { id: "usr_006", name: "Emma Wilson", email: "emma@tech.dev", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma", plan: "pro", createdAt: new Date("2025-02-28"), tokensUsed: 456700, lastActive: new Date("2026-02-22T11:00:00"), isBlocked: false },
  { id: "usr_007", name: "Liam Johnson", email: "liam@freelance.me", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam", plan: "free", createdAt: new Date("2025-08-15"), tokensUsed: 7200, lastActive: new Date("2026-02-20T14:20:00"), isBlocked: false },
  { id: "usr_008", name: "Aisha Patel", email: "aisha@enterprise.com", role: "admin", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha", plan: "enterprise", createdAt: new Date("2025-01-05"), tokensUsed: 890000, lastActive: new Date("2026-02-22T10:45:00"), isBlocked: false },
  { id: "usr_009", name: "Noah Martinez", email: "noah@agency.co", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah", plan: "pro", createdAt: new Date("2025-06-30"), tokensUsed: 178900, lastActive: new Date("2026-02-21T19:30:00"), isBlocked: false },
  { id: "usr_010", name: "Sophie Brown", email: "sophie@college.edu", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie", plan: "free", createdAt: new Date("2025-09-01"), tokensUsed: 4500, lastActive: new Date("2026-02-19T10:10:00"), isBlocked: false },
  { id: "usr_011", name: "Ryu Tanaka", email: "ryu@bot.spam", role: "blocked", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ryu", plan: "free", createdAt: new Date("2025-11-20"), tokensUsed: 9999, lastActive: new Date("2025-12-01T08:00:00"), isBlocked: true },
  { id: "usr_012", name: "Olivia Davis", email: "olivia@creative.studio", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia", plan: "pro", createdAt: new Date("2025-04-18"), tokensUsed: 289400, lastActive: new Date("2026-02-22T07:30:00"), isBlocked: false },
  { id: "usr_013", name: "Ethan Lee", email: "ethan@dev.tools", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan", plan: "pro", createdAt: new Date("2025-03-05"), tokensUsed: 345600, lastActive: new Date("2026-02-21T21:15:00"), isBlocked: false },
  { id: "usr_014", name: "Mia Thompson", email: "mia@data.science", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia", plan: "enterprise", createdAt: new Date("2025-02-14"), tokensUsed: 1234000, lastActive: new Date("2026-02-22T12:00:00"), isBlocked: false },
  { id: "usr_015", name: "Lucas Anderson", email: "lucas@newuser.com", role: "user", avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas", plan: "free", createdAt: new Date("2026-02-20"), tokensUsed: 150, lastActive: new Date("2026-02-22T06:45:00"), isBlocked: false },
];

// ── Suggested Prompts (Empty State) ──

export const SUGGESTED_PROMPTS = [
  "Write a professional email to a client about project delays",
  "Explain React Server Components in simple terms",
  "Create a TypeScript utility for form validation",
  "Summarize the key points of agile methodology",
];

// ── Quick Action Cards ──

// ── Quick Action Cards ──

export const DEMO_ACCOUNTS = [
  {
    label: "User Demo",
    email: "demo@aethra.dev",
    password: "demo1234",
    name: "Demo User",
    role: "user" as const,
    plan: "pro" as const,
    description: "Explore as a regular user",
    gradient: "from-[#6C63FF] to-[#8B5CF6]",
    dotColor: "bg-primary",
  },
  {
    label: "Admin Demo",
    email: "admin@aethra.dev",
    password: "admin1234",
    name: "Demo Admin",
    role: "admin" as const,
    plan: "enterprise" as const,
    description: "Full admin panel access",
    gradient: "from-[#F59E0B] to-[#D97706]",
    dotColor: "bg-warning",
  },
] as const;

export const QUICK_ACTIONS = [
  {
    label: "Text Generator",
    description: "Generate content, emails, docs",
    icon: "Sparkles",
    href: "/workspace?mode=generator",
    gradient: "from-[#6C63FF] to-[#8B5CF6]",
  },
  {
    label: "Summarizer",
    description: "Condense long text into key points",
    icon: "FileText",
    href: "/workspace?mode=summarizer",
    gradient: "from-[#00D4FF] to-[#06B6D4]",
  },
  {
    label: "History",
    description: "View your past generations",
    icon: "Clock",
    href: "/history",
    gradient: "from-[#10B981] to-[#059669]",
  },
  {
    label: "Settings",
    description: "Manage account & preferences",
    icon: "Settings",
    href: "/usage",
    gradient: "from-[#F59E0B] to-[#D97706]",
  },
];

// ── Streaming Mock Text ──

export const MOCK_STREAMING_TEXT = `## AI-Generated Response

Here's a comprehensive breakdown of your request:

### Key Points

1. **Modern Architecture** — Using a layered approach with clear separation of concerns ensures maintainability and scalability.

2. **Type Safety** — TypeScript strict mode catches errors at compile time, reducing runtime bugs by up to 40%.

3. **Performance** — Server-side rendering with Next.js App Router provides optimal initial load times.

### Code Example

\`\`\`typescript
interface AIResponse {
  id: string;
  content: string;
  model: string;
  tokensUsed: number;
  createdAt: Date;
}

async function generateContent(prompt: string): Promise<AIResponse> {
  const response = await fetch("/api/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model: "gpt-4o" }),
  });
  
  if (!response.ok) throw new Error("Generation failed");
  return response.json();
}
\`\`\`

### Summary

This approach provides a robust foundation for building scalable AI-powered applications. The combination of React Server Components, streaming responses, and type-safe data handling creates a premium user experience.

> **Pro Tip:** Use streaming for long responses to improve perceived performance and user engagement.
`;
