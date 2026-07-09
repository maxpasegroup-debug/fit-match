import type { Metadata } from "next";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;

  return (
    <AuthFormShell title="Choose a new password" subtitle="Use a strong password to protect your account.">
      <ResetPasswordForm token={token} />
    </AuthFormShell>
  );
}
