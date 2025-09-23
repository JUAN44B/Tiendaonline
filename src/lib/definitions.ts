export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  imageUrl: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type SaleItem = {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  saleId?: string; // Foreign key
};

export type Sale = {
  id:string;
  invoiceNumber: string;
  customerId: string;
  date: string;
  total: number;
  items: SaleItem[];
};
