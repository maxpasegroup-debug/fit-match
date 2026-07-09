import type { Metadata } from "next";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthFormShell title="Create your account" subtitle="Start your SIGN SILKS style journey with secure access.">
      <RegisterForm />
    </AuthFormShell>
  );
}
