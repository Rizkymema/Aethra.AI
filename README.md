<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/License-MIT-22C55E?style=for-the-badge" alt="MIT License" />
</p>

<h1 align="center">⚡ Aethra</h1>

<h3 align="center">
  <em>Next-Generation AI-Powered SaaS Productivity Platform</em>
</h3>

<p align="center">
  <strong>「 Chat with AI · Summarize Documents · Track Usage · Manage Your Team 」</strong>
</p>

<br />

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🎬 Demo

> 🔗 **Live Demo**: _Coming Soon_

<p align="center">
  <em>Aethra brings together a powerful AI workspace, detailed usage analytics, user management, and a sleek dark/light UI — all built on Next.js 15 with the App Router.</em>
</p>

---

## ✨ Features

### 🤖 AI Workspace
Dual-mode workspace powered by **GPT-4o**, **GPT-3.5 Turbo**, and **Claude 3**. Switch between **Generator** (content creation) and **Summarizer** (document analysis) with real-time streaming output and adjustable temperature control.

### 📜 Prompt History
Browse and revisit all previous AI interactions. Full prompt & output records with timestamps, token counts, and model details — accessible via a smooth drawer interface.

### 📊 Usage & Billing
Monitor your token consumption in real time with interactive charts (daily activity, monthly trends), plan limit indicators, and a complete usage history table.

### 🛡️ Admin Console
A full-featured admin panel to manage users, assign roles (`user` / `admin` / `blocked`), upgrade plans, and oversee platform-wide analytics.

### 🔐 Authentication
Clean login & registration flow with client-side form validation and error feedback.

### 🎨 Dark / Light Theme
System-aware theme switching powered by `next-themes` — seamlessly adapts to your OS preference or manual toggle.

### 📱 Responsive Layout
Collapsible animated sidebar with smooth Framer Motion transitions. Works beautifully on desktop and mobile.

### 💳 Plan Tiers

| Feature | Free | Pro | Enterprise |
|---------|:----:|:---:|:----------:|
| Monthly Tokens | 10K | 100K | Unlimited |
| AI Models | GPT-3.5 | GPT-4o + Claude 3 | All Models |
| History Access | ✅ | ✅ | ✅ |
| Usage Analytics | ❌ | ✅ | ✅ |
| Admin Console | ❌ | ❌ | ✅ |
| Priority Support | ❌ | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router + Turbopack) | 15 |
| **UI Library** | React | 19 |
| **Language** | TypeScript | 5 |
| **Styling** | Tailwind CSS | 4 |
| **Animations** | Framer Motion | 12 |
| **Charts** | Recharts | 3 |
| **Markdown** | react-markdown + remark-gfm | 10 |
| **Notifications** | Sonner | 2 |
| **Icons** | Lucide React | Latest |
| **Theme** | next-themes | 0.4 |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** / **yarn** / **pnpm** / **bun**

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Rizky211010/Aethra.AI.git
cd Aethra.AI
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Development Server

```bash
npm run dev
```

### 4️⃣ Open in Browser

```
http://localhost:3000
```

🎉 **Done!** Aethra is up and running.

---

## 📁 Project Structure

```
aethra/
├── 📂 app/
│   ├── 📂 (auth)/
│   │   └── 📂 auth/              # Login & registration page
│   ├── 📂 (dashboard)/
│   │   ├── 📂 dashboard/         # Overview & analytics
│   │   ├── 📂 workspace/         # AI chat + summarizer
│   │   ├── 📂 history/           # Prompt history
│   │   ├── 📂 usage/             # Token usage & billing
│   │   └── 📂 admin/             # Admin console
│   ├── 📄 layout.tsx             # Root layout + metadata
│   ├── 📄 page.tsx               # Entry point (redirect)
│   └── 📄 globals.css            # Global styles
│
├── 📂 components/
│   ├── 📂 auth/                  # AuthPage
│   ├── 📂 dashboard/             # Sidebar, Topbar, DashboardLayout
│   ├── 📂 workspace/             # AIWorkspace, WorkspaceInput, WorkspaceOutput
│   ├── 📂 history/               # HistoryPage, HistoryDrawer
│   ├── 📂 usage/                 # UsagePage
│   ├── 📂 admin/                 # AdminPanel
│   └── 📂 ui/                    # LoadingSkeleton & shared UI
│
├── 📂 constants/                 # Mock data & app-wide constants
├── 📂 types/                     # Global TypeScript type definitions
├── 📂 providers/                 # ThemeProvider
├── 📂 lib/                       # Utility functions & toast helpers
├── 📄 middleware.ts               # Route protection middleware
├── 📄 next.config.ts             # Next.js configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 package.json               # Dependencies & scripts
```

---

## 🌟 Highlights

<table>
  <tr>
    <td>✅ Next.js 15 App Router + Turbopack</td>
    <td>✅ Real-time AI streaming output</td>
  </tr>
  <tr>
    <td>✅ Multi-model support (GPT-4o, GPT-3.5, Claude 3)</td>
    <td>✅ Generator & Summarizer dual mode</td>
  </tr>
  <tr>
    <td>✅ Interactive usage charts (Recharts)</td>
    <td>✅ Admin user management panel</td>
  </tr>
  <tr>
    <td>✅ Smooth Framer Motion animations</td>
    <td>✅ Dark / Light theme switching</td>
  </tr>
  <tr>
    <td>✅ Collapsible responsive sidebar</td>
    <td>✅ Prompt history with drawer UI</td>
  </tr>
  <tr>
    <td>✅ Free / Pro / Enterprise plan tiers</td>
    <td>✅ Type-safe with TypeScript 5</td>
  </tr>
</table>

---

## 📋 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** this repository
2. Create a new branch:
   ```bash
   git checkout -b feat/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feat/your-feature
   ```
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — free to use for personal and commercial purposes.

---

<p align="center">
  <strong>⚡ Aethra — AI-Powered SaaS Productivity Platform</strong>
  <br />
  <em>「 Chat with AI · Summarize · Track Usage · Manage Your Team 」</em>
  <br /><br />
  Built with ❤️ using Next.js & TypeScript
  <br /><br />
  <img src="https://img.shields.io/badge/Built_with-Next.js_15-black?style=flat-square&logo=next.js" alt="Built with Next.js" />
  <img src="https://img.shields.io/badge/Powered_by-AI-412991?style=flat-square&logo=openai" alt="Powered by AI" />
  <img src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square" alt="MIT License" />
</p>
