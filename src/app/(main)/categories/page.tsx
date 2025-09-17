import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import CategoriesTable from "@/components/categories/categories-table";
import { CategoryDialog } from "@/components/categories/category-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your products into categories."
      >
        <CategoryDialog>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Category
            </Button>
        </CategoryDialog>
      </PageHeader>
      <Card>
        <CardContent>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <CategoriesTable />
            </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
