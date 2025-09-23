-- Create the database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'AliruDB')
BEGIN
    CREATE DATABASE AliruDB;
END
GO

-- Use the newly created database
USE AliruDB;
GO

-- Drop existing tables if they exist to start fresh
IF OBJECT_ID('dbo.SaleItems', 'U') IS NOT NULL DROP TABLE dbo.SaleItems;
IF OBJECT_ID('dbo.Sales', 'U') IS NOT NULL DROP TABLE dbo.Sales;
IF OBJECT_ID('dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
IF OBJECT_ID('dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL DROP TABLE dbo.Customers;
GO

-- Table for product categories
CREATE TABLE Categories (
    id VARCHAR(255) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX)
);

-- Table for products
CREATE TABLE Products (
    id VARCHAR(255) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    imageUrl VARCHAR(1024),
    categoryId VARCHAR(255),
    FOREIGN KEY (categoryId) REFERENCES Categories(id)
);

-- Table for customers
CREATE TABLE Customers (
    id VARCHAR(255) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255),
    phone NVARCHAR(50)
);

-- Table for sales
CREATE TABLE Sales (
    id VARCHAR(255) PRIMARY KEY,
    invoiceNumber VARCHAR(50) NOT NULL UNIQUE,
    customerId VARCHAR(255),
    date DATETIME NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (customerId) REFERENCES Customers(id)
);

-- Table for sale items (details of each sale)
CREATE TABLE SaleItems (
    saleId VARCHAR(255),
    productId VARCHAR(255),
    quantity INT NOT NULL,
    unitPrice DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (saleId, productId),
    FOREIGN KEY (saleId) REFERENCES Sales(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id)
);
GO

-- Insert sample data

-- Sample Categories
INSERT INTO Categories (id, name, description) VALUES
('cat_1', 'Frenos', 'Componentes del sistema de frenado.'),
('cat_2', 'Suspensión', 'Partes para la suspensión del remolque.'),
('cat_3', 'Iluminación', 'Luces y componentes eléctricos.'),
('cat_4', 'Llantas y Rines', 'Llantas y rines para todo tipo de remolque.');
GO

-- Sample Products
INSERT INTO Products (id, name, description, price, stock, imageUrl, categoryId) VALUES
('prod_1', 'Brake Drum', 'Heavy-duty brake drum for commercial trailers.', 120.50, 50, 'https://picsum.photos/seed/brakedrum/600/400', 'cat_1'),
('prod_2', 'Air Spring', 'Durable air spring for a smooth ride.', 85.00, 30, 'https://picsum.photos/seed/airspring/600/400', 'cat_2'),
('prod_3', 'LED Tail Light', 'Bright and long-lasting LED tail light.', 25.99, 100, 'https://picsum.photos/seed/ledlight/600/400', 'cat_3'),
('prod_4', '22.5" Steel Wheel', 'Standard steel wheel for semi-trailers.', 150.00, 40, 'https://picsum.photos/seed/steelwheel/600/400', 'cat_4'),
('prod_5', 'Slack Adjuster', 'Automatic slack adjuster for consistent brake performance.', 45.75, 60, 'https://picsum.photos/seed/slackadjuster/600/400', 'cat_1'),
('prod_6', 'Shock Absorber', 'Heavy-duty shock absorber for trailer suspension.', 65.50, 75, 'https://picsum.photos/seed/shockabsorber/600/400', 'cat_2');
GO

-- Sample Customers
INSERT INTO Customers (id, name, email, phone) VALUES
('cust_1', 'Juan Pérez', 'juan.perez@example.com', '555-1234'),
('cust_2', 'Transportes Rápidos SA', 'contacto@transportesrapidos.com', '555-5678'),
('cust_3', 'Maria Garcia', 'maria.garcia@email.com', '555-8765');
GO

PRINT 'Database AliruDB and tables created successfully with sample data.';
GO
