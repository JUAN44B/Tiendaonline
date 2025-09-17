"use client";

import { useRef } from "react";
import type { Product } from "@/lib/definitions";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";

interface ProductLabelProps {
    product: Product;
}

export default function ProductLabel({ product }: ProductLabelProps) {
    const componentRef = useRef(null);
    
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Label-${product.name}`,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${product.id}&code=Code128&translate-esc=on`;

    return (
        <div className="w-full max-w-md">
            <div className="flex gap-4 mb-4 justify-end">
                <Button variant="outline" asChild>
                    <Link href="/products">Volver a Productos</Link>
                </Button>
                <Button onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Etiqueta
                </Button>
            </div>
            <div ref={componentRef} className="p-2">
                <div className="border border-dashed border-gray-400 p-4 w-[320px] h-[160px] mx-auto bg-white text-black flex flex-col items-center justify-center font-sans">
                    <p className="text-center font-bold text-lg truncate w-full">{product.name}</p>
                    <p className="text-center text-2xl font-black my-2">{formatCurrency(product.price)}</p>
                    <Image
                        src={barcodeUrl}
                        alt={`Barcode for ${product.name}`}
                        width={280}
                        height={50}
                        className="object-contain"
                        data-ai-hint="product barcode"
                    />
                     <p className="text-xs">{product.id}</p>
                </div>
            </div>
        </div>
    );
}
