"use client";

import { useActionState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resetPasswordAction } from "@/features/auth/actions";
import { resetPasswordSchema, type ResetPasswordInput } from "@/features/auth/schemas";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/forms/submit-button";
import { StatusMessage } from "@/components/ui/status-message";

const initialState = { ok: false, message: "" };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, initialState);
  const {
    register,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
    mode: "onBlur",
  });

  return (
    <form action={formAction} className="grid gap-5">
      <StatusMessage message={state.message} tone={state.ok ? "success" : "error"} />
      <input type="hidden" value={token} {...register("token")} />
      <PasswordInput label="New password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
      <SubmitButton>Change password</SubmitButton>
    </form>
  );
}
