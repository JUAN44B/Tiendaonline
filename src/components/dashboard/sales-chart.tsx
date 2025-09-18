'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useEffect, useState } from 'react';
import { getWeeklySalesData } from '@/lib/data';

type SalesData = {
    name: string;
    total: number;
};

export default function SalesChart() {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  
  useEffect(() => {
    // This is now a server action, but we call it in useEffect to keep it a client component
    // In a real app, you might use a library like SWR or React Query
    getWeeklySalesData().then(data => setSalesData(data));
  }, []);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
            contentStyle={{
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
          />
          <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
