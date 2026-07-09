import type { Metadata } from "next";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthFormShell title="Reset access" subtitle="We will email a secure link if the account exists.">
      <ForgotPasswordForm />
    </AuthFormShell>
  );
}
