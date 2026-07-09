"use client";

import Link from "next/link";
import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerAction } from "@/features/auth/actions";
import { registerSchema, type RegisterInput } from "@/features/auth/schemas";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: "onBlur" });

  return (
    <form action={formAction} className="grid gap-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <Input label="Full name" autoComplete="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      <PasswordInput label="Password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <SubmitButton>Create account</SubmitButton>
      <p className="text-center text-sm text-[#756871]">
        Already registered?{" "}
        <Link className="font-semibold text-[#c21874]" href="/login">
          Log in
        </Link>
      </p>
    </form>
  );
}
