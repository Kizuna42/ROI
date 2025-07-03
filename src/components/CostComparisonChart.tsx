import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ROIResults } from '../models/DataTypes';
import { FormattingUtils } from '../utils/formatting';

interface CostComparisonChartProps {
  results: ROIResults;
}

const CostComparisonChart: React.FC<CostComparisonChartProps> = ({ results }) => {
  const { costComparison } = results;

  const data = [
    {
      name: '現在のコスト',
      現在: costComparison.current,
      導入後: 0,
      削減額: 0
    },
    {
      name: '導入後のコスト',
      現在: 0,
      導入後: costComparison.withSolution,
      削減額: 0
    },
    {
      name: '年間削減額',
      現在: 0,
      導入後: 0,
      削減額: costComparison.savings
    }
  ];

  const formatTooltip = (value: number, name: string) => {
    return [FormattingUtils.formatCurrency(value), name];
  };

  const formatLabel = (label: string) => {
    return label;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">コスト比較分析</h3>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => FormattingUtils.formatCurrencyCompact(value)}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelFormatter={formatLabel}
              contentStyle={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar 
              dataKey="現在" 
              fill="#dc2626" 
              name="現在のコスト"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="導入後" 
              fill="#0ea5e9" 
              name="導入後のコスト"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="削減額" 
              fill="#22c55e" 
              name="年間削減額"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CostComparisonChart;