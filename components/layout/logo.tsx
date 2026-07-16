import Link from "next/link";

export function Logo() {
  return (
    <Link
      className="group inline-flex min-h-12 shrink-0 items-center leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c21874] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffafd]"
      href="/"
      aria-label="FIT & MATCH home"
    >
      <span className="fit-wordmark text-[15px] font-black uppercase sm:text-[17px]">
        <span>FIT</span>
        <span className="text-[0.86em]">&amp;</span>
        <span>MATCH</span>
      </span>
    </Link>
  );
}
