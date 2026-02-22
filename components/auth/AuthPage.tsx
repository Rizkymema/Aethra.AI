"use client";

import { useState, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Loader2,
  Github,
  Chrome,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DEMO_ACCOUNTS } from "@/constants";
import type { AuthFormData, AuthMode } from "@/types";

// ── Animation Variants ──

const shakeVariant = {
  shake: {
    x: [0, -8, 8, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
};

// ── Floating Label Input ──

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  error?: string;
  success?: boolean;
  endAdornment?: React.ReactNode;
}

function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  icon,
  error,
  success,
  endAdornment,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="relative">
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-white/5 transition-all duration-300",
          error
            ? "border-danger"
            : success
              ? "border-success"
              : focused
                ? "border-primary shadow-[0_0_12px_rgba(108,99,255,0.2)]"
                : "border-border-glass hover:border-border-glass-hover"
        )}
      >
        <span className="pl-4 text-text-muted">{icon}</span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer w-full bg-transparent px-3 py-4 text-sm text-text-primary outline-none placeholder-transparent"
          placeholder={label}
          aria-label={label}
          aria-invalid={!!error}
        />
        <motion.label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-11 text-text-muted transition-all duration-200",
            isActive
              ? "top-1 text-[10px] tracking-widest uppercase"
              : "top-1/2 -translate-y-1/2 text-sm"
          )}
          animate={{
            color: error
              ? "var(--danger)"
              : focused
                ? "var(--primary)"
                : "var(--text-muted)",
          }}
        >
          {label}
        </motion.label>
        {endAdornment && (
          <span className="pr-3">{endAdornment}</span>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 pl-1 text-xs text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Social Login Button ──

function SocialButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-center gap-3 rounded-xl border border-border-glass",
        "bg-white/5 px-4 py-3 text-sm font-medium text-text-primary",
        "transition-all duration-300 hover:border-border-glass-hover hover:bg-white/10",
        "hover:shadow-[0_0_16px_rgba(108,99,255,0.1)] focus-ring"
      )}
      aria-label={`Continue with ${label}`}
    >
      {icon}
      <span>Continue with {label}</span>
    </button>
  );
}

// ── Demo Account Quick-Fill Card ──

function DemoCard({
  account,
  onSelect,
}: {
  account: typeof DEMO_ACCOUNTS[number];
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex-1 overflow-hidden rounded-xl border border-border-glass bg-white/5 px-4 py-3 text-left",
        "transition-all duration-200 hover:border-border-glass-hover hover:bg-white/10"
      )}
      aria-label={`Use ${account.label} credentials`}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-5",
          account.gradient
        )}
      />
      <div className="flex items-center gap-2.5">
        <span className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", account.dotColor)} />
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text-primary">{account.label}</p>
          <p className="truncate text-[10px] text-text-muted">{account.description}</p>
        </div>
      </div>
    </button>
  );
}

