import { fetchProductById } from "@/lib/data";
import { notFound } from "next/navigation";
import ProductLabel from "@/components/products/product-label";

export default async function ProductBarcodePage({ params }: { params: { id: string } }) {
    const product = await fetchProductById(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="flex justify-center bg-gray-100 dark:bg-gray-900 py-8 px-4">
           <ProductLabel product={product} />
        </div>
    );
}
