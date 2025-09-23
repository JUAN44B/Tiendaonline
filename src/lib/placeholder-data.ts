import type { Product, Category, Customer, Sale, SaleItem } from './definitions';

export const placeholderCategories: Category[] = [
  { id: 'cat-1', name: 'Llantas', description: 'Llantas para todo tipo de remolques' },
  { id: 'cat-2', name: 'Frenos', description: 'Componentes del sistema de frenos' },
  { id: 'cat-3', name: 'Suspensión', description: 'Partes de la suspensión y amortiguadores' },
  { id: 'cat-4', name: 'Luces', description: 'Sistemas de iluminación y señalización' },
];

export const placeholderProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Llanta Radial 22.5"',
    description: 'Llanta de alta durabilidad para largas distancias.',
    price: 350.00,
    categoryId: 'cat-1',
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/tire1/600/400',
  },
  {
    id: 'prod-2',
    name: 'Balatas de Freno de Tambor',
    description: 'Juego de balatas para sistema de frenos de tambor.',
    price: 85.50,
    categoryId: 'cat-2',
    stock: 120,
    imageUrl: 'https://picsum.photos/seed/brakes1/600/400',
  },
  {
    id: 'prod-3',
    name: 'Bolsa de Aire para Suspensión',
    description: 'Bolsa de aire de alta resistencia para suspensión neumática.',
    price: 150.75,
    categoryId: 'cat-3',
    stock: 75,
    imageUrl: 'https://picsum.photos/seed/suspension1/600/400',
  },
  {
    id: 'prod-4',
    name: 'Luz Trasera LED Stop/Reversa',
    description: 'Luz trasera multifunción con tecnología LED de bajo consumo.',
    price: 45.00,
    categoryId: 'cat-4',
    stock: 200,
    imageUrl: 'https://picsum.photos/seed/light1/600/400',
  },
  {
    id: 'prod-5',
    name: 'Rin de Acero 22.5"',
    description: 'Rin de acero de alta resistencia para llantas de 22.5 pulgadas.',
    price: 120.00,
    categoryId: 'cat-1',
    stock: 40,
    imageUrl: 'https://picsum.photos/seed/rim1/600/400',
  },
  {
    id: 'prod-6',
    name: 'Manguera de Aire para Frenos',
    description: 'Manguera flexible para el sistema de aire de frenos.',
    price: 25.00,
    categoryId: 'cat-2',
    stock: 300,
    imageUrl: 'https://picsum.photos/seed/hose1/600/400',
  },
  {
    id: 'prod-7',
    name: 'Amortiguador de Gas',
    description: 'Amortiguador de gas para una conducción suave.',
    price: 95.00,
    categoryId: 'cat-3',
    stock: 8,
    imageUrl: 'https://picsum.photos/seed/shock1/600/400',
  },
  {
    id: 'prod-8',
    name: 'Faro Delantero Halógeno',
    description: 'Faro de alta potencia para visibilidad nocturna.',
    price: 60.00,
    categoryId: 'cat-4',
    stock: 150,
    imageUrl: 'https://picsum.photos/seed/headlight1/600/400',
  },
];

export const placeholderCustomers: Customer[] = [
  { id: 'cust-1', name: 'Transportes Rápidos S.A.', email: 'contacto@transportesrapidos.com', phone: '55-1234-5678' },
  { id: 'cust-2', name: 'Logística del Norte', email: 'compras@logisticanorte.com', phone: '81-8765-4321' },
  { id: 'cust-3', name: 'Juan Pérez', email: 'juan.perez@email.com', phone: '33-9876-5432' },
];

export const placeholderSales: Sale[] = [
    {
        id: 'sale-1',
        invoiceNumber: 'INV-001',
        customerId: 'cust-1',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        total: 871.00,
        items: [
            { productId: 'prod-1', quantity: 2, unitPrice: 350.00, subtotal: 700.00 },
            { productId: 'prod-2', quantity: 2, unitPrice: 85.50, subtotal: 171.00 },
        ]
    },
    {
        id: 'sale-2',
        invoiceNumber: 'INV-002',
        customerId: 'cust-2',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        total: 390.00,
        items: [
            { productId: 'prod-4', quantity: 2, unitPrice: 45.00, subtotal: 90.00 },
            { productId: 'prod-5', quantity: 1, unitPrice: 120.00, subtotal: 120.00 },
            { productId: 'prod-6', quantity: 2, unitPrice: 25.00, subtotal: 50.00 },
        ]
    }
];
