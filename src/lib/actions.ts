'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveProduct, deleteProduct, saveCategory, deleteCategory, saveCustomer, deleteCustomer, saveSale, saveCompanyData } from './data';
import type { Sale, CompanyData } from './definitions';

const productSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    price: z.coerce.number().positive("Price must be positive."),
    categoryId: z.string().min(1, "Category is required."),
    stock: z.coerce.number().int().min(0, "Stock cannot be negative."),
    imageUrl: z.string().url("Invalid image URL.").optional(),
});

export async function saveProductAction(formData: FormData) {
    const validatedFields = productSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        // Handle validation errors
        console.error(validatedFields.error);
        return { error: "Invalid fields" };
    }

    await saveProduct({
        ...validatedFields.data,
        imageUrl: validatedFields.data.imageUrl || 'https://picsum.photos/seed/placeholder/600/400'
    });
    revalidatePath('/products');
    redirect('/products');
}

export async function deleteProductAction(id: string) {
    await deleteProduct(id);
    revalidatePath('/products');
}

const categorySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
});

export async function saveCategoryAction(formData: FormData) {
    const validatedFields = categorySchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid fields" };
    }

    await saveCategory(validatedFields.data);
    revalidatePath('/categories');
}

export async function deleteCategoryAction(id: string) {
    await deleteCategory(id);
    revalidatePath('/categories');
}

const customerSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(1, "Phone is required."),
});

export async function saveCustomerAction(formData: FormData) {
    const validatedFields = customerSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { error: "Invalid fields" };
    }

    await saveCustomer(validatedFields.data);
    revalidatePath('/customers');
}

export async function deleteCustomerAction(id: string) {
    await deleteCustomer(id);
    revalidatePath('/customers');
}


export async function createSaleAction(saleData: Omit<Sale, 'id' | 'invoiceNumber' | 'date'> & { date?: string }) {
    // Basic validation
    if (!saleData.customerId || saleData.items.length === 0 || saleData.total <= 0) {
        return { error: 'Invalid sale data.' };
    }
    
    const saleToSave = {
        ...saleData,
        date: new Date().toISOString(),
    };

    const newSale = await saveSale(saleToSave);
    revalidatePath('/sales');
    revalidatePath('/products');
    revalidatePath('/dashboard');
    return { success: true, sale: newSale };
}

const companyDataSchema = z.object({
    address: z.string().min(1, "Address is required."),
    phone: z.string().min(1, "Phone is required."),
});

export async function saveCompanyDataAction(formData: FormData) {
    const validatedFields = companyDataSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        console.error(validatedFields.error);
        return { success: false, error: "Invalid fields" };
    }

    try {
        await saveCompanyData(validatedFields.data);
        revalidatePath('/settings');
        revalidatePath('/sales'); // To update tickets
        return { success: true };
    } catch (error) {
        console.error('Failed to save company data:', error);
        return { success: false, error: 'Failed to save data.' };
    }
}
