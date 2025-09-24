
import type { Product, Category, Customer, Sale, SaleItem, CompanyData } from './definitions';
import { getConnection } from './db';
import sql from 'mssql';
import { placeholderProducts, placeholderCategories, placeholderCustomers, placeholderSales } from './placeholder-data';
import fs from 'fs/promises';
import path from 'path';

// --- FLAG TO TOGGLE BETWEEN DB AND PLACEHOLDER DATA ---
const USE_DATABASE = false; // Set to false to use placeholder data

async function getRequest() {
    if (!USE_DATABASE) {
        throw new Error("Database is disabled. Using placeholder data.");
    }
    const pool = await getConnection();
    return pool.request();
}

const executeQuery = async <T>(query: (request: sql.Request) => Promise<sql.IResult<any>>, fallbackData: T): Promise<T> => {
    if (!USE_DATABASE) {
        return fallbackData;
    }
    try {
        const request = await getRequest();
        const result = await query(request);
        return result.recordset as T;
    } catch (error) {
        console.warn(`Database query failed, falling back to placeholder data. Error: ${(error as Error).message}`);
        return fallbackData;
    }
};

const executeQueryById = async <T>(query: (request: sql.Request) => Promise<sql.IResult<any>>, fallbackData: T | undefined): Promise<T | undefined> => {
     if (!USE_DATABASE) {
        return fallbackData;
    }
    try {
        const request = await getRequest();
        const result = await query(request);
        return result.recordset[0] as T | undefined;
    } catch (error) {
        console.warn(`Database query failed, falling back to placeholder data. Error: ${(error as Error).message}`);
        return fallbackData;
    }
};


// Products
export const fetchProducts = async (): Promise<Product[]> => {
    return executeQuery(
        request => request.query('SELECT * FROM Products ORDER BY Name'),
        placeholderProducts
    );
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
    const fallback = placeholderProducts.find(p => p.id === id);
    return executeQueryById(
        request => request.input('id', sql.VarChar, id).query('SELECT * FROM Products WHERE id = @id'),
        fallback
    );
};


export const saveProduct = async (product: Omit<Product, 'id'> & { id?: string }): Promise<boolean> => {
    if (!USE_DATABASE) {
        console.log("Simulating save product:", product);
        const index = placeholderProducts.findIndex(p => p.id === product.id);
        if (index > -1) {
            placeholderProducts[index] = { ...placeholderProducts[index], ...product };
        } else {
            placeholderProducts.push({ ...product, id: `prod-${Date.now()}`});
        }
        return true;
    }
    // DB logic remains unchanged
    const request = await getRequest();
    if (product.id) {
        await request
            .input('id', sql.VarChar, product.id)
            .input('name', sql.NVarChar, product.name)
            .input('description', sql.NVarChar, product.description)
            .input('price', sql.Decimal(10, 2), product.price)
            .input('categoryId', sql.VarChar, product.categoryId)
            .input('stock', sql.Int, product.stock)
            .input('imageUrl', sql.VarChar, product.imageUrl)
            .query('UPDATE Products SET name = @name, description = @description, price = @price, categoryId = @categoryId, stock = @stock, imageUrl = @imageUrl WHERE id = @id');
    } else {
        const newId = crypto.randomUUID();
        await request
            .input('id', sql.VarChar, newId)
            .input('name', sql.NVarChar, product.name)
            .input('description', sql.NVarChar, product.description)
            .input('price', sql.Decimal(10, 2), product.price)
            .input('categoryId', sql.VarChar, product.categoryId)
            .input('stock', sql.Int, product.stock)
            .input('imageUrl', sql.VarChar, product.imageUrl)
            .query('INSERT INTO Products (id, name, description, price, categoryId, stock, imageUrl) VALUES (@id, @name, @description, @price, @categoryId, @stock, @imageUrl)');
    }
    return true;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    if (!USE_DATABASE) {
        console.log("Simulating delete product:", id);
        return true;
    }
    const request = await getRequest();
    await request.input('id', sql.VarChar, id).query('DELETE FROM Products WHERE id = @id');
    return true;
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
    return executeQuery(
        request => request.query('SELECT * FROM Categories ORDER BY Name'),
        placeholderCategories
    );
};

