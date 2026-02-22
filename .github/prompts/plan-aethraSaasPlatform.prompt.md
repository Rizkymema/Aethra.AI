# Plan: AI SaaS Platform — 6 Fase Build

**Stack**: Next.js 15 App Router + React 19 + Tailwind v4 (CSS-first) + TypeScript strict. Workspace saat ini adalah scaffold kosong — semua 6 fase dibangun di atasnya. Setiap fase menghasilkan deliverable yang bisa ditest sebelum lanjut ke fase berikutnya.

---

## Pre-Flight: Package Installation

Sebelum fase apapun dimulai, install semua dependensi yang dibutuhkan dalam satu `npm install`:

```
framer-motion       → animasi
clsx                → conditional classnames
tailwind-merge      → merge Tailwind classes
lucide-react        → icon set
recharts            → charts (usage, activity)
react-markdown      → render output AI sebagai Markdown
remark-gfm          → GitHub Flavored Markdown support
next-themes         → dark/light mode + localStorage
sonner              → toast notifications (lebih ringan dari react-hot-toast)
```

---

## FASE 0 — Foundation Setup

**File yang dibuat/dimodifikasi:**

1. `app/globals.css` — Tambahkan `@theme inline` block dengan semua CSS variables: brand colors (primary violet, accent cyan, semantic success/warning/error), radius tokens, shadow tokens, dan keyframe animations (`shimmer`, `gradient-shift`, `fade-up`)

2. Buat `lib/utils.ts` — Fungsi `cn()` menggunakan `clsx` + `tailwind-merge`

3. Buat `types/index.ts` — Semua TypeScript interfaces:
   - `User` (id, name, email, role, avatarUrl, createdAt)
   - `Prompt` (id, userId, mode, input, output, tokensUsed, model, createdAt)
   - `UsageStats` (tokensToday, tokensMonth, totalRequests, planTier)
   - `AdminUser` (extends User + usageStats, lastActive, isBlocked)
   - `AuthForm` (email, password, name?, confirmPassword?)
   - `NavItem`, `PlanTier`, `AIModel` enums/types

4. Buat `constants/index.ts` — Nav items array, plan limits object, AI model options, mock data (users, prompts, usage stats)

5. **Folder structure** yang dibuat:
   ```
   app/
     (auth)/auth/page.tsx
     (dashboard)/
       dashboard/page.tsx
       workspace/page.tsx
       history/page.tsx
       usage/page.tsx
     (admin)/admin/page.tsx
     api/ai/route.ts (stub)
   components/
     auth/
     dashboard/
     workspace/
     usage/
     history/
     admin/
     ui/  ← shared primitives
   lib/
   types/
   constants/
   hooks/
   providers/
   ```

---

## FASE 1 — Authentication Layer

**File yang dibuat:**

1. Buat `components/auth/AuthPage.tsx`:
   - Background: animated gradient mesh menggunakan CSS keyframes dari globals.css
   - Glassmorphism card: `backdrop-blur-xl bg-white/10 border border-white/20`
   - Tab switcher Login/Register dengan `framer-motion` `layoutId` sliding indicator
   - Social buttons: Google + GitHub (UI only, dengan TODO comment untuk OAuth handler)
   - Floating label inputs: label animasi naik saat input focused/filled via Framer Motion
   - Password visibility toggle dengan Lucide `Eye`/`EyeOff`
   - Error state: `shake` animation via keyframe di globals.css
   - Submit: loading spinner state + success `fade-up` transition

2. Buat `app/(auth)/auth/page.tsx` — Render `AuthPage`

---

## FASE 2 — Dashboard Shell & Navigation

**File yang dibuat:**

1. Buat `components/dashboard/Sidebar.tsx`:
   - Fixed 240px, collapse ke 64px via Framer Motion `width` animation
   - Active nav: left border glow (`border-l-2 border-violet-500`) + `bg-white/5` highlight
   - Badge notifikasi: optional number overlay di nav item
   - Bottom: `UsageWidget` mini (progress bar token usage), user avatar + nama + logout
   - Mobile: collapse otomatis, icon-only

2. Buat `components/dashboard/DashboardContent.tsx`:
   - Greeting banner: gradient text + `new Date().toLocaleDateString()`
   - Quick Action Cards 2×2 grid: Framer Motion `staggerChildren` entrance
   - Recharts `BarChart` aktivitas 7 hari — mock data, `// TODO: replace with API`
   - Recent Activity Feed: 5 baris compact dengan Framer Motion

3. Buat `components/dashboard/Topbar.tsx`:
   - Search bar, notification bell (badge), theme toggle, user avatar dropdown

4. Buat `components/dashboard/DashboardLayout.tsx`:
   - Gabungkan Sidebar + Topbar + `{children}` slot
   - Mobile: Sidebar ganti jadi bottom navigation bar (`fixed bottom-0`)

5. Buat `app/(dashboard)/dashboard/page.tsx` — Render layout + content

---

## FASE 3 — AI Workspace (Core Feature)

**File yang dibuat:**

1. Buat `components/workspace/WorkspaceInput.tsx`:
   - Mode toggle pill "Text Generator" / "Summarizer" dengan Framer Motion `layoutId`
   - `textarea` auto-resize via `scrollHeight` + token counter real-time (karakter / 4)
   - Model selector: custom dropdown dengan GPT-4o, GPT-3.5-turbo, Claude 3
   - Temperature slider: HTML `range` input dengan label nilai
   - Submit: responsive button + `Ctrl+Enter` event listener
   - Character limit: warning state di 80%, error di 100%
   - Props: `onSubmit`, `isLoading`, `mode`

