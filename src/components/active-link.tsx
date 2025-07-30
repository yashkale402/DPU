
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function ActiveLink({ href, children }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 rounded-md transition-colors",
        isActive
          ? "bg-muted text-foreground font-semibold"
          : "text-foreground/80 hover:bg-muted/50 hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}
