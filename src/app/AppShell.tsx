'use client';
import { usePathname } from 'next/navigation';
import BottomNav from '@/common/components/BottomNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

  return (
    <div className="max-w-screen-sm mx-auto relative min-h-screen pb-24">
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}