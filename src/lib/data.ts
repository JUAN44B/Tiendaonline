import type { Product, Category, Customer, Sale } from './definitions';
import { placeholderImages } from '@/lib/placeholder-images.json';

// In-memory data store
let products: Product[] = [
  { id: '1', name: 'ErgoChair Pro', description: 'A stylish, ergonomic office chair designed for maximum comfort and productivity.', price: 399.99, categoryId: '1', stock: 15, imageUrl: placeholderImages[0].imageUrl },
  { id: '2', name: 'Minimalist Desk', description: 'A modern, minimalist wooden desk that fits perfectly in any home office.', price: 249.50, categoryId: '2', stock: 10, imageUrl: placeholderImages[1].imageUrl },
  { id: '3', name: 'SwiftBook Pro', description: 'A sleek, powerful laptop for professionals on the go. Features a stunning display and all-day battery life.', price: 1299.00, categoryId: '3', stock: 8, imageUrl: placeholderImages[2].imageUrl },
  { id: '4', name: 'CrystalView Monitor', description: 'A high-resolution 27-inch 4K monitor with vibrant colors and wide viewing angles.', price: 499.99, categoryId: '3', stock: 20, imageUrl: placeholderImages[3].imageUrl },
  { id: '5', name: 'MechanoKey Keyboard', description: 'A comfortable, mechanical keyboard with customizable RGB lighting and tactile switches.', price: 149.00, categoryId: '4', stock: 30, imageUrl: placeholderImages[4].imageUrl },
  { id: '6', name: 'GlidePoint Mouse', description: 'A wireless, ergonomic mouse designed for precision and comfort during long work sessions.', price: 79.99, categoryId: '4', stock: 25, imageUrl: placeholderImages[5].imageUrl },
  { id: '7', name: 'SoundScape Headphones', description: 'Premium noise-cancelling over-ear headphones with immersive audio quality.', price: 349.00, categoryId: '4', stock: 18, imageUrl: placeholderImages[6].imageUrl },
  { id: '8', name: 'Lumina Desk Lamp', description: 'A stylish LED desk lamp with adjustable brightness and color temperature for optimal lighting.', price: 59.95, categoryId: '2', stock: 40, imageUrl: placeholderImages[7].imageUrl },
];

let categories: Category[] = [
  { id: '1', name: 'Chairs', description: 'Comfortable and ergonomic seating solutions.' },
  { id: '2', name: 'Desks & Lighting', description: 'Workspace furniture and lighting.' },
  { id: '3', name: 'Electronics', description: 'Computers and monitors.' },
  { id: '4', name: 'Accessories', description: 'Peripherals and other accessories.' },
];

let customers: Customer[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', phone: '456-789-0123' },
];

let sales: Sale[] = [
    {
        id: '1',
        invoiceNumber: 'INV-001',
        customerId: '1',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        total: 549.98,
        items: [
          { productId: '1', quantity: 1, unitPrice: 399.99, subtotal: 399.99 },
          { productId: '5', quantity: 1, unitPrice: 149.99, subtotal: 149.99 },
        ],
    },
    {
        id: '2',
        invoiceNumber: 'INV-002',
        customerId: '2',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        total: 1378.99,
        items: [
          { productId: '3', quantity: 1, unitPrice: 1299.00, subtotal: 1299.00 },
          { productId: '6', quantity: 1, unitPrice: 79.99, subtotal: 79.99 },
        ],
    },
    {
        id: '3',
        invoiceNumber: 'INV-003',
        customerId: '1',
        date: new Date().toISOString(),
        total: 499.99,
        items: [
            { productId: '4', quantity: 1, unitPrice: 499.99, subtotal: 499.99 },
        ],
    },
     {
        id: '4',
        invoiceNumber: 'INV-004',
        customerId: '3',
        date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        total: 309.45,
        items: [
          { productId: '2', quantity: 1, unitPrice: 249.50, subtotal: 249.50 },
          { productId: '8', quantity: 1, unitPrice: 59.95, subtotal: 59.95 },
        ],
    },
];


// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Products
export const fetchProducts = async () => { await delay(100); return [...products]; };
export const fetchProductById = async (id: string) => { await delay(50); return products.find(p => p.id === id); };
export const saveProduct = async (product: Omit<Product, 'id'> & { id?: string }) => {
  await delay(200);
  if (product.id) {
    const index = products.findIndex(p => p.id === product.id);
    if (index !== -1) products[index] = { ...products[index], ...product };
  } else {
    const newProduct = { ...product, id: crypto.randomUUID() };
    products.unshift(newProduct);
  }
  return true;
};
export const deleteProduct = async (id: string) => { await delay(200); products = products.filter(p => p.id !== id); return true; };

// Categories
export const fetchCategories = async () => { await delay(100); return [...categories]; };
export const saveCategory = async (category: Omit<Category, 'id'> & { id?: string }) => {
  await delay(200);
  if (category.id) {
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) categories[index] = { ...categories[index], ...category };
  } else {
    const newCategory = { ...category, id: crypto.randomUUID() };
    categories.unshift(newCategory);
  }
  return true;
};
export const deleteCategory = async (id: string) => { await delay(200); categories = categories.filter(c => c.id !== id); return true; };


// Customers
export const fetchCustomers = async () => { await delay(100); return [...customers]; };
export const saveCustomer = async (customer: Omit<Customer, 'id'> & { id?: string }) => {
  await delay(200);
  if (customer.id) {
    const index = customers.findIndex(c => c.id === customer.id);
    if (index !== -1) customers[index] = { ...customers[index], ...customer };
  } else {
    const newCustomer = { ...customer, id: crypto.randomUUID() };
    customers.unshift(newCustomer);
  }
  return true;
};
export const deleteCustomer = async (id: string) => { await delay(200); customers = customers.filter(c => c.id !== id); return true; };

// Sales
export const fetchSales = async () => { await delay(100); return [...sales].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); };
export const saveSale = async (sale: Omit<Sale, 'id' | 'invoiceNumber'>) => {
    await delay(300);
    const lastInvoiceNumber = sales.reduce((max, s) => {
        const num = parseInt(s.invoiceNumber.split('-')[1]);
        return num > max ? num : max;
    }, 0);
    const newSale: Sale = {
        ...sale,
        id: crypto.randomUUID(),
        invoiceNumber: `INV-${String(lastInvoiceNumber + 1).padStart(3, '0')}`,
    };

    // Update stock
    newSale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    sales.unshift(newSale);
    return newSale;
};

// Dashboard data
export const getDashboardStats = async () => {
    await delay(150);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const dailySales = sales.filter(s => new Date(s.date) >= today).reduce((sum, s) => sum + s.total, 0);
    const weeklySales = sales.filter(s => new Date(s.date) >= startOfWeek).reduce((sum, s) => sum + s.total, 0);
    const monthlySales = sales.filter(s => new Date(s.date) >= startOfMonth).reduce((sum, s) => sum + s.total, 0);

    return { dailySales, weeklySales, monthlySales };
};
