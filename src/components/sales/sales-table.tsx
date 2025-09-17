import Link from 'next/link';
import { fetchSales, fetchCustomers } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ReceiptText } from 'lucide-react';

export default async function SalesTable() {
  const [sales, customers] = await Promise.all([fetchSales(), fetchCustomers()]);
  const customerMap = new Map(customers.map((c) => [c.id, c.name]));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
            <TableCell>{customerMap.get(sale.customerId) || 'N/A'}</TableCell>
            <TableCell>{formatDate(sale.date)}</TableCell>
            <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="icon">
                <Link href={`/sales/${sale.id}/ticket`}>
                  <ReceiptText className="h-4 w-4" />
                  <span className="sr-only">View Ticket</span>
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
