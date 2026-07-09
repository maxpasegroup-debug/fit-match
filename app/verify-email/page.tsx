import Link from "next/link";
import type { Metadata } from "next";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { ButtonLink } from "@/components/ui/button";
import { verifyEmailToken } from "@/features/auth/actions";

export const metadata: Metadata = { title: "Verify email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const verified = token ? await verifyEmailToken(token) : false;

  return (
    <AuthFormShell
      title={verified ? "Email verified" : "Verification link expired"}
      subtitle={
        verified
          ? "Your SIGN SILKS account is ready."
          : "Please log in and request a fresh verification link."
      }
    >
      <div className="grid gap-4 text-center">
        <ButtonLink href="/home">{verified ? "Go to dashboard" : "Back to login"}</ButtonLink>
        {!verified ? (
          <Link className="text-sm font-semibold text-[#c21874]" href="/login">
            Log in
          </Link>
        ) : null}
      </div>
    </AuthFormShell>
  );
}
