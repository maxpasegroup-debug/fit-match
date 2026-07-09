import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div className="grid max-w-md gap-4">
        <p className="text-sm font-bold tracking-[0.2em] text-[#c21874]">404</p>
        <h1 className="text-3xl font-semibold text-[#241820]">Page not found</h1>
        <p className="text-sm leading-6 text-[#756871]">This page is not available.</p>
        <ButtonLink href="/">Return home</ButtonLink>
      </div>
    </main>
  );
}
