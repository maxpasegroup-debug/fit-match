"use client";

import Link from "next/link";
import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginAction } from "@/features/auth/actions";
import { loginSchema, type LoginInput } from "@/features/auth/schemas";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  return (
    <form action={formAction} className="grid gap-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <PasswordInput label="Password" autoComplete="current-password" error={errors.password?.message} {...register("password")} />
      <div className="flex justify-end">
        <Link className="text-sm font-semibold text-[#c21874]" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
      <SubmitButton>Log in</SubmitButton>
      <p className="text-center text-sm text-[#756871]">
        New here?{" "}
        <Link className="font-semibold text-[#c21874]" href="/register">
          Create account
        </Link>
      </p>
    </form>
  );
}
