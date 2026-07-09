import type { Metadata } from "next";
import { AuthFormShell } from "@/components/forms/auth-form-shell";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthFormShell title="Welcome back" subtitle="Log in securely to continue with FIT & Match.">
      <LoginForm />
    </AuthFormShell>
  );
}
