'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Info,
  Users,
  Building,
  Star,
  Shield,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Folder,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { CompanyLogo } from './icons/company-logo';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pos', icon: ShoppingCart, label: 'Punto de Venta' },
  { href: '/sales', icon: Receipt, label: 'Ventas' },
  { href: '/products', icon: Package, label: 'Productos' },
  { href: '/categories', icon: Folder, label: 'Categorías' },
  { href: '/customers', icon: Users, label: 'Clientes' },
];

const secondaryNavItems = [
    { href: '/settings', icon: Settings, label: 'Ajustes' },
    { href: '/info', icon: Info, label: 'Información' },
    { href: '/privileges', icon: Shield, label: 'Accesos y Privilegios' },
    { href: '/users', icon: Users, label: 'Usuarios' },
    { href: '/locations', icon: Building, label: 'Local/Sucursal' },
    { href: '/rating', icon: Star, label: 'Calificación APP' },
]

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-24 items-center justify-center p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CompanyLogo className="h-10 w-auto" />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
              pathname.startsWith(item.href)
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'hover:bg-sidebar-accent/50'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
        <div className="mt-auto flex flex-col gap-2">
            {secondaryNavItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
                pathname.startsWith(item.href)
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'hover:bg-sidebar-accent/50'
                )}
            >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
            </Link>
            ))}
        </div>
      </nav>
    </aside>
  );
}
