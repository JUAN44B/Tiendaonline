import Image from "next/image";
import { getTopSellingProducts } from "@/lib/data";
import { Skeleton } from "../ui/skeleton";

export default async function TopProducts() {
    const topProducts = await getTopSellingProducts(3);

    return (
        <div className="space-y-6">
            {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                        data-ai-hint="product image"
                    />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none truncate">{product.name}</p>
                    </div>
                    <div className="font-medium">{product.quantity} sold</div>
                </div>
            ))}
        </div>
    );
}

TopProducts.Skeleton = function TopProductsSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-5 w-16" />
                </div>
            ))}
        </div>
    );
}
