'use server';

import { generateProductDescription } from '@/ai/flows/generate-product-description';

export async function generateDescriptionAction(productName: string) {
  if (!productName) {
    return { error: 'Product name is required.' };
  }
  try {
    const result = await generateProductDescription({ productName });
    return { description: result.productDescription };
  } catch (error) {
    console.error('AI Error:', error);
    return { error: 'Failed to generate description.' };
  }
}
