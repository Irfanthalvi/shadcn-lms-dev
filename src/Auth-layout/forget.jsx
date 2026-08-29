import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetSchema } from "../validation/auth/forget-schema";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Forget = ({ setActive }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const { resetPassword } = useAuth();

  useEffect(() => {
    document.title = "Forgot Password — School Management System";
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
      toast.success("Password reset instructions sent to your email!");
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrorMessage(err.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background text-foreground px-4 py-10">
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg"
        alt="Logo"
        className="h-12 mb-8"
      />
      <h2 className="text-4xl font-bold mb-2 text-center">Forgot Password</h2>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Enter your email address to receive password reset instructions
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Success Alert */}
        {sentSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">
              If an account with that email exists, password reset instructions have been sent.
            </div>
          </div>
        )}

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            disabled={isLoading}
            autoComplete="email"
            {...register("email")}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full text-lg h-12" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Link...
            </span>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <p className="mt-8 text-base text-muted-foreground">
        Remember your password?{" "}
        <button
          type="button"
          onClick={() => setActive("login")}
          className="text-primary font-semibold hover:underline"
        >
          Back to Login
        </button>
      </p>
    </div>
  );
};

export default Forget;
