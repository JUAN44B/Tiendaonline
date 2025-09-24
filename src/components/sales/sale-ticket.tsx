"use client";

import type { Sale, Customer, CompanyData } from "@/lib/definitions";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { CompanyLogo } from "../icons/company-logo";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getCompanyData } from "@/lib/data";

interface SaleTicketProps {
  sale: Sale;
  customer: Customer;
  productMap: Map<string, string>;
}

// Create a new component that can be referenced for printing/pdf generation
const PrintableTicket = React.forwardRef<HTMLDivElement, SaleTicketProps & { companyData: CompanyData | null }>(({ sale, customer, productMap, companyData }, ref) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentUrl = window.location.href;
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUrl)}`);
        }
        
        setFormattedDate(
            new Date(sale.date).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
        );
    }, [sale.date]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const subtotal = sale.items.reduce((acc, item) => acc + item.subtotal, 0);
    const tax = sale.total - subtotal;

    return (
        <div ref={ref} className="p-2 bg-white">
            <Card className="font-mono text-sm mx-auto w-[320px] shadow-none border-none bg-white text-black">
                <CardHeader className="text-center p-4">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <CompanyLogo className="h-20 w-auto" />
                    </div>
                    <p className="text-xs">{companyData?.address || '123 Market St, San Francisco, CA'}</p>
                    <p className="text-xs">Tel: {companyData?.phone || '(123) 456-7890'}</p>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex justify-between text-xs mb-2">
                        <span>Ticket: {sale.invoiceNumber}</span>
                        <span>{formattedDate}</span>
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
                                    <TableCell className="p-1 font-normal">{productMap.get(item.productId) || 'Producto Desconocido'}</TableCell>
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
    );
});
PrintableTicket.displayName = 'PrintableTicket';


export default function SaleTicket({ sale, customer, productMap }: SaleTicketProps) {
    const componentRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [companyData, setCompanyData] = useState<CompanyData | null>(null);

    useEffect(() => {
        async function fetchCompanyData() {
            const data = await getCompanyData();
            setCompanyData(data);
        }
        fetchCompanyData();
    }, []);


    const handleDownloadPdf = async () => {
        const ticketElement = componentRef.current;
        if (!ticketElement) return;

        setIsDownloading(true);

        try {
            const canvas = await html2canvas(ticketElement, {
                scale: 2, // Aumenta la resolución de la imagen
                useCORS: true,
            });
            const imgData = canvas.toDataURL('image/png');

            // Tamaño del ticket de 80mm
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [80, 297] // Ancho de 80mm, altura de una hoja A4 para que quepa
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`Ticket-${sale.invoiceNumber}.pdf`);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        } finally {
            setIsDownloading(false);
        }
    };

  return (
    <div className="w-full max-w-md">
        <div className="flex gap-4 mb-4 justify-end">
             <Button variant="outline" asChild>
                <Link href="/pos">Nueva Venta</Link>
            </Button>
            <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                {isDownloading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <FileDown className="mr-2 h-4 w-4" />
                )}
                Descargar PDF
            </Button>
        </div>
        <div className="fixed -left-[9999px] top-0">
            <PrintableTicket
                ref={componentRef}
                sale={sale}
                customer={customer}
                productMap={productMap}
                companyData={companyData}
            />
        </div>
        <PrintableTicket
            sale={sale}
            customer={customer}
            productMap={productMap}
            companyData={companyData}
        />
    </div>
  );
}
