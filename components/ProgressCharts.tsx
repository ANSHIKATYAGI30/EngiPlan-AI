
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { SubjectInsight, Theme } from '../types';

interface ProgressChartsProps {
  insights: SubjectInsight[];
  theme: Theme;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({ insights, theme }) => {
  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
  const textColor = theme === 'dark' ? '#cbd5e1' : '#334155';

  const data = insights.map((item, idx) => ({
    name: item.subjectName,
    value: item.timeAllocationPercent,
    color: COLORS[idx % COLORS.length]
  }));
  
  if (!data.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          No study data available yet.
        </p>
      </div>
    );}

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Subject Allocation</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
             <Pie
               data={data}
               cx="50%"
               cy="50%"
               innerRadius={60}
               outerRadius={80}
               paddingAngle={5}
               dataKey="value"
               label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                  borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                  color: textColor
                }} 
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-100">Weekly Effort (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke={textColor}
                fontSize={12}
                angle={-30}
                textAnchor="end"
                height={60}
                />
              <YAxis stroke={textColor} fontSize={12} />
              <Tooltip 
                cursor={{ fill: theme === 'dark' ? '#334155' : '#f1f5f9' }}
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                  borderColor: theme === 'dark' ? '#334155' : '#e2e8f0',
                  color: textColor
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
