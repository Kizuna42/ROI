import React from 'react';
import { ROIResults } from '../models/DataTypes';
import { FormattingUtils } from '../utils/formatting';

interface KPICardsProps {
  results: ROIResults;
}

const KPICards: React.FC<KPICardsProps> = ({ results }) => {
  const {
    initialInvestmentTotal,
    annualSavings,
    netAnnualBenefit,
    paybackPeriodMonths,
    roi3Year,
    roi5Year,
    npv,
    irr
  } = results;

  const kpiData = [
    {
      label: '初期投資額',
      value: FormattingUtils.formatCurrency(initialInvestmentTotal),
      className: 'metric-card',
      valueClassName: 'metric-value text-gray-700'
    },
    {
      label: '年間削減額',
      value: FormattingUtils.formatCurrency(annualSavings),
      className: 'success-metric',
      valueClassName: 'success-value metric-value'
    },
    {
      label: '年間純利益',
      value: FormattingUtils.formatCurrency(netAnnualBenefit),
      className: netAnnualBenefit > 0 ? 'success-metric' : 'danger-metric',
      valueClassName: netAnnualBenefit > 0 ? 'success-value metric-value' : 'danger-value metric-value'
    },
    {
      label: '投資回収期間',
      value: FormattingUtils.formatMonths(paybackPeriodMonths),
      className: paybackPeriodMonths <= 12 ? 'success-metric' : paybackPeriodMonths <= 24 ? 'warning-metric' : 'danger-metric',
      valueClassName: paybackPeriodMonths <= 12 ? 'success-value metric-value' : paybackPeriodMonths <= 24 ? 'warning-value metric-value' : 'danger-value metric-value'
    },
    {
      label: '3年間ROI',
      value: FormattingUtils.formatPercentage(roi3Year),
      className: roi3Year > 100 ? 'success-metric' : roi3Year > 50 ? 'warning-metric' : 'danger-metric',
      valueClassName: roi3Year > 100 ? 'success-value metric-value' : roi3Year > 50 ? 'warning-value metric-value' : 'danger-value metric-value'
    },
    {
      label: '5年間ROI',
      value: FormattingUtils.formatPercentage(roi5Year),
      className: roi5Year > 150 ? 'success-metric' : roi5Year > 100 ? 'warning-metric' : 'danger-metric',
      valueClassName: roi5Year > 150 ? 'success-value metric-value' : roi5Year > 100 ? 'warning-value metric-value' : 'danger-value metric-value'
    },
    {
      label: 'NPV',
      value: FormattingUtils.formatCurrency(npv),
      className: npv > 0 ? 'success-metric' : 'danger-metric',
      valueClassName: npv > 0 ? 'success-value metric-value' : 'danger-value metric-value'
    },
    {
      label: 'IRR',
      value: FormattingUtils.formatPercentage(irr),
      className: irr > 15 ? 'success-metric' : irr > 8 ? 'warning-metric' : 'danger-metric',
      valueClassName: irr > 15 ? 'success-value metric-value' : irr > 8 ? 'warning-value metric-value' : 'danger-value metric-value'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiData.map((kpi, index) => (
        <div key={index} className={`${kpi.className} p-4 rounded-lg transition-all duration-300 hover:shadow-lg`}>
          <div className="flex flex-col">
            <div className={`${kpi.valueClassName} text-2xl font-bold mb-1`}>
              {kpi.value}
            </div>
            <div className="metric-label text-sm text-gray-600 font-medium">
              {kpi.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;