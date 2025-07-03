import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ROIResults } from '../models/DataTypes';
import { FormattingUtils } from '../utils/formatting';

interface CumulativeEffectGraphProps {
  results: ROIResults;
  analysisYears: number;
}

const CumulativeEffectGraph: React.FC<CumulativeEffectGraphProps> = ({ results, analysisYears }) => {
  const { cumulativeSavings, initialInvestmentTotal } = results;

  const data = [
    {
      year: 0,
      累積効果: -initialInvestmentTotal,
      損益分岐点: 0
    },
    ...cumulativeSavings.map((savings, index) => ({
      year: index + 1,
      累積効果: savings,
      損益分岐点: 0
    }))
  ];

  const formatTooltip = (value: number, name: string) => {
    return [FormattingUtils.formatCurrency(value), name];
  };

  const formatLabel = (label: string) => {
    return `${label}年目`;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">累積効果の推移</h3>
        <div className="text-sm text-gray-600">
          {analysisYears}年間の投資効果の累積
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              dataKey="year" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}年`}
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
            <ReferenceLine 
              y={0} 
              stroke="#6b7280" 
              strokeDasharray="5 5"
              label={{ value: "損益分岐点", position: "insideTopRight", fontSize: 12 }}
            />
            <Line 
              type="monotone" 
              dataKey="累積効果" 
              stroke="#0ea5e9" 
              strokeWidth={3}
              dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0ea5e9', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              {FormattingUtils.formatCurrency(initialInvestmentTotal)}
            </div>
            <div className="text-sm text-gray-600">初期投資額</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-success-600">
              {FormattingUtils.formatCurrency(cumulativeSavings[cumulativeSavings.length - 1])}
            </div>
            <div className="text-sm text-gray-600">{analysisYears}年後の累積効果</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary-600">
              {FormattingUtils.formatMonths(results.paybackPeriodMonths)}
            </div>
            <div className="text-sm text-gray-600">投資回収期間</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CumulativeEffectGraph;