import React, { useState, useMemo } from 'react';
import { Card } from '@/shared/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const GPALineChart = ({ history = [] }) => {
  const [filter, setFilter] = useState('All');

  const chartData = useMemo(() => {
    const validHistory = Array.isArray(history) ? history : [];
    if (validHistory.length === 0) return [{ name: 'Start', gpa: 0 }];
    return validHistory.map(item => ({
      name: `Year ${item.academicYear}`,
      gpa: item.cumulativeGpa
    }));
  }, [history]);

  return (
    <Card className="col-span-2 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-dark-blue">Student GPA</h2>
        <select 
          className="bg-bg-app border-none text-sm text-gray-text px-3 py-1.5 rounded-lg outline-none focus:ring-2 focus:ring-main/20"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Years</option>
        </select>
      </div>

      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 10 }}
              dy={10}
            />
            <YAxis 
              domain={[0, 4]} 
              ticks={[0, 1, 2, 3, 4]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Line 
              type="monotone" 
              dataKey="gpa" 
              stroke="#00C48C" 
              strokeWidth={2} 
              dot={{ r: 3, fill: '#00C48C', strokeWidth: 0 }} 
              activeDot={{ r: 5 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GPALineChart;
