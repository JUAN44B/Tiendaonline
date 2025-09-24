'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import type { CompanyData } from '@/lib/definitions';
import { saveCompanyDataAction } from '@/lib/actions';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SettingsFormProps {
  companyData: CompanyData;
}

export default function SettingsForm({ companyData }: SettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await saveCompanyDataAction(formData);

      if (result.success) {
        toast({
          title: 'Configuración Guardada',
          description: 'La información de la empresa ha sido actualizada.',
        });
        router.refresh();
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo guardar la configuración.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
            <CardDescription>Esta información aparecerá en los tickets de venta.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  className="w-full"
                  defaultValue={companyData?.address}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  className="w-full"
                  defaultValue={companyData?.phone}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </div>
      </div>
    </form>
  );
}
