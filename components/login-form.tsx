"use client";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import {
  handleEmailOTP,
  signIn,
  signInSocial,
  signUp,
} from "@/lib/actions/auth-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);

    try {
      await signInSocial(provider);
    } catch (err) {
      toast.error(
        `Error authenticating with ${provider}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignIn) {
        const result = await signIn(email, password);
        if (result.success && result.user) {
          toast.success("Login successful!");
          router.push("/dashboard");
        } else {
          toast.error(result.error || "Invalid email or password");
        }
      } else {
        const result = await signUp(email, password, name);
        if (result.success && result.user) {
          toast.success("Account created! Please login.");
          setIsSignIn(true);
          setEmail("");
          setPassword("");
        } else {
          toast.error(result.error || "Failed to create account");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignIn(!isSignIn);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {isSignIn ? "Welcome back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isSignIn
              ? "Sign in to your account to continue"
              : "Sign up to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailAuth}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  type="button"
                  onClick={() => handleSocialAuth("github")}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  {
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="currentColor"
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
                        0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.083-.729.083-.729
                        1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.3-5.467-1.332-5.467-5.93
                        0-1.31.468-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405
                        1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22
                        0 4.61-2.805 5.625-5.475 5.92.435.375.825 1.096.825 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57
                        C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z"
                      />
                    </svg>
                  }
                  Continue with GitHub
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSocialAuth("google")}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#4285F4"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.63 2.43 30.24 0 24 0 14.62 0 6.4 5.38 2.56 13.22l7.98 6.19C12.43 13.54 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#34A853"
                      d="M46.98 24.55c0-1.64-.15-3.22-.42-4.75H24v9h12.94c-.56 2.88-2.24 5.34-4.77 6.98l7.69 5.97C44.47 37.06 46.98 31.3 46.98 24.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.54 28.41c-.48-1.41-.75-2.91-.75-4.41s.27-3 .75-4.41l-7.98-6.19C.92 16.54 0 20.17 0 24s.92 7.46 2.56 10.59l7.98-6.18z"
                    />
                    <path
                      fill="#EA4335"
                      d="M24 48c6.48 0 11.91-2.13 15.88-5.8l-7.69-5.97c-2.14 1.44-4.9 2.27-8.19 2.27-6.26 0-11.57-4.04-13.46-9.69l-7.98 6.18C6.4 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="grid gap-6">
                {!isSignIn && (
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isSignIn}
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="johndoe@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    {isSignIn && (
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Link>
                    )}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2 w-full">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isSignIn ? "Signing in..." : "Creating account..."}
                      </div>
                    ) : isSignIn ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                  <Button
                    type="button"
                    className={buttonVariants({
                      variant: "secondary",
                      className: "w-full",
                    })}
                    onClick={async () => {
                      const data = await handleEmailOTP(email);
                      if (data) {
                        router.push(`/verify?email=${email}`);
                      }
                    }}
                  >
                    Sign in with Email OTP
                  </Button>
                </div>
              </div>

              <div className="text-center text-sm">
                {isSignIn ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={toggleMode}
                      className="underline underline-offset-4 hover:text-primary"
                    >
                      Sign in
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-balance text-muted-foreground">
        By clicking continue, you agree to our
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>
        and
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
