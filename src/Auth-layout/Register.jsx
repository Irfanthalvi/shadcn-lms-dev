import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/auth/logout-schema";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  GraduationCap,
  ChevronDown,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { subscribeToClasses } from "@/services/lmsService";
import toast from "react-hot-toast";

export default function RegisterForm({ setActive }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successNotice, setSuccessNotice] = useState(false);

  const [classes, setClasses] = useState([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const { register: registerAuthUser } = useAuth();

  useEffect(() => {
    document.title = "Student Admission Registration — LMS Academy";
  }, []);

  // Load real classes from Firestore.
  // This ensures registration uses the actual Firestore class document ID.
  useEffect(() => {
    setClassesLoading(true);

    const unsubscribe = subscribeToClasses((list) => {
      setClasses(list);
      setClassesLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      classId: "",
    },
  });

  const selectedClassId = watch("classId");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError("");

    // Find the selected class from the actual Firestore classes.
    const selectedClass = classes.find(
      (classItem) => String(classItem.id) === String(data.classId)
    );

    if (!selectedClass) {
      setAuthError("Please select a valid class.");
      setIsLoading(false);
      return;
    }

    try {
      await registerAuthUser(
        data.name.trim(),
        data.email.trim(),
        data.password,
        selectedClass.id,
        selectedClass.name
      );

      setSuccessNotice(true);

      toast.success(
        "Application submitted! Awaiting administrator approval before account activation.",
        { duration: 7000 }
      );
    } catch (err) {
      console.error("Registration error:", err);

      setAuthError(
        err?.message ||
        "Registration failed. Please review your details and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (successNotice) {
    return (
      <div className="w-full bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/30 text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.25)]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-foreground">
            Admission Registered!
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your admission profile has been created and submitted to the
            institutional admin directory. You will be able to sign in as
            soon as your account is approved.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />

          <span>
            Class access is restricted until administrator authorization.
          </span>
        </div>

        <Button
          onClick={() => setActive("login")}
          className="w-full h-11 text-xs font-bold rounded-xl bg-primary text-primary-foreground shadow-sm hover:brightness-110"
        >
          Return to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-black/5 dark:shadow-black/30 backdrop-blur-md animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-3 shadow-[0_0_15px_var(--color-accent-glow)]">
          <GraduationCap className="w-6 h-6" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Student Admission
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Register for your official Sindh Board curriculum class
        </p>
      </div>

      {/* Error Alert Box */}
      {authError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in shake duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

          <div className="flex-1 leading-relaxed font-medium">
            {authError}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-name"
            className="text-xs font-bold text-foreground"
          >
            Student Full Name
          </Label>

          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

            <Input
              id="reg-name"
              type="text"
              placeholder="e.g. Irfan Ali"
              disabled={isLoading}
              autoComplete="name"
              className="pl-10 h-11 text-xs rounded-xl bg-background/70 border-border focus:border-primary"
              {...register("name")}
            />
          </div>

          {errors.name && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-email"
            className="text-xs font-bold text-foreground"
          >
            Email Address
          </Label>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

            <Input
              id="reg-email"
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

        {/* Class Selection */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label
              htmlFor="reg-class"
              className="text-xs font-bold text-foreground"
            >
              Select Enrolled Class (8 - 12)
            </Label>

            <span className="text-[10px] font-mono text-primary font-bold">
              Sindh Board
            </span>
          </div>

          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />

            <select
              id="reg-class"
              disabled={isLoading || classesLoading}
              value={selectedClassId || ""}
              onChange={(e) =>
                setValue("classId", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-background/70 text-xs font-semibold text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary disabled:opacity-50"
            >
              <option value="" disabled>
                {classesLoading
                  ? "Loading classes..."
                  : classes.length === 0
                    ? "No classes available"
                    : "Select your academic class..."}
              </option>

              {!classesLoading &&
                classes.map((classItem) => (
                  <option
                    key={classItem.id}
                    value={classItem.id}
                    className="bg-card text-foreground"
                  >
                    {classItem.name}
                  </option>
                ))}
            </select>

            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>

          {errors.classId && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.classId.message}
            </p>
          )}

          <p className="text-[11px] text-muted-foreground leading-snug">
            Your admission will restrict access strictly to this class's
            textbooks, quizzes, and learning materials.
          </p>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label
            htmlFor="reg-password"
            className="text-xs font-bold text-foreground"
          >
            Create Password
          </Label>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

            <Input
              id="reg-password"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              disabled={isLoading}
              autoComplete="new-password"
              className="pl-10 pr-10 h-11 text-xs rounded-xl bg-background/70 border-border focus:border-primary"
              {...register("password")}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
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
          disabled={isLoading || classesLoading || classes.length === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting Admission...
            </>
          ) : classesLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading Classes...
            </>
          ) : (
            <>
              Register for Admission
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 pt-5 border-t border-border/70 text-center">
        <p className="text-xs text-muted-foreground">
          Already registered for an account?{" "}
          <button
            type="button"
            onClick={() => setActive("login")}
            className="font-bold text-primary hover:underline ml-1"
          >
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  );
}