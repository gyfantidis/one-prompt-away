"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

/**
 * Σύνδεσμος nav που ξέρει αν είναι η τρέχουσα σελίδα.
 * Χρειάζεται usePathname, γι' αυτό είναι client component —
 * το Nav από πάνω μένει server component.
 */
export default function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={`relative py-1 text-sm transition-colors ${
        isActive
          ? "text-brand-text"
          : "text-brand-muted hover:text-brand-text"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brand-teal transition-transform duration-200 ${
          isActive ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Link>
  );
}