export const saveCategory = async (category: Omit<Category, 'id'> & { id?: string }): Promise<boolean> => {
     if (!USE_DATABASE) {
        console.log("Simulating save category:", category);
        return true;
    }
    const request = await getRequest();
    if (category.id) {
        await request
            .input('id', sql.VarChar, category.id)
            .input('name', sql.NVarChar, category.name)
            .input('description', sql.NVarChar, category.description)
            .query('UPDATE Categories SET name = @name, description = @description WHERE id = @id');
    } else {
        const newId = crypto.randomUUID();
        await request
            .input('id', sql.VarChar, newId)
            .input('name', sql.NVarChar, category.name)
            .input('description', sql.NVarChar, category.description)
            .query('INSERT INTO Categories (id, name, description) VALUES (@id, @name, @description)');
    }
    return true;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
     if (!USE_DATABASE) {
        console.log("Simulating delete category:", id);
        return true;
    }
    const request = await getRequest();
    await request.input('id', sql.VarChar, id).query('DELETE FROM Categories WHERE id = @id');
    return true;
};

// Customers
export const fetchCustomers = async (): Promise<Customer[]> => {
    return executeQuery(
        request => request.query('SELECT * FROM Customers ORDER BY Name'),
        placeholderCustomers
    );
};

export const fetchCustomerById = async (id: string): Promise<Customer | undefined> => {
    const fallback = placeholderCustomers.find(c => c.id === id);
    return executeQueryById(
        request => request.input('id', sql.VarChar, id).query('SELECT * FROM Customers WHERE id = @id'),
        fallback
    );
};

export const saveCustomer = async (customer: Omit<Customer, 'id'> & { id?: string }): Promise<boolean> => {
    if (!USE_DATABASE) {
        console.log("Simulating save customer:", customer);
        return true;
    }
    const request = await getRequest();
    if (customer.id) {
        await request
            .input('id', sql.VarChar, customer.id)
            .input('name', sql.NVarChar, customer.name)
            .input('email', sql.NVarChar, customer.email)
            .input('phone', sql.NVarChar, customer.phone)
            .query('UPDATE Customers SET name = @name, email = @email, phone = @phone WHERE id = @id');
    } else {
        const newId = crypto.randomUUID();
        await request
            .input('id', sql.VarChar, newId)
            .input('name', sql.NVarChar, customer.name)
            .input('email', sql.NVarChar, customer.email)
            .input('phone', sql.NVarChar, customer.phone)
            .query('INSERT INTO Customers (id, name, email, phone) VALUES (@id, @name, @email, @phone)');
    }
    return true;
};

export const deleteCustomer = async (id: string): Promise<boolean> => {
    if (!USE_DATABASE) {
        console.log("Simulating delete customer:", id);
        return true;
    }
    const request = await getRequest();
    await request.input('id', sql.VarChar, id).query('DELETE FROM Customers WHERE id = @id');
    return true;
};

// Sales
export const fetchSales = async (): Promise<Sale[]> => {
    const query = (request: sql.Request) => request.query(`
        SELECT 
            s.id, s.invoiceNumber, s.customerId, s.date, s.total,
            (SELECT 
                si.productId, si.quantity, si.unitPrice, si.subtotal
             FROM SaleItems si WHERE si.saleId = s.id FOR JSON PATH) as items
        FROM Sales s 
        ORDER BY s.date DESC
    `);

    if (!USE_DATABASE) {
        return placeholderSales;
    }
    try {
        const request = await getRequest();
        const result = await query(request);
        return result.recordset.map(sale => ({
            ...sale,
            items: JSON.parse(sale.items || '[]')
        }));
    } catch (error) {
        console.warn(`Database query failed, falling back to placeholder data. Error: ${(error as Error).message}`);
        return placeholderSales;
    }
};

