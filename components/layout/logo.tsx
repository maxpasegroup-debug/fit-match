import Link from "next/link";

export function Logo() {
  return (
    <Link className="grid leading-none" href="/" aria-label="SIGN SILKS home">
      <span className="text-sm font-black tracking-[0.18em] text-[#c21874]">
        SIGN SILKS
      </span>
      <span className="text-lg font-semibold text-[#241820]">FIT & Match</span>
    </Link>
  );
}
