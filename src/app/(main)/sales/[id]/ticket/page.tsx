import { fetchSaleById, fetchCustomerById, fetchProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import SaleTicket from "@/components/sales/sale-ticket";

export default async function SaleTicketPage({ params }: { params: { id: string } }) {
    const sale = await fetchSaleById(params.id);

    if (!sale) {
        notFound();
    }

    const [customer, products] = await Promise.all([
        fetchCustomerById(sale.customerId),
        fetchProducts()
    ]);
    
    if (!customer) {
        notFound();
    }

    const productMap = new Map(products.map(p => [p.id, p.name]));

    return (
        <div className="flex justify-center bg-gray-100 dark:bg-gray-900 py-8 px-4">
            <SaleTicket sale={sale} customer={customer} productMap={productMap} />
        </div>
    );
}
