import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductsTable from "@/components/products/products-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog."
      >
        <Button asChild>
          <Link href="/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </PageHeader>
      <Card>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <ProductsTable />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
