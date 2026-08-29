import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/auth/logout-schema";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Register = ({ setActive }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const { register: registerAuthUser } = useAuth();

  useEffect(() => {
    document.title = "Register — School Management System";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError("");

    try {
      await registerAuthUser(data.name, data.email, data.password);
      toast.success("Account created successfully! Please sign in.");
      setActive("login");
    } catch (err) {
      console.error("Registration error:", err);
      setAuthError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background text-foreground px-4 py-10">
      {/* Logo */}
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg"
        alt="Logo"
        className="h-12 mb-8 text-primary"
      />

      <h2 className="text-4xl font-bold mb-2 text-center">Create your account</h2>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Sign up for the School Management System
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Error Alert */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{authError}</div>
          </div>
        )}

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            autoComplete="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            disabled={isLoading}
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2 relative">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="new-password"
            {...register("password")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full text-sm py-5 h-12" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating account...
            </span>
          ) : (
            "Register"
          )}
        </Button>
      </form>

      {/* Login link */}
      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          onClick={() => setActive("login")}
          className="p-0 h-auto text-sm font-semibold text-primary"
        >
          Sign in
        </Button>
      </p>
    </div>
  );
};

export default Register;
