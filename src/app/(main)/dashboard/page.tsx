import { PageHeader } from "@/components/page-header";
import StatsCards from "@/components/dashboard/stats-cards";
import SalesChart from "@/components/dashboard/sales-chart";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
              <SalesChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
