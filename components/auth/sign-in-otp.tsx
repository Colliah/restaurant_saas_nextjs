"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { signInWithOTP } from "@/lib/actions/auth-actions";
import { toast } from "sonner";

export function SignInOTPForm({ email }: { email: string }) {
  const router = useRouter();

  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (otp.length !== 6) throw new Error("OTP must have 6 digits");

      const result = await signInWithOTP(email, otp);

      if (result.success) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Invalid OTP, please try again");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "OTP verification failed"
      );
    }
  };

  return (
    <Card className="max-w-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
        <CardDescription className="text-center">
          6 digits number sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button type="submit" className="w-full">
            Verify OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
