'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Wand2, Loader2 } from 'lucide-react';

import type { Product, Category } from '@/lib/definitions';
import { saveProductAction } from '@/lib/actions';
import { generateDescriptionAction } from '@/app/actions/ai';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');

  const handleGenerateDescription = async () => {
    if (!name) {
      toast({
        title: 'Product name required',
        description: 'Please enter a product name before generating a description.',
        variant: 'destructive',
      });
      return;
    }
    setIsGenerating(true);
    const result = await generateDescriptionAction(name);
    if (result.description) {
      setDescription(result.description);
      toast({
        title: 'Description generated!',
        description: 'The AI-generated description has been filled in.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Could not generate description.',
        variant: 'destructive',
      });
    }
    setIsGenerating(false);
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await saveProductAction(formData);
      toast({
        title: product ? 'Product Updated' : 'Product Created',
        description: `The product "${formData.get('name')}" has been saved successfully.`,
      });
    });
  };

  return (
    <form action={handleSubmit}>
      <input type="hidden" name="id" defaultValue={product?.id} />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  className="w-full"
                  defaultValue={product?.name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    name="description"
                    className="w-full"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="absolute bottom-2 right-2"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span className="sr-only">Generate Description</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product?.price}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    defaultValue={product?.stock}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select name="categoryId" defaultValue={product?.categoryId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {product ? 'Update Product' : 'Create Product'}
            </Button>
        </div>
      </div>
    </form>
  );
}
