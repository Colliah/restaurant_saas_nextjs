"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, Shield, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Link from "next/link";

type Step = "email" | "otp" | "password" | "success";

export default function ForgotPasswordForm() {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    await authClient.forgetPassword.emailOtp({
      email: email,
      fetchOptions: {
        onSuccess() {
          setCurrentStep("otp");
        },
      },
    });
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.emailOtp.checkVerificationOtp({
      email: email,
      type: "forget-password",
      otp: otp,
      fetchOptions: {
        onSuccess() {
          setCurrentStep("password");
        },
      },
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.emailOtp.resetPassword({
      email: email,
      otp: otp,
      password: newPassword,
      fetchOptions: {
        onSuccess() {
          setCurrentStep("success");
        },
      },
    });
  };

  const renderEmailStep = () => (
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">
          Forgot Password?
        </CardTitle>
        <CardDescription className="text-muted-foreground text-pretty">
          Enter your email address and we&apos;ll send you an OTP to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          <Button type="submit" className="w-full">
            Send OTP
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderOtpStep = () => (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={() => setCurrentStep("email")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">
          Verify OTP
        </CardTitle>
        <CardDescription className="text-muted-foreground text-pretty">
          We&apos;ve sent a 6-digit code to {email}. Enter it below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOtpSubmit} className=" space-y-4">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
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
            Verify
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              // onClick={handleResendOtp}
              className="text-accent hover:text-accent/80"
            >
              Didn&apos;t receive the code? Resend OTP
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderPasswordStep = () => (
    <Card className="w-full max-w-xl">
      <CardHeader className="text-center">
        <Button
          variant="ghost"
          size="sm"
          className="absolute left-4 top-4"
          onClick={() => setCurrentStep("otp")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">
          Reset Password
        </CardTitle>
        <CardDescription className="text-muted-foreground text-pretty">
          Create a new password for your account. Make sure it&apos;s strong and
          secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
          </div> */}

          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <CheckCircle className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-2xl font-semibold text-balance">
          Password Reset Successful!
        </CardTitle>
        <CardDescription className="text-muted-foreground text-pretty">
          Your password has been successfully reset. You can now sign in with
          your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/sign-in">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      {currentStep === "email" && renderEmailStep()}
      {currentStep === "otp" && renderOtpStep()}
      {currentStep === "password" && renderPasswordStep()}
      {currentStep === "success" && renderSuccessStep()}
    </div>
  );
}