export const fetchSaleById = async (id: string): Promise<Sale | undefined> => {
    const fallback = placeholderSales.find(s => s.id === id);
    const sale = await executeQueryById<{id: string, invoiceNumber: string, customerId: string, date: string, total: number, items: string}>(
         request => request.input('id', sql.VarChar, id).query(`
            SELECT 
                s.id, s.invoiceNumber, s.customerId, s.date, s.total,
                (SELECT 
                    si.productId, si.quantity, si.unitPrice, si.subtotal
                 FROM SaleItems si WHERE si.saleId = s.id FOR JSON PATH) as items
            FROM Sales s 
            WHERE s.id = @id
        `),
        fallback ? {...fallback, items: JSON.stringify(fallback.items)} : undefined
    );
    
    if (sale) {
        return {
            ...sale,
            items: JSON.parse(sale.items || '[]')
        }
    }
    return undefined;
};

export const saveSale = async (sale: Omit<Sale, 'id' | 'invoiceNumber'>): Promise<Sale> => {
    if (!USE_DATABASE) {
        console.log("Simulating save sale:", sale);
        const newSale: Sale = {
            ...sale,
            id: crypto.randomUUID(),
            invoiceNumber: `INV-SIM-${Math.floor(Math.random() * 1000)}`
        };
        placeholderSales.unshift(newSale); // Add to the beginning of the array
        return newSale;
    }
    // DB logic remains unchanged
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();

        const invRequest = new sql.Request(transaction);
        const lastInvoiceResult = await invRequest.query("SELECT TOP 1 invoiceNumber FROM Sales ORDER BY date DESC");
        const lastInvoiceNumber = lastInvoiceResult.recordset[0]?.invoiceNumber || 'INV-000';
        const newInvoiceNum = parseInt(lastInvoiceNumber.split('-')[1]) + 1;
        const newInvoiceNumber = `INV-${String(newInvoiceNum).padStart(3, '0')}`;
        
        const saleId = crypto.randomUUID();
        const saleRequest = new sql.Request(transaction);
        await saleRequest
            .input('id', sql.VarChar, saleId)
            .input('invoiceNumber', sql.VarChar, newInvoiceNumber)
            .input('customerId', sql.VarChar, sale.customerId)
            .input('date', sql.DateTime, new Date(sale.date))
            .input('total', sql.Decimal(10, 2), sale.total)
            .query('INSERT INTO Sales (id, invoiceNumber, customerId, date, total) VALUES (@id, @invoiceNumber, @customerId, @date, @total)');

        for (const item of sale.items) {
            const itemRequest = new sql.Request(transaction);
            await itemRequest
                .input('saleId', sql.VarChar, saleId)
                .input('productId', sql.VarChar, item.productId)
                .input('quantity', sql.Int, item.quantity)
                .input('unitPrice', sql.Decimal(10, 2), item.unitPrice)
                .input('subtotal', sql.Decimal(10, 2), item.subtotal)
                .query('INSERT INTO SaleItems (saleId, productId, quantity, unitPrice, subtotal) VALUES (@saleId, @productId, @quantity, @unitPrice, @subtotal)');
            
            const stockRequest = new sql.Request(transaction);
            await stockRequest
                .input('quantity', sql.Int, item.quantity)
                .input('productId', sql.VarChar, item.productId)
                .query('UPDATE Products SET stock = stock - @quantity WHERE id = @productId');
        }
        
        await transaction.commit();

        const newSale: Sale = { ...sale, id: saleId, invoiceNumber: newInvoiceNumber };
        return newSale;

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
};

