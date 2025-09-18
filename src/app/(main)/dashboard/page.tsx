import { PageHeader } from "@/components/page-header";
import StatsCards from "@/components/dashboard/stats-cards";
import SalesChart from "@/components/dashboard/sales-chart";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import RecentSales from "@/components/dashboard/recent-sales";
import TopProducts from "@/components/dashboard/top-products";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Here's a snapshot of your business performance."
      />
      <div className="grid gap-6">
        <Suspense fallback={<StatsCards.Skeleton />}>
          <StatsCards />
        </Suspense>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                <SalesChart />
              </Suspense>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<RecentSales.Skeleton />}>
                    <RecentSales />
                </Suspense>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<TopProducts.Skeleton />}>
                    <TopProducts />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
