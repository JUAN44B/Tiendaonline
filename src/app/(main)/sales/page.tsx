import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SalesTable from "@/components/sales/sales-table";

export default function SalesPage() {
  return (
    <div>
      <PageHeader
        title="Sales"
        description="View your sales history."
      />
      <Card>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <SalesTable />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
