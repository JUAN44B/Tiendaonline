
'use client';

import { useState, useMemo, useTransition, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Search, X, Plus, Minus, Loader2, Trash2, UserPlus, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

import type { Product, Customer } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { createSaleAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CustomerDialog } from '../customers/customer-dialog';

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
  const [selectedCartItemId, setSelectedCartItemId] = useState<string | null>(null);
  
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
    const existingItem = cart.find((item) => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        const updatedCart = cart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
        setSelectedCartItemId(product.id);
      } else {
        toast({ title: "Límite de stock alcanzado", variant: "destructive"});
      }
    } else {
      const newCart = [...cart, { product, quantity: 1 }];
      setCart(newCart);
      setSelectedCartItemId(product.id);
    }
  };

  const updateQuantity = useCallback((productId: string, newQuantity: number) => {
    const item = cart.find(i => i.product.id === productId);
    if(item && newQuantity > item.product.stock) {
        toast({ title: "Límite de stock alcanzado", variant: "destructive"})
        return;
    }

    if (newQuantity <= 0) {
      setCart((prevCart) => {
        const newCart = prevCart.filter((item) => item.product.id !== productId);
        if (newCart.length > 0) {
          setSelectedCartItemId(newCart[newCart.length - 1].product.id);
        } else {
          setSelectedCartItemId(null);
        }
        return newCart;
      });
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [cart, toast]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartTax = cartSubtotal * 0.08; // 8% tax
  const cartTotal = cartSubtotal + cartTax;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const handleCompleteSale = () => {
      if (!selectedCustomerId) {
          toast({ title: 'Por favor, seleccione un cliente.', variant: 'destructive'});
          return;
      }
      if (cart.length === 0) {
          toast({ title: 'El carrito está vacío.', variant: 'destructive'});
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
                  title: '¡Venta completada!',
                  description: `Factura ${result.sale.invoiceNumber} creada.`
              });
              handleClearSale();
              router.push(`/sales/${result.sale.id}/ticket`);
          } else {
              toast({ title: 'Error', description: result.error, variant: 'destructive'})
          }
      });
  };

  const handleClearSale = () => {
    setCart([]);
    setSelectedCustomerId(undefined);
    setSelectedCartItemId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos por nombre..."
            className="pl-10 text-base"
          />
        </div>
        <Card className="flex-1 border-none shadow-none">
          <CardContent className="p-0 h-full">
            <ScrollArea className="h-full">
                <div className="p-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow group overflow-hidden"
                  onClick={() => addToCart(product)}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      data-ai-hint="product image"
                    />
                     <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="p-3 bg-card">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    <p className="text-lg font-bold text-primary">{formatCurrency(product.price)}</p>
                  </div>
                </Card>
              ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Cart Section */}
      <div className="h-full flex flex-col bg-card rounded-xl border">
        <CardHeader>
            <CardTitle>Venta Actual</CardTitle>
             <div className="flex items-center gap-2 pt-2">
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Seleccionar un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>{customer.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <CustomerDialog>
                    <Button variant="outline" size="icon">
                        <UserPlus className="h-4 w-4" />
                        <span className="sr-only">Añadir Cliente</span>
                    </Button>
                </CustomerDialog>
            </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
            <Separator />
            <ScrollArea className="flex-1">
              <div className="p-4">
                {cart.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 flex flex-col items-center gap-4">
                        <ShoppingCart className="h-16 w-16 text-muted" />
                        <p className="font-medium">El carrito está vacío</p>
                        <p className="text-sm">Añada productos para empezar una venta.</p>
                    </div>
                ) : (
                  <ul className="space-y-3">
                    {cart.map((item) => (
                      <li key={item.product.id} 
                          className={cn("flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors", selectedCartItemId === item.product.id ? 'bg-primary/10' : 'hover:bg-muted')}
                          onClick={() => setSelectedCartItemId(item.product.id)}
                      >
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                           data-ai-hint="product image thumbnail"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.product.name}</p>
                           <p className="text-sm text-muted-foreground">{formatCurrency(item.product.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity - 1); }}><Minus className="h-4 w-4"/></Button>
                           <span className="w-6 text-center font-medium text-base">{item.quantity}</span>
                           <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity + 1); }}><Plus className="h-4 w-4"/></Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollArea>
        </CardContent>

        <div className="p-4 border-t bg-muted/50 rounded-b-xl">
             <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Impuestos (8%)</span>
                    <span>{formatCurrency(cartTax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-baseline font-bold text-base">
                    <span>Total</span>
                    <span className='text-2xl text-primary'>{formatCurrency(cartTotal)}</span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="lg" onClick={handleClearSale} disabled={cart.length === 0 || isPending}>
                    <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button size="lg" onClick={handleCompleteSale} disabled={isPending || cart.length === 0 || !selectedCustomerId}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Completar Venta
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

    