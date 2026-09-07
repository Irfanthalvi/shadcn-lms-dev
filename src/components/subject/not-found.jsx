import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Home, GraduationCap } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-30 dark:opacity-50"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-card border border-border/80 shadow-2xl shadow-black/10 dark:shadow-black/40 backdrop-blur-md">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-[0_0_20px_var(--color-accent-glow)]">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The curriculum section, chapter, or assessment you are looking for does not exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto text-xs font-semibold rounded-xl h-10 gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go Back
          </Button>

          <Button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto text-xs font-bold rounded-xl h-10 px-5 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-[0_4px_20px_var(--color-accent-glow)] hover:shadow-[0_6px_28px_var(--color-accent-glow)] gap-1.5"
          >
            <Home className="w-3.5 h-3.5" /> Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
