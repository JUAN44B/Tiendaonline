import { fetchSales, fetchCustomers } from '@/lib/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
            <TableCell>{customerMap.get(sale.customerId) || 'N/A'}</TableCell>
            <TableCell>{formatDate(sale.date)}</TableCell>
            <TableCell className="text-right">{formatCurrency(sale.total)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
