import { colorClasses } from "@/lib/design/colors";

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <span className={`text-xs font-medium ${colorClasses.dangerText}`} role="alert">
      {message}
    </span>
  );
}
