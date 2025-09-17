import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { fetchCategories } from "@/lib/data";

export default async function NewProductPage() {
    const categories = await fetchCategories();
    return (
        <div>
            <PageHeader title="New Product" description="Fill in the details to add a new product." />
            <ProductForm categories={categories} />
        </div>
    );
}
