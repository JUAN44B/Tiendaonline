

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Package,
  Users,
  Receipt,
  Folder,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import StatsCards from "@/components/dashboard/stats-cards";
import RecentSales from "@/components/dashboard/recent-sales";
import TopProducts from "@/components/dashboard/top-products";
import SalesChart from "@/components/dashboard/sales-chart";
import { getWeeklySalesData } from "@/lib/data";

const quickLinks = [
  {
    title: "Gestión de Ventas",
    links: [
      {
        href: "/pos",
        label: "Punto de Venta",
        icon: ShoppingCart,
      },
      {
        href: "/sales",
        label: "Historial de Ventas",
        icon: Receipt,
      },
    ],
  },
  {
    title: "Gestión de Inventario",
    links: [
      {
        href: "/products",
        label: "Ver Productos",
        icon: Package,
      },
      {
        href: "/products/new",
        label: "Añadir Producto",
        icon: PlusCircle,
      },
      {
        href: "/categories",
        label: "Categorías",
        icon: Folder,
      },
    ],
  },
  {
    title: "Gestión de Clientes",
    links: [
      {
        href: "/customers",
        label: "Ver Clientes",
        icon: Users,
      },
      {
        href: "/customers", // The dialog is on this page
        label: "Añadir Cliente",
        icon: PlusCircle,
      },
    ],
  },
];

export default async function DashboardPage() {
  const weeklySalesData = await getWeeklySalesData();

  return (
    <div>
      <PageHeader
        title="Panel de Control"
        description="Un resumen de la actividad de tu negocio."
      />
      <div className="space-y-6">
        <Suspense fallback={<StatsCards.Skeleton />}>
          <StatsCards />
        </Suspense>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ventas de la Última Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesChart data={weeklySalesData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ventas Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RecentSales.Skeleton />}>
                <RecentSales />
              </Suspense>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
                <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<TopProducts.Skeleton />}>
                    <TopProducts />
                </Suspense>
            </CardContent>
           </Card>
          {quickLinks.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <link.icon className="h-8 w-8" />
                      <span className="text-sm font-medium text-center">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
