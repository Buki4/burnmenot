'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTransitionState } from './TransitionContext';
import React from 'react';

interface TransitionLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  children: React.ReactNode;
}

export function TransitionLink({ href, children, ...props }: TransitionLinkProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setIsExiting } = useTransitionState();

  const handleTransition = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (pathname === href) return;
    
    // Trigger the exit animation
    setIsExiting(true);
    
    // Wait for the exit animation to complete (duration matches framer-motion)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Navigate to the new page
    router.push(href);
  };

  return (
    <Link href={href} onClick={handleTransition} {...props}>
      {children}
    </Link>
  );
}
