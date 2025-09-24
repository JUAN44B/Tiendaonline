import { Suspense } from "react";
import Link from "next/link";
import {
  BarChart,
  Package,
  Users,
  Receipt,
  ShoppingCart,
  Truck,
  FileText,
  Printer,
  Mail,
  UserCheck,
  Calculator,
  Percent,
  Landmark,
  FilePlus,
  ArrowRightLeft,
  Settings,
  ShieldCheck,
  Headset,
  MapPin,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, getTopSellingProducts, getWeeklySalesData } from "@/lib/data";
import SalesChart from "@/components/dashboard/sales-chart";
import { Chart as DonutChart } from "recharts";
import SalesDonutChart from "@/components/dashboard/sales-donut-chart";

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

const quickAccessLinks = [
    { href: "/inventory", icon: Package, label: "Inventarios" },
    { href: "/products", icon: Package, label: "Ver/Editar Productos" },
    { href: "/customers", icon: Users, label: "Clientes" },
    { href: "/commissions", icon: Percent, label: "Comisiones" },
    { href: "/reports/perdas", icon: FileText, label: "Reporte de PERDAS" },
    { href: "/pos", icon: ShoppingCart, label: "Punto de Venta" },
    { href: "/sales", icon: Receipt, label: "Analizar Ventas" },
    { href: "/providers", icon: Truck, label: "Proveedores" },
    { href: "/products/new", icon: FilePlus, label: "Alta de Productos" },
    { href: "/sales/new", icon: Calculator, label: "Cálculo de Productos" },
    { href: "/invoices", icon: Landmark, label: "Generación de Facturas" },
    { href: "/transfers", icon: ArrowRightLeft, label: "Traspasos" },
    { href: "/reports/income", icon: FileText, label: "Reporte de Ingresos" },
    { href: "/print", icon: Printer, label: "Imprimir" },
    { href: "/email", icon: Mail, label: "Email" },
    { href: "/profile", icon: UserCheck, label: "Mi Perfil" },
    { href: "/settings", icon: Settings, label: "Configuración" },
    { href: "/security", icon: ShieldCheck, label: "Seguridad" },
    { href: "/support", icon: Headset, label: "Soporte" },
    { href: "/locations", icon: MapPin, label: "Localización" },
]

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const weeklySalesData = await getWeeklySalesData();
    const topProducts = await getTopSellingProducts(5);
    const salesByCategory = [
        { name: 'Llantas', value: 400, fill: 'var(--color-llantas)' },
        { name: 'Frenos', value: 300, fill: 'var(--color-frenos)' },
        { name: 'Suspensión', value: 300, fill: 'var(--color-suspension)' },
        { name: 'Luces', value: 200, fill: 'var(--color-luces)' },
    ];


  return (
    <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="bg-blue-500 text-white">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">TOTAL INGRESOS BRUTOS</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(stats.monthlySales * 1.16)}</div>
                </CardContent>
            </Card>
            <Card className="bg-orange-500 text-white">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">TOTAL IMPUESTOS</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(stats.monthlySales * 0.16)}</div>
                </CardContent>
            </Card>
            <Card className="bg-purple-500 text-white">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">TOTAL INGRESOS NETOS</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(stats.monthlySales)}</div>
                </CardContent>
            </Card>
            <Card className="bg-green-500 text-white">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">TOTAL APORTACIONES POR COBRAR</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(1570634)}</div>
                </CardContent>
            </Card>
             <Card className="bg-red-500 text-white">
                <CardHeader>
                    <CardTitle className="text-sm font-medium">TOTAL DESCUENTOS</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formatCurrency(0)}</div>
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top 5 Productos Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <SalesChart data={topProducts.map(p => ({name: p.name, total: p.quantity}))} dataKey="total" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Ventas por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <SalesDonutChart data={salesByCategory} />
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Accesos Directos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-4">
                {quickAccessLinks.map(link => (
                    <Link href={link.href} key={link.href} className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-colors text-center">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-background">
                           <link.icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <span className="text-xs font-medium">{link.label}</span>
                    </Link>
                ))}
            </CardContent>
        </Card>
    </div>
  );
}
