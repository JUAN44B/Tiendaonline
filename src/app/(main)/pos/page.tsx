
import PosInterface from "@/components/pos/pos-interface";
import { PageHeader } from "@/components/page-header";
import { fetchProducts, fetchCustomers } from "@/lib/data";

export default async function PosPage() {
    const products = await fetchProducts();
    const customers = await fetchCustomers();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <PageHeader title="Point of Sale" description="Create a new sale." />
            <div className="flex-1 min-h-0">
                <PosInterface initialProducts={products} customers={customers} />
            </div>
        </div>
    );
}
