import { fetchSales, fetchCustomers } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";

export default async function RecentSales() {
    const [sales, customers] = await Promise.all([fetchSales(), fetchCustomers()]);
    const recentSales = sales.slice(0, 5);
    const customerMap = new Map(customers.map(c => [c.id, c]));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            {recentSales.map(sale => {
                const customer = customerMap.get(sale.customerId);
                const initials = customer?.name.split(' ').map(n => n[0]).join('') || '??';
                return (
                    <div key={sale.id} className="flex items-center gap-4">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://i.pravatar.cc/40?u=${customer?.id}`} alt="Avatar" data-ai-hint="customer avatar" />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{customer?.name}</p>
                            <p className="text-sm text-muted-foreground">{customer?.email}</p>
                        </div>
                        <div className="font-medium">{formatCurrency(sale.total)}</div>
                    </div>
                );
            })}
        </div>
    );
}

RecentSales.Skeleton = function RecentSalesSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
            ))}
        </div>
    );
}
