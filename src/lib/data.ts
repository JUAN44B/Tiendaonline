import type { Product, Category, Customer, Sale, SaleItem } from './definitions';
import { getConnection } from './db';
import sql from 'mssql';

// Helper to ensure connection is available
async function getRequest() {
    const pool = await getConnection();
    return pool.request();
}

// Products
export const fetchProducts = async (): Promise<Product[]> => {
    const request = await getRequest();
    const result = await request.query('SELECT * FROM Products ORDER BY Name');
    return result.recordset;
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
    const request = await getRequest();
    const result = await request.input('id', sql.VarChar, id).query('SELECT * FROM Products WHERE id = @id');
    return result.recordset[0];
};

export const saveProduct = async (product: Omit<Product, 'id'> & { id?: string }): Promise<boolean> => {
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
    const request = await getRequest();
    await request.input('id', sql.VarChar, id).query('DELETE FROM Products WHERE id = @id');
    return true;
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
    const request = await getRequest();
    const result = await request.query('SELECT * FROM Categories ORDER BY Name');
    return result.recordset;
};

export const saveCategory = async (category: Omit<Category, 'id'> & { id?: string }): Promise<boolean> => {
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
    const request = await getRequest();
    await request.input('id', sql.VarChar, id).query('DELETE FROM Categories WHERE id = @id');
    return true;
};

// Customers
export const fetchCustomers = async (): Promise<Customer[]> => {
    const request = await getRequest();
    const result = await request.query('SELECT * FROM Customers ORDER BY Name');
    return result.recordset;
};

export const fetchCustomerById = async (id: string): Promise<Customer | undefined> => {
    const request = await getRequest();
    const result = await request.input('id', sql.VarChar, id).query('SELECT * FROM Customers WHERE id = @id');
    return result.recordset[0];
};

export const saveCustomer = async (customer: Omit<Customer, 'id'> & { id?: string }): Promise<boolean> => {
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
    const request = await getRequest();
    await request.input('id', sql.VarChar, id).query('DELETE FROM Customers WHERE id = @id');
    return true;
};

// Sales
export const fetchSales = async (): Promise<Sale[]> => {
    const request = await getRequest();
    const salesResult = await request.query('SELECT * FROM Sales ORDER BY date DESC');
    const sales: Sale[] = salesResult.recordset;

    for (const sale of sales) {
        const itemsResult = await request.input('saleId', sql.VarChar, sale.id).query('SELECT * FROM SaleItems WHERE saleId = @saleId');
        sale.items = itemsResult.recordset;
    }
    return sales;
};

export const fetchSaleById = async (id: string): Promise<Sale | undefined> => {
    const request = await getRequest();
    const saleResult = await request.input('id', sql.VarChar, id).query('SELECT * FROM Sales WHERE id = @id');
    const sale: Sale | undefined = saleResult.recordset[0];

    if (sale) {
        const itemsResult = await request.input('saleId', sql.VarChar, sale.id).query('SELECT * FROM SaleItems WHERE saleId = @saleId');
        sale.items = itemsResult.recordset;
    }
    return sale;
};

export const saveSale = async (sale: Omit<Sale, 'id' | 'invoiceNumber'>): Promise<Sale> => {
    const pool = await getConnection();
    const transaction = new sql.Transaction(pool);
    
    try {
        await transaction.begin();

        const invRequest = new sql.Request(transaction);
        const lastInvoiceResult = await invRequest.query("SELECT TOP 1 invoiceNumber FROM Sales ORDER BY invoiceNumber DESC");
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
    const request = await getRequest();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const dailySalesResult = await request.input('today', sql.DateTime, today).query('SELECT SUM(total) as total FROM Sales WHERE date >= @today');
    const monthlySalesResult = await request.input('startOfMonth', sql.DateTime, startOfMonth).query('SELECT SUM(total) as total FROM Sales WHERE date >= @startOfMonth');
    const totalCustomersResult = await request.query('SELECT COUNT(*) as total FROM Customers');
    const lowStockProductsResult = await request.query('SELECT COUNT(*) as total FROM Products WHERE stock < 5');

    return {
        dailySales: dailySalesResult.recordset[0].total || 0,
        monthlySales: monthlySalesResult.recordset[0].total || 0,
        totalCustomers: totalCustomersResult.recordset[0].total || 0,
        lowStockProducts: lowStockProductsResult.recordset[0].total || 0,
    };
};

export const getWeeklySalesData = async () => {
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
