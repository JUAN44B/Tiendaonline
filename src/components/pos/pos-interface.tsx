'use client';

import { useState, useMemo, useTransition } from 'react';
import Image from 'next/image';
import { Search, X, Plus, Minus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Product, Customer } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { createSaleAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  product: Product;
  quantity: number;
};

interface PosInterfaceProps {
  initialProducts: Product[];
  customers: Customer[];
}

export default function PosInterface({ initialProducts, customers }: PosInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.stock > 0
    );
  }, [searchTerm, initialProducts]);
  
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
            return prevCart.map((item) =>
              item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            );
        }
        toast({ title: "Stock limit reached", variant: "destructive"})
        return prevCart;
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const item = cart.find(i => i.product.id === productId);
    if(item && newQuantity > item.product.stock) {
        toast({ title: "Stock limit reached", variant: "destructive"})
        return;
    }

    if (newQuantity <= 0) {
      setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartTax = cartSubtotal * 0.08; // 8% tax
  const cartTotal = cartSubtotal + cartTax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const handleCompleteSale = () => {
      if (!selectedCustomerId) {
          toast({ title: 'Please select a customer.', variant: 'destructive'});
          return;
      }
      if (cart.length === 0) {
          toast({ title: 'Cart is empty.', variant: 'destructive'});
          return;
      }
      
      startTransition(async () => {
          const saleData = {
              customerId: selectedCustomerId,
              items: cart.map(item => ({
                  productId: item.product.id,
                  quantity: item.quantity,
                  unitPrice: item.product.price,
                  subtotal: item.product.price * item.quantity,
              })),
              total: cartTotal,
          };
          
          const result = await createSaleAction(saleData);

          if(result.success && result.sale) {
              toast({
                  title: 'Sale Completed!',
                  description: `Invoice ${result.sale.invoiceNumber} created.`
              });
              setCart([]);
              setSelectedCustomerId(undefined);
              router.push('/sales');
          } else {
              toast({ title: 'Error', description: result.error, variant: 'destructive'})
          }
      });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Card className="flex-1">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full">
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => addToCart(product)}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover rounded-t-lg"
                      data-ai-hint="product image"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                  </div>
                </Card>
              ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="h-full flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Current Sale</h2>
            <div className="mb-4">
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <Separator className="mb-4" />

            <ScrollArea className="flex-1 -mx-4">
              <div className="px-4">
                {cart.length === 0 ? (
                  <p className="text-center text-muted-foreground py-10">Cart is empty</p>
                ) : (
                  <ul className="space-y-4">
                    {cart.map((item) => (
                      <li key={item.product.id} className="flex items-center gap-4">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="rounded-md object-cover"
                           data-ai-hint="product image thumbnail"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}><Minus className="h-3 w-3"/></Button>
                            <span>{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}><Plus className="h-3 w-3"/></Button>
                          </div>
                        </div>
                        <p className="font-medium text-sm">{formatCurrency(item.product.price * item.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollArea>

            <Separator className="my-4" />
            
            <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>{formatCurrency(cartTax)}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatCurrency(cartTotal)}</span></div>
            </div>
            <Button className="w-full mt-6" size="lg" onClick={handleCompleteSale} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Complete Sale
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
