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

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Panel de Control"
        description="Accesos rápidos a las funciones principales de tu negocio."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
