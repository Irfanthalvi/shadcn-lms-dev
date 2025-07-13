import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema } from "../validation/auth/otp-schema";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Otp = ({ email }) => {
  const navigate = useNavigate();
  const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    document.title = "Otp";
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^\d?$/.test(value)) {
      const newOtp = [...otpArray];
      newOtp[index] = value;
      setOtpArray(newOtp);
      setValue("otp", newOtp.join(""));
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = (data) => {
    console.log("OTP submitted:", data.otp, "for", email);
    navigate("/Subjects");
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-background text-foreground px-4 py-10">
      <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?"
        alt="Logo"
        className="h-12 mb-8"
      />
      <h2 className="text-4xl font-bold mb-10 text-center">Verify your account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <div>
          <Label className="text-lg text-center block mb-4">Enter OTP</Label>

          <div className="flex justify-center gap-2">
            {otpArray.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-10 h-10 text-center text-lg px-0"
              />
            ))}
          </div>

          <input type="hidden" {...register("otp")} />
          {errors.otp && (
            <p className="text-sm text-destructive mt-2 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full text-lg py-6">
          Verify OTP
        </Button>
      </form>

      <p className="mt-8 text-base text-muted-foreground">
        Didn’t get code?{" "}
        <Button
          type="button"
          variant="link"
          onClick={() => console.log("Resend clicked")}
          className="p-0 h-auto text-base font-semibold"
        >
          Resend
        </Button>
      </p>
    </div>
  );
};

export default Otp;