2. Buat `components/workspace/WorkspaceOutput.tsx`:
   - Streaming simulation: `useEffect` dengan `requestAnimationFrame` + state `displayedText`
   - `react-markdown` + `remark-gfm` untuk render output
   - Code blocks: custom renderer dengan copy button per block (Lucide `Copy`)
   - Floating action bar: Copy, Regenerate, Save, Share (hanya icon + tooltip)
   - Empty state: inline SVG ilustrasi minimalis + 4 prompt suggestion chips
   - Loading skeleton via shared `LoadingSkeleton` component
   - Props: `content`, `isStreaming`, `onRegenerate`, `onSave`

3. Buat `components/workspace/AIWorkspace.tsx`:
   - Split panel: history sidebar kiri (collapsible) + main panel kanan
   - State: `mode`, `messages: Prompt[]`, `isStreaming`
   - Session history sidebar: list prompt sebelumnya dari mock data
   - Streaming simulation menggunakan mock text

4. Buat `app/(dashboard)/workspace/page.tsx`

---

## FASE 4 — Data & Management Pages

**File yang dibuat:**

1. Buat `components/usage/UsagePage.tsx`:
   - Stats row: 4 kartu dengan angka animated (Framer Motion `useSpring`)
   - Progress bars: warna dinamis berdasarkan persentase (green→orange→red via CSS vars)
   - Upgrade CTA banner + plan comparison tabel 3 kolom (Free/Pro/Enterprise)
   - Usage history table: Date, Tool, Tokens, Cost — sortable via `useState` sort key
   - Recharts `AreaChart` bulanan

2. Buat `components/history/HistoryPage.tsx`:
   - Sticky filter bar: search, date range (2 input type=date), tool dropdown, sort
   - List item: date badge, color-coded tool pill, truncated prompt, token count, actions
   - Mock data 20 entri di `constants/index.ts`

3. Buat `components/history/HistoryDrawer.tsx`:
   - Slide-in dari kanan via Framer Motion `x: "100%"` → `x: 0`
   - Full prompt + full markdown output + metadata + re-run button
   - Overlay backdrop yang bisa diklik untuk menutup

4. Buat `app/(dashboard)/history/page.tsx` dan `app/(dashboard)/usage/page.tsx`

---

## FASE 5 — Admin Panel

**File yang dibuat:**

1. Buat `components/admin/AdminPanel.tsx`:
   - Stats bar: Total Users, Active Today, Total Tokens, Revenue MRR
   - Data table dengan kolom: Avatar+Nama, Email, Role Badge, Tokens Used, Last Active, Actions
   - Role Badge: `User` (blue), `Admin` (violet), `Blocked` (red) — via variant map
   - Actions per row: role dropdown inline, reset usage (dengan confirm dialog), block/unblock toggle
   - Table sorting + search filter via `useState`
   - Mobile: `overflow-x-auto` + `min-w-[800px]` untuk horizontal scroll
   - Comment `// TODO: implement role-check middleware` di top file

2. Buat `app/(admin)/admin/page.tsx`

---

## FASE 6 — Polish & Integration

**File yang dibuat:**

1. Buat `providers/ThemeProvider.tsx` — Wrap `next-themes` `ThemeProvider`, update `app/layout.tsx` untuk include provider

2. Buat `components/ui/LoadingSkeleton.tsx` — Variants: `card`, `tableRow`, `textBlock`, `chartPlaceholder` via prop `variant`

3. Setup **Sonner** toast di `app/layout.tsx` — tambahkan `<Toaster />` component, buat `lib/toast.ts` dengan helper `toast.success()`, `toast.error()`, `toast.info()`

4. Buat `middleware.ts` di root — Next.js middleware:
   - Unauthenticated → redirect ke `/auth`
   - Non-admin request ke `/admin` → redirect ke `/dashboard`
   - Gunakan mock session check (`// TODO: replace with real auth`)

5. Lengkapi `constants/index.ts` — Nav items array, plan limits, mock users (15 entri untuk admin), sample prompts (20 entri), AI model configs

6. **Accessibility pass** di semua komponen: tambahkan `aria-label`, `role`, `aria-expanded` pada interactive elements

---

## Verification Per Fase

| Fase | Test |
|---|---|
| 0 | `npm run dev` tanpa error, CSS variables terlihat di DevTools |
| 1 | Navigasi ke `/auth`, tab switch Login/Register berfungsi |
| 2 | Navigasi ke `/dashboard`, sidebar collapse di mobile berfungsi |
| 3 | Navigasi ke `/workspace`, streaming simulasi berjalan |
| 4 | `/history` drawer slide-in, `/usage` progress bar warna berubah |
| 5 | `/admin` role badge tampil, table sortable |
| 6 | Theme toggle persist di refresh, toast muncul, redirect middleware aktif |

---

## Decisions

- **Tailwind v4**: Tidak ada `tailwind.config.ts` — semua token custom via `@theme inline` di `app/globals.css`
- **Auth**: UI-only (no NextAuth/Clerk) dengan `// TODO` comments — pilihan library auth diserahkan ke fase selanjutnya
- **Database**: Semua data menggunakan mock dari `constants/index.ts` — tidak ada ORM/DB di rencana ini
- **Streaming**: Simulasi client-side, bukan real AI SDK streaming — mudah diganti dengan `useChat` dari Vercel AI SDK nantinya
- **next-themes**: Dipilih atas solusi custom karena sudah support Next.js App Router dan localStorage otomatis
