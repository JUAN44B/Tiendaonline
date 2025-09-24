'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from 'recharts';

type SalesData = {
    name: string;
    [key: string]: any;
};

interface SalesChartProps {
  data: SalesData[];
  dataKey: string;
}

export default function SalesChart({ data, dataKey }: SalesChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
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
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent) / 0.2)' }}
            contentStyle={{
              background: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 'var(--radius)',
            }}
          />
          <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
            <LabelList dataKey={dataKey} position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
