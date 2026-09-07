import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/auth/login-schema";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginForm({ setActive }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Sign In — LMS Academy";
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const result = await login(data.email, data.password);
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else if (result.isAdmin) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setAuthError(
        err.message || "Failed to sign in. Please verify your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (email, pass) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
  };

  return (
    <div className="w-full bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/30 backdrop-blur-md animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-3 shadow-[0_0_15px_var(--color-accent-glow)]">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Sign in to access your Sindh Board LMS portal
        </p>
      </div>

      {/* Error Alert Box */}
      {authError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in shake duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed font-medium">{authError}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-foreground">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="student@example.com"
              disabled={isLoading}
              autoComplete="email"
              className="pl-10 h-11 text-xs rounded-xl bg-background/70 border-border focus:border-primary"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="password"
              className="text-xs font-bold text-foreground"
            >
              Password
            </Label>
            <button
              type="button"
              onClick={() => setActive("forget")}
              className="text-xs font-semibold text-primary hover:underline"
              tabIndex={-1}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
              className="pl-10 pr-10 h-11 text-xs rounded-xl bg-background/70 border-border focus:border-primary"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-11 text-sm font-bold rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-[0_4px_20px_var(--color-accent-glow)] hover:shadow-[0_6px_28px_var(--color-accent-glow)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all gap-2 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In to Portal
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Register */}
      <div className="mt-6 pt-5 border-t border-border/70 text-center">
        <p className="text-xs text-muted-foreground">
          New student seeking admission?{" "}
          <button
            type="button"
            onClick={() => setActive("register")}
            className="font-bold text-primary hover:underline ml-1"
          >
            Create an Account
          </button>
        </p>
      </div>

      {/* Quick Demo Access Bar */}
      <div className="mt-4 pt-3 border-t border-dashed border-border/60">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold text-center mb-2">
          Demo Quick Credentials
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill("irfanthalvi@gmail.com", "Admin@123")}
            className="px-2.5 py-1.5 rounded-lg bg-muted/40 hover:bg-muted border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-primary" /> Admin Portal
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill("student@lms.academy", "Student@123")}
            className="px-2.5 py-1.5 rounded-lg bg-muted/40 hover:bg-muted border border-border text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1"
          >
            <GraduationCap className="w-3 h-3 text-cyan-500" /> Student Demo
          </button>
        </div>
      </div>
    </div>
  );
}
