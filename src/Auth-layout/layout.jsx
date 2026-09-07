import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "./Login";
import RegisterForm from "./Register";
import ForgetForm from "./forget";
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Trophy,
  Sun,
  Moon,
  Clock,
  Layers,
} from "lucide-react";
import { useLms } from "@/context/LmsContext";

export default function AuthLayout({ defaultForm = "login", activeForm }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useLms();

  // Resolve form based on path or prop
  const currentForm = (() => {
    if (location.pathname === "/register") return "register";
    if (location.pathname === "/forget") return "forget";
    if (location.pathname === "/login") return "login";
    return activeForm || defaultForm || "login";
  })();

  const [active, setActive] = useState(currentForm);

  useEffect(() => {
    setActive(currentForm);
  }, [currentForm]);

  const handleSetActive = (form) => {
    setActive(form);
    navigate(`/${form}`);
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground relative overflow-x-hidden">
      {/* Theme Toggle in Top Corner */}
      <div className="absolute top-4 right-4 z-50">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border/80 text-foreground hover:border-primary/50 text-xs font-semibold backdrop-blur-md shadow-sm transition-all hover:scale-105"
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Dark Mode</span>
            </>
          )}
        </button>
      </div>

      {/* LEFT SECTION: Modern Educational / SaaS Visual Hero (visible on lg screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-card/40 border-r border-border/60 flex-col justify-between p-12 overflow-hidden select-none">
        {/* Ambient Glows inspired by portfolio */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full z-0 opacity-40 dark:opacity-60"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-glow) 0%, rgba(6, 182, 212, 0.15) 40%, transparent 70%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-40 w-[650px] h-[650px] rounded-full z-0 opacity-30 dark:opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, transparent 70%)",
          }}
        />

        {/* Top Branding */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-cyan-500 text-white flex items-center justify-center font-black text-base shadow-[0_4px_20px_var(--color-accent-glow)]">
              LM
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-1.5">
                LMS ACADEMY
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono border border-primary/30">
                  STBB 2026
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Sindh Textbook Board Comprehensive Learning Portal
              </p>
            </div>
          </div>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 my-auto py-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 border border-primary/30 px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
            Class 8, 9, 10, 11 &amp; 12 Curriculum
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
            Master Your Board Exams With Structured{" "}
            <span className="gradient-accent-text font-black">
              Sindh Board Learning
            </span>
          </h1>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Experience an institutional digital education ecosystem built for
            students and administrators: official textbooks, chapter-wise learning
            outcomes, virtual timed exams, and real-time performance analytics.
          </p>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 gap-3.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">
                Official Textbooks
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Complete Sindh Textbook Board (Jamshoro) aligned notes &amp; chapters.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">
                Virtual Exam Mode
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Timed self-assessments, auto-submission, instant grading &amp; reviews.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">
                Class-Specific Access
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Enrolled students access only their relevant class curriculum.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-card/60 border border-border/70 backdrop-blur-md space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="font-bold text-xs text-foreground">
                Verified Performance
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Track progress, assignment submissions, and examination scorecards.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} LMS Academy • Sindh Board Education</span>
          <span className="font-mono text-[11px]">v2.5 Production Build</span>
        </div>
      </div>

      {/* RIGHT SECTION: Auth Cards Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 overflow-y-auto">
        <div className="w-full max-w-md py-6">
          {active === "login" && <LoginForm setActive={handleSetActive} />}
          {active === "register" && <RegisterForm setActive={handleSetActive} />}
          {active === "forget" && <ForgetForm setActive={handleSetActive} />}
        </div>
      </div>
    </div>
  );
}
