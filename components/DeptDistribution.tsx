
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { EmployeeActingData } from '../types';

interface DeptDistributionProps {
  data: EmployeeActingData[];
}

export const DeptDistribution: React.FC<DeptDistributionProps> = ({ data }) => {
  const deptMap = data.reduce((acc: Record<string, number>, curr) => {
    const deptName = curr.dept || 'Unassigned';
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(deptMap)
    .map(([name, count]) => ({ name, count: Number(count) }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
         <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Popular Departments</h3>
         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">By Volume</span>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100} 
              tick={{ fontSize: 10, fill: '#71717a', fontWeight: 'bold' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: '#18181b', 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                color: '#fff'
              }}
              itemStyle={{ color: '#1DB954', fontWeight: 'bold' }}
            />
            <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#1DB954' : '#3f3f46'} 
                  className="hover:fill-[#1ed760] transition-colors duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
