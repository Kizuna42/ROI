import { ROIInputs } from '../models/DataTypes';

export const createInputs = (overrides: Partial<{ [K in keyof ROIInputs]: Partial<ROIInputs[K]> }> = {}): ROIInputs => {
  const base: ROIInputs = {
    basicInfo: { productName: 'SaaS製品', purpose: '業務効率化', analysisYears: 3 },
    humanResources: { employeeCount: 10, averageHourlyWage: 3000, monthlyHours: 160, annualHours: 1920 },
    businessMetrics: { monthlyTransactions: 1000, avgProcessingTimeMinutes: 30, errorRate: 5, reworkRate: 3 },
    additionalCosts: { recruitmentCost: 500000, trainingCost: 200000, managementCost: 300000, otherIndirectCosts: 100000 },
    initialInvestment: { systemCost: 2000000, customizationCost: 500000, migrationCost: 300000, setupCost: 200000 },
    operationalCosts: { monthlySubscription: 50000, maintenanceCost: 100000, supportCost: 50000, additionalFeatureCost: 0 },
    efficiencyGains: { personnelReduction: 20, workHourReduction: 30, automationPercentage: 50 },
    qualityImprovements: { errorReduction: 70, customerSatisfactionIncrease: 20, reworkReduction: 80 },
    otherBenefits: { opportunityLossReduction: 500000, scalabilityImprovement: 300000, competitiveAdvantage: 200000 },
  };

  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [
      key,
      { ...value, ...(overrides[key as keyof ROIInputs] ?? {}) },
    ]),
  ) as unknown as ROIInputs;
};
