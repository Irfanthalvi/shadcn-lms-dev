import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/auth/login-schema";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginForm = ({ setActive }) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Login";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log("Login Data:", data);
    setActive("otp");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center px-4 py-10 bg-background text-foreground">
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?"
        alt="Logo"
        className="h-12 mb-8"
      />
      <h2 className="text-4xl font-bold mb-10 text-center">Sign in to your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
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
              className="text-sm p-0 h-auto"
            >
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-[38px] text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full text-lg">
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-base text-muted-foreground">
        Not a member?{" "}
        <Button
          variant="link"
          type="button"
          onClick={() => setActive("register")}
          className="text-base font-semibold p-0 h-auto"
        >
          Register now
        </Button>
      </p>
    </div>
  );
};

export default LoginForm;
