'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Receipt,
  Folder,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CompanyLogo } from './icons/company-logo';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
  { href: '/sales', icon: Receipt, label: 'Sales' },
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/categories', icon: Folder, label: 'Categories' },
  { href: '/customers', icon: Users, label: 'Customers' },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-20 flex-col items-center border-r bg-card">
      <div className="flex h-20 w-full items-center justify-center border-b p-2">
        <Link href="/dashboard">
          <CompanyLogo className="h-full w-full" />
          <span className="sr-only">Aliru</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col items-center gap-2 py-4">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                    pathname.startsWith(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
