"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BrandLogo() {
  const pathname = usePathname();
  const isMarketing = pathname === "/";
  const href = isMarketing ? "/" : "/dashboard";

  return (
    <Link
      href={href}
      className="flex items-center gap-2 hover:opacity-90 transition-opacity select-none"
    >
      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
      <span className="font-semibold text-lg tracking-tight font-heading">
        Zanshin Focus
      </span>
    </Link>
  );
}
