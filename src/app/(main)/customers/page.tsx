import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CustomersTable from "@/components/customers/customers-table";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function CustomersPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage your customer database."
      >
        <CustomerDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
            </Button>
        </CustomerDialog>
      </PageHeader>
      <Card>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <CustomersTable />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
