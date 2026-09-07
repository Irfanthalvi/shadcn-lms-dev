import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetSchema } from "../validation/auth/forget-schema";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function ForgetForm({ setActive }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const { resetPassword } = useAuth();

  useEffect(() => {
    document.title = "Reset Password — LMS Academy";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgetSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setErrorMessage("");
    setSentSuccess(false);

    try {
      await resetPassword(data.email);
      setSentSuccess(true);
      toast.success("Password reset instructions dispatched!");
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrorMessage(
        err.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/30 backdrop-blur-md animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-3 shadow-[0_0_15px_var(--color-accent-glow)]">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Forgot Password
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Enter your registered email to receive a password reset link
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in shake duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Success Alert */}
      {sentSuccess && (
        <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed font-medium">
            Password reset link sent! Check your inbox to set a new password.
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-foreground">
            Registered Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              disabled={isLoading}
              autoComplete="email"
              className="pl-10 h-11 text-xs rounded-xl bg-background/70 border-border focus:border-primary"
              {...register("email")}
              placeholder="student@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 text-sm font-bold rounded-xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white shadow-[0_4px_20px_var(--color-accent-glow)] hover:shadow-[0_6px_28px_var(--color-accent-glow)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all gap-2 mt-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Dispatching Link...
            </>
          ) : (
            "Send Reset Instructions"
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 pt-5 border-t border-border/70 text-center">
        <button
          type="button"
          onClick={() => setActive("login")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>
      </div>
    </div>
  );
}