// ── Main AuthPage Component ──

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldShake, setShouldShake] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [form, setForm] = useState<AuthFormData>({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof AuthFormData, string>>>({});

  const updateField = useCallback(
    (field: keyof AuthFormData) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      setError(null);
    },
    []
  );

  /** Validate form and return true if valid */
  const validate = (): boolean => {
    const errors: Partial<Record<keyof AuthFormData, string>> = {};

    if (!form.email.includes("@")) errors.email = "Invalid email address";
    if (form.password.length < 6) errors.password = "Min 6 characters";

    if (mode === "register") {
      if (!form.name || form.name.trim().length < 2) errors.name = "Name is required";
      if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords don't match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /** Fill form with demo credentials */
  const fillDemo = (account: typeof DEMO_ACCOUNTS[number]) => {
    setMode("login");
    setError(null);
    setFieldErrors({});
    setForm({ email: account.email, password: account.password, name: "", confirmPassword: "" });
  };

  /** Mock auth flow */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 600);
      return;
    }

    setIsLoading(true);

    // Check if using demo credentials — always succeed, no random failure
    const demoAccount = DEMO_ACCOUNTS.find(
      (d) => d.email === form.email && d.password === form.password
    );

    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Random failure only for non-demo credentials in login mode
    if (!demoAccount && mode === "login" && Math.random() < 0.3) {
      setIsLoading(false);
      setError("Invalid email or password");
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 600);
      return;
    }

    setIsLoading(false);
    setIsSuccess(true);

    // Admin demo goes to /admin, everyone else to /dashboard
    const redirectTo = demoAccount?.role === "admin" ? "/admin" : "/dashboard";
    setTimeout(() => {
      window.location.href = redirectTo;
    }, 800);
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement OAuth flow
    console.log(`${provider} login clicked`);
  };

  return (
    <div className="gradient-mesh flex min-h-screen items-center justify-center p-4">
      {/* Animated success overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="text-center"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <motion.svg
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="h-8 w-8 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path d="M5 13l4 4L19 7" />
                </motion.svg>
              </div>
              <p className="text-lg font-semibold text-text-primary">Welcome to Aethra!</p>
              <p className="text-sm text-text-muted">Redirecting to dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <motion.div
          variants={shakeVariant}
          animate={shouldShake ? "shake" : undefined}
          className={cn(
            "glass rounded-2xl p-8",
            "shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
              <span className="text-xl font-bold text-white">A</span>
            </div>
            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              Aethra
            </h1>
            <p className="mt-1 text-sm text-text-muted">AI Productivity Platform</p>
          </div>

          {/* Tab Switcher */}
          <div className="relative mb-8 flex rounded-xl bg-white/5 p-1">
            {(["login", "register"] as AuthMode[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setMode(tab);
                  setError(null);
                  setFieldErrors({});
                }}
                className={cn(
                  "relative z-10 flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200",
                  mode === tab ? "text-white" : "text-text-muted hover:text-text-primary"
                )}
                aria-label={`Switch to ${tab}`}
              >
                {tab === "login" ? "Log In" : "Register"}
              </button>
            ))}
            {/* Sliding indicator */}
            <motion.div
              layout
              layoutId="auth-tab-indicator"
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-lg bg-primary/80"
              style={{ left: mode === "login" ? 4 : "calc(50% + 0px)" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>

          {/* Demo Accounts */}
          <div className="mb-6">
            <p className="mb-2.5 text-center text-[10px] uppercase tracking-widest text-text-muted">
              Quick Demo Access
            </p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <DemoCard key={account.email} account={account} onSelect={() => fillDemo(account)} />
              ))}
            </div>
          </div>

          {/* Social Login */}
          <div className="mb-6 flex flex-col gap-3">
            <SocialButton
              icon={<Chrome className="h-5 w-5" />}
              label="Google"
              onClick={() => handleSocialLogin("google")}
            />
            <SocialButton
              icon={<Github className="h-5 w-5" />}
              label="GitHub"
              onClick={() => handleSocialLogin("github")}
            />
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border-glass" />
            <span className="text-xs uppercase tracking-widest text-text-muted">or</span>
            <div className="h-px flex-1 bg-border-glass" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FloatingInput
                    id="name"
                    label="Full Name"
                    value={form.name || ""}
                    onChange={updateField("name")}
                    icon={<User className="h-4 w-4" />}
                    error={fieldErrors.name}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <FloatingInput
              id="email"
              label="Email Address"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              icon={<Mail className="h-4 w-4" />}
              error={fieldErrors.email}
              success={form.email.includes("@") && form.email.includes(".")}
            />

            <FloatingInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={updateField("password")}
              icon={<Lock className="h-4 w-4" />}
              error={fieldErrors.password}
              success={form.password.length >= 6}
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-text-muted transition-colors hover:text-text-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <AnimatePresence mode="wait">
              {mode === "register" && (
                <motion.div
                  key="confirm-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FloatingInput
                    id="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword || ""}
                    onChange={updateField("confirmPassword")}
                    icon={<Lock className="h-4 w-4" />}
                    error={fieldErrors.confirmPassword}
                    success={
                      (form.confirmPassword?.length ?? 0) > 0 &&
                      form.password === form.confirmPassword
                    }
                    endAdornment={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-text-muted transition-colors hover:text-text-primary"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Global Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-2.5 text-sm text-danger"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.01 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className={cn(
                "relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white",
                "bg-gradient-to-r from-primary to-secondary",
                "transition-all duration-300 hover:shadow-[0_4px_20px_rgba(108,99,255,0.4)]",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "focus-ring"
              )}
              aria-label={mode === "login" ? "Log in" : "Create account"}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{mode === "login" ? "Logging in..." : "Creating account..."}</span>
                </>
              ) : (
                <span>{mode === "login" ? "Log In" : "Create Account"}</span>
              )}
            </motion.button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-xs text-text-muted">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="text-primary hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-primary hover:underline"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </motion.div>

        {/* Terms notice */}
        <p className="mt-6 text-center text-[11px] text-text-muted/60">
          By continuing, you agree to Aethra&apos;s{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Privacy Policy</span>
        </p>
      </motion.div>
    </div>
  );
}
