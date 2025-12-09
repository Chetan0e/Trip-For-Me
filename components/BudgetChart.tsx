import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BudgetBreakdown } from '../types';

interface BudgetChartProps {
  budget: BudgetBreakdown;
}

const COLORS = ['#4f46e5', '#8b5cf6', '#db2777', '#06b6d4', '#10b981'];

const BudgetChart: React.FC<BudgetChartProps> = ({ budget }) => {
  const data = [
    { name: 'Transport', value: budget.transport },
    { name: 'Stay', value: budget.accommodation },
    { name: 'Food', value: budget.food },
    { name: 'Activities', value: budget.activities },
    { name: 'Misc', value: budget.miscellaneous },
  ];

  return (
    <div className="h-80 w-full glass-card rounded-[24px] p-6 border border-white/10">
      <h3 className="text-lg font-bold text-white mb-2 font-display">Projected Spend ({budget.currency})</h3>
      <div className="h-full pb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number) => `${budget.currency} ${value}`}
                contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    backdropFilter: 'blur(10px)'
                }}
                itemStyle={{ color: '#fff' }}
            />
            <Legend 
                verticalAlign="middle" 
                align="right" 
                layout="vertical" 
                iconType="circle"
                wrapperStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'Outfit' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetChart;