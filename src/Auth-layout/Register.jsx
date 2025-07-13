import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/auth/logout-schema";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Register = ({ setActive }) => {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Register";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    console.log("Registration Data:", data);
    setActive("login");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background text-foreground px-4 py-10">
      {/* Logo */}
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg"
        alt="Logo"
        className="h-12 mb-8 text-primary"
      />

      <h2 className="text-4xl font-bold mb-10 text-center">Create your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
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
            {...register("password")}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-muted-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full text-sm py-5">
          Register
        </Button>
      </form>

      {/* Login link */}
      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          onClick={() => setActive("login")}
          className="p-0 h-auto text-sm font-semibold"
        >
          Sign in
        </Button>
      </p>
    </div>
  );
};

export default Register;