// Dashboard data
export const getDashboardStats = async () => {
     if (!USE_DATABASE) {
        return {
            dailySales: placeholderSales
                .filter(s => new Date(s.date).toDateString() === new Date().toDateString())
                .reduce((sum, s) => sum + s.total, 0),
            monthlySales: placeholderSales
                .filter(s => new Date(s.date).getMonth() === new Date().getMonth())
                .reduce((sum, s) => sum + s.total, 0),
            totalCustomers: placeholderCustomers.length,
            lowStockProducts: placeholderProducts.filter(p => p.stock < 10).length,
        };
    }
    const request = await getRequest();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailySalesResult = await request.input('today', sql.DateTime, today).query('SELECT SUM(total) as total FROM Sales WHERE date >= @today');
    const monthlySalesResult = await request.input('startOfMonth', sql.DateTime, startOfMonth).query('SELECT SUM(total) as total FROM Sales WHERE date >= @startOfMonth');
    const totalCustomersResult = await request.query('SELECT COUNT(*) as total FROM Customers');
    const lowStockProductsResult = await request.query('SELECT COUNT(*) as total FROM Products WHERE stock < 10');

    return {
        dailySales: dailySalesResult.recordset[0].total || 0,
        monthlySales: monthlySalesResult.recordset[0].total || 0,
        totalCustomers: totalCustomersResult.recordset[0].total || 0,
        lowStockProducts: lowStockProductsResult.recordset[0].total || 0,
    };
};

export const getWeeklySalesData = async () => {
    if (!USE_DATABASE) {
        const today = new Date();
        const salesData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const daySales = placeholderSales
                .filter(s => new Date(s.date).toDateString() === date.toDateString())
                .reduce((sum, s) => sum + s.total, 0);
            salesData.push({
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                total: daySales,
            });
        }
        return salesData;
    }

    const request = await getRequest();
    const salesData = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        const result = await request
            .input('dayStart', sql.DateTime, date)
            .input('dayEnd', sql.DateTime, new Date(date.getTime() + 24 * 60 * 60 * 1000))
            .query('SELECT SUM(total) as total FROM Sales WHERE date >= @dayStart AND date < @dayEnd');

        salesData.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            total: result.recordset[0].total || 0,
        });
    }
    return salesData;
};


export const getTopSellingProducts = async (limit = 5) => {
    if (!USE_DATABASE) {
        const productSales: { [key: string]: number } = {};
        placeholderSales.forEach(sale => {
            sale.items.forEach(item => {
                productSales[item.productId] = (productSales[item.productId] || 0) + item.quantity;
            });
        });

        return Object.entries(productSales)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
            .slice(0, limit)
            .map(([productId, quantity]) => {
                const product = placeholderProducts.find(p => p.id === productId);
                return {
                    name: product?.name || 'Unknown',
                    imageUrl: product?.imageUrl || '',
                    quantity: quantity
                };
            });
    }
    const request = await getRequest();
    const result = await request
        .input('limit', sql.Int, limit)
        .query(`
            SELECT TOP (@limit)
                p.name,
                p.imageUrl,
                SUM(si.quantity) as quantity
            FROM SaleItems si
            JOIN Products p ON si.productId = p.id
            GROUP BY p.name, p.imageUrl
            ORDER BY quantity DESC
        `);
    return result.recordset;
};

// Company Data
const companyDataPath = path.join(process.cwd(), 'src', 'lib', 'company-data.json');

export const getCompanyData = async (): Promise<CompanyData> => {
    try {
        const fileContents = await fs.readFile(companyDataPath, 'utf8');
        return JSON.parse(fileContents);
    } catch (error) {
        console.warn('Could not read company-data.json, returning default. Error:', error);
        return {
            address: '123 Default St, City, Country',
            phone: '(000) 000-0000',
        };
    }
};

export const saveCompanyData = async (data: CompanyData): Promise<void> => {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(companyDataPath, jsonString, 'utf8');
    } catch (error) {
        console.error('Failed to write to company-data.json', error);
        throw new Error('Failed to save company data.');
    }
};

    