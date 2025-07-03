import React, { useState } from 'react';
import { ROIInputs, ROIResults } from '../models/DataTypes';
import { ROICalculator } from '../models/ROICalculator';
import { FormattingUtils } from '../utils/formatting';

interface SensitivityHeatmapProps {
  baseInputs: ROIInputs;
  baseResults: ROIResults;
}

interface SensitivityData {
  parameter: string;
  label: string;
  values: number[];
  roiResults: number[];
}

const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({ baseInputs, baseResults }) => {
  const [selectedMetric, setSelectedMetric] = useState<'roi3Year' | 'paybackPeriodMonths' | 'npv'>('roi3Year');
  
  const getVariationRange = (baseValue: number, percentage: number = 0.3) => {
    const variation = baseValue * percentage;
    return [
      baseValue - variation,
      baseValue - variation * 0.5,
      baseValue,
      baseValue + variation * 0.5,
      baseValue + variation
    ];
  };

  const calculateSensitivity = (): SensitivityData[] => {
    const parameters = [
      {
        parameter: 'monthlySubscription',
        label: '月額利用料',
        baseValue: baseInputs.operationalCosts.monthlySubscription,
        path: 'operationalCosts.monthlySubscription'
      },
      {
        parameter: 'systemCost',
        label: 'システム導入費',
        baseValue: baseInputs.initialInvestment.systemCost,
        path: 'initialInvestment.systemCost'
      },
      {
        parameter: 'automationPercentage',
        label: '自動化率',
        baseValue: baseInputs.efficiencyGains.automationPercentage,
        path: 'efficiencyGains.automationPercentage'
      },
      {
        parameter: 'errorReduction',
        label: 'エラー削減率',
        baseValue: baseInputs.qualityImprovements.errorReduction,
        path: 'qualityImprovements.errorReduction'
      },
      {
        parameter: 'employeeCount',
        label: '従業員数',
        baseValue: baseInputs.humanResources.employeeCount,
        path: 'humanResources.employeeCount'
      }
    ];

    return parameters.map(param => {
      const values = getVariationRange(param.baseValue);
      const roiResults = values.map(value => {
        const modifiedInputs = JSON.parse(JSON.stringify(baseInputs));
        const pathParts = param.path.split('.');
        let target = modifiedInputs;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          target = target[pathParts[i]];
        }
        target[pathParts[pathParts.length - 1]] = value;
        
        const results = ROICalculator.calculate(modifiedInputs);
        return results[selectedMetric];
      });

      return {
        parameter: param.parameter,
        label: param.label,
        values,
        roiResults
      };
    });
  };

  const sensitivityData = calculateSensitivity();

  const getColorClass = (value: number, baseValue: number) => {
    const percentChange = ((value - baseValue) / baseValue) * 100;
    
    if (percentChange > 20) return 'bg-success-500';
    if (percentChange > 10) return 'bg-success-300';
    if (percentChange > 5) return 'bg-success-100';
    if (percentChange > -5) return 'bg-gray-100';
    if (percentChange > -10) return 'bg-warning-100';
    if (percentChange > -20) return 'bg-warning-300';
    return 'bg-danger-300';
  };

  const formatValue = (value: number) => {
    switch (selectedMetric) {
      case 'roi3Year':
        return FormattingUtils.formatPercentage(value);
      case 'paybackPeriodMonths':
        return FormattingUtils.formatMonths(value);
      case 'npv':
        return FormattingUtils.formatCurrencyCompact(value);
      default:
        return value.toString();
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'roi3Year':
        return '3年間ROI';
      case 'paybackPeriodMonths':
        return '投資回収期間';
      case 'npv':
        return 'NPV';
      default:
        return '';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">感度分析</h3>
        <div className="flex gap-2">
          <select 
            value={selectedMetric} 
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="form-input text-sm"
          >
            <option value="roi3Year">3年間ROI</option>
            <option value="paybackPeriodMonths">投資回収期間</option>
            <option value="npv">NPV</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 text-sm font-medium text-gray-700">パラメータ</th>
              <th className="text-center p-2 text-sm font-medium text-gray-700">-30%</th>
              <th className="text-center p-2 text-sm font-medium text-gray-700">-15%</th>
              <th className="text-center p-2 text-sm font-medium text-gray-700">ベース</th>
              <th className="text-center p-2 text-sm font-medium text-gray-700">+15%</th>
              <th className="text-center p-2 text-sm font-medium text-gray-700">+30%</th>
            </tr>
          </thead>
          <tbody>
            {sensitivityData.map((data, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-sm font-medium text-gray-700">
                  {data.label}
                </td>
                {data.roiResults.map((result, valueIndex) => (
                  <td key={valueIndex} className="p-2 text-center">
                    <div 
                      className={`px-2 py-1 rounded text-xs font-medium ${getColorClass(result, baseResults[selectedMetric])}`}
                    >
                      {formatValue(result)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 mb-2">
          <strong>{getMetricLabel()}</strong>の感度分析
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success-500 rounded"></div>
            <span>大幅改善</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success-300 rounded"></div>
            <span>改善</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>変化なし</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-warning-300 rounded"></div>
            <span>悪化</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-danger-300 rounded"></div>
            <span>大幅悪化</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensitivityHeatmap;