
'use client';

import { useState, useMemo, useTransition, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Search, X, Plus, Minus, Loader2, Trash2 } from 'lucide-react';
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
import { cn } from '@/lib/utils';

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
  const [quantityInput, setQuantityInput] = useState('');
  
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
        setQuantityInput(item.product.stock.toString());
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

  useEffect(() => {
    if (quantityInput && selectedCartItemId) {
      const newQuantity = parseInt(quantityInput, 10);
      if (!isNaN(newQuantity)) {
          const item = cart.find(i => i.product.id === selectedCartItemId);
          if(item && newQuantity > item.product.stock) {
              toast({ title: "Límite de stock alcanzado", variant: "destructive"})
              setCart(prevCart => prevCart.map(i => i.product.id === selectedCartItemId ? {...i, quantity: item.product.stock} : i));
          } else {
               updateQuantity(selectedCartItemId, newQuantity);
          }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantityInput]);

  useEffect(() => {
    if (selectedCartItemId) {
        const selectedItem = cart.find(item => item.product.id === selectedCartItemId);
        if (selectedItem) {
            setQuantityInput(selectedItem.quantity.toString());
        }
    } else {
        setQuantityInput('');
    }
  }, [selectedCartItemId, cart]);


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
    setQuantityInput('');
  };

  const handleNumpadClick = (value: string) => {
    if (!selectedCartItemId) {
        toast({ title: 'Seleccione un producto del carrito primero', variant: 'destructive'});
        return;
    }
     if (value === 'C') {
        setQuantityInput('');
    } else if (value === 'del') {
        setQuantityInput(prev => prev.slice(0, -1));
    } else {
        setQuantityInput(prev => {
            const newValue = prev + value;
            const newQuantity = parseInt(newValue, 10);
            if (!isNaN(newQuantity)) {
                const item = cart.find(i => i.product.id === selectedCartItemId);
                if (item && newQuantity > item.product.stock) {
                    toast({ title: "Límite de stock alcanzado", variant: "destructive" });
                    return item.product.stock.toString();
                }
            }
            return newValue;
        });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Products Section */}
      <div className="lg:col-span-2 h-full flex flex-col">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
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
            <h2 className="text-lg font-semibold mb-4">Venta Actual</h2>
            <div className="mb-4">
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar un cliente" />
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
                  <p className="text-center text-muted-foreground py-10">El carrito está vacío</p>
                ) : (
                  <ul className="space-y-1">
                    {cart.map((item) => (
                      <li key={item.product.id} 
                          className={cn("flex items-center gap-4 p-2 rounded-md cursor-pointer", selectedCartItemId === item.product.id ? 'bg-accent' : '')}
                          onClick={() => {
                            setSelectedCartItemId(item.product.id);
                            setQuantityInput(item.quantity.toString());
                          }}
                      >
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
                           <p className="text-xs text-muted-foreground">{formatCurrency(item.product.price)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Button size="icon" variant="outline" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity - 1); }}><Minus className="h-3 w-3"/></Button>
                           <span className="w-6 text-center">{item.quantity}</span>
                           <Button size="icon" variant="outline" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity + 1); }}><Plus className="h-3 w-3"/></Button>
                        </div>
                        <p className="font-medium text-sm w-20 text-right">{formatCurrency(item.product.price * item.quantity)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </ScrollArea>

            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cartSubtotal)}</span></div>
                    <div className="flex justify-between"><span>Impuestos (8%)</span><span>{formatCurrency(cartTax)}</span></div>
                    <div className="flex justify-between font-bold text-base"><span>Total</span><span className='text-xl'>{formatCurrency(cartTotal)}</span></div>
                </div>
                 <div className="grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'del'].map((key) => (
                        <Button key={key} variant="outline" className="h-10 text-lg" onClick={() => handleNumpadClick(key)}>
                            {key === 'del' ? <X className="h-5 w-5"/> : key}
                        </Button>
                    ))}
                     <Button variant="destructive" className="h-10 text-lg col-span-3" onClick={handleClearSale}>
                        <Trash2 className="mr-2 h-4 w-4" /> Cancelar
                    </Button>
                </div>
            </div>

            <Button className="w-full mt-4" size="lg" onClick={handleCompleteSale} disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                Completar Venta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
