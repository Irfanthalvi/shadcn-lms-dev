import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/auth/login-schema";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const LoginForm = ({ setActive }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "Login — School Management System";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError("");

    try {
      const result = await login(data.email, data.password);
      
      // Determine destination
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (result.isAdmin) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/subjects", { replace: true });
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setAuthError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 py-10 bg-background text-foreground">
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg"
        alt="Logo"
        className="h-12 mb-8"
      />
      <h2 className="text-4xl font-bold mb-2 text-center">Sign in to your account</h2>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Enter your credentials to access your LMS account
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Error Alert Box */}
        {authError && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{authError}</div>
          </div>
        )}

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
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Button
              variant="link"
              type="button"
              onClick={() => setActive("forget")}
              className="text-sm p-0 h-auto text-primary"
              tabIndex={-1}
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
            {...register("password")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <p className="mt-8 text-base text-muted-foreground">
        Not a member?{" "}
        <Button
          variant="link"
          type="button"
          onClick={() => setActive("register")}
          className="text-base font-semibold p-0 h-auto text-primary"
        >
          Register now
        </Button>
      </p>
    </div>
  );
};

export default LoginForm;
