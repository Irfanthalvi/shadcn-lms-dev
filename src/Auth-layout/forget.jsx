import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetSchema } from "../validation/auth/forget-schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Forget = ({ setActive }) => {
  useEffect(() => {
    document.title = "Forgot Password ";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgetSchema),
  });

  const onSubmit = (data) => {
    console.log("Reset link sent to:", data.email);
    // Add reset logic here
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background text-foreground px-4 py-10">
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?"
        alt="Logo"
        className="h-12 mb-8"
      />
      <h2 className="text-4xl font-bold mb-10 text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-lg">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full text-lg py-6">
          Send Reset Link
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
