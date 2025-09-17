
"use client";

import type { Sale, Customer } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import Link from "next/link";

interface SaleTicketProps {
  sale: Sale;
  customer: Customer;
  productMap: Map<string, string>;
}

export default function SaleTicket({ sale, customer, productMap }: SaleTicketProps) {
    const componentRef = useRef(null);
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.href;
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUrl)}`);
        }
    }, []);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Ticket-${sale.invoiceNumber}`,
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const subtotal = sale.items.reduce((acc, item) => acc + item.subtotal, 0);
    const tax = sale.total - subtotal;

  return (
    <div className="w-full max-w-md">
        <div className="flex gap-4 mb-4 justify-end">
             <Button variant="outline" asChild>
                <Link href="/pos">Nueva Venta</Link>
            </Button>
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Ticket
            </Button>
        </div>
        <div ref={componentRef} className="p-2">
            <Card className="font-mono text-sm mx-auto w-[320px] shadow-none border-none bg-white text-black">
                <CardHeader className="text-center p-4">
                    <CardTitle className="text-lg font-bold">SwiftPOS</CardTitle>
                    <p className="text-xs">123 Market St, San Francisco, CA</p>
                    <p className="text-xs">Tel: (123) 456-7890</p>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex justify-between text-xs mb-2">
                        <span>Ticket: {sale.invoiceNumber}</span>
                        <span>{formatDate(sale.date)}</span>
                    </div>
                    <Separator className="my-2 border-dashed border-gray-400" />
                    <div className="text-xs mb-2">
                        <p>Cliente: {customer.name}</p>
                        <p>Email: {customer.email}</p>
                    </div>
                    <Separator className="my-2 border-dashed border-gray-400" />
                    <Table className="text-xs">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="h-auto p-1 text-black font-bold">Producto</TableHead>
                                <TableHead className="h-auto p-1 text-black font-bold text-center">Cant.</TableHead>
                                <TableHead className="h-auto p-1 text-black font-bold text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sale.items.map((item) => (
                                <TableRow key={item.productId} className="border-none">
                                    <TableCell className="p-1 font-normal">{productMap.get(item.productId) || 'Unknown Product'}</TableCell>
                                    <TableCell className="p-1 font-normal text-center">{item.quantity}</TableCell>
                                    <TableCell className="p-1 font-normal text-right">{formatCurrency(item.subtotal)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Separator className="my-2 border-dashed border-gray-400" />
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Impuestos:</span>
                            <span>{formatCurrency(tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-sm">
                            <span>Total:</span>
                            <span>{formatCurrency(sale.total)}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-center p-4">
                     {qrCodeUrl && (
                        <Image
                            src={qrCodeUrl}
                            alt="QR Code"
                            width={80}
                            height={80}
                            className="mb-2"
                            data-ai-hint="qr code"
                        />
                     )}
                    <p className="text-xs text-center">¡Gracias por su compra!</p>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
