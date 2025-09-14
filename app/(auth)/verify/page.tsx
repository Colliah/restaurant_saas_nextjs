import { SignInOTPForm } from "@/components/auth/sign-in-otp";

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  return <SignInOTPForm email={searchParams.email} />;
}
