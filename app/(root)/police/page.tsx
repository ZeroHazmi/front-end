'use client'

import React from 'react';
import { LineChart, PieChart, Line, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import DataPage from './data/page';

export default function PoliceDashboard() {

    return (
        <section>
            <DataPage />
        </section>
    );
}
