import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { fetchCategories, fetchProductById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const [product, categories] = await Promise.all([
        fetchProductById(params.id),
        fetchCategories()
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div>
            <PageHeader title="Edit Product" description={`Update the details for ${product.name}.`} />
            <ProductForm categories={categories} product={product} />
        </div>
    );
}
