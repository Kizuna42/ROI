export interface BasicInfo {
  productName: string;
  purpose: string;
  analysisYears: number;
}

export interface HumanResources {
  employeeCount: number;
  averageHourlyWage: number;
  monthlyHours: number;
  annualHours: number;
}

export interface BusinessMetrics {
  monthlyTransactions: number;
  avgProcessingTimeMinutes: number;
  errorRate: number;
  reworkRate: number;
}

export interface AdditionalCosts {
  recruitmentCost: number;
  trainingCost: number;
  managementCost: number;
  otherIndirectCosts: number;
}

export interface InitialInvestment {
  systemCost: number;
  customizationCost: number;
  migrationCost: number;
  setupCost: number;
}

export interface OperationalCosts {
  monthlySubscription: number;
  maintenanceCost: number;
  supportCost: number;
  additionalFeatureCost: number;
}

export interface EfficiencyGains {
  personnelReduction: number;
  workHourReduction: number;
  automationPercentage: number;
}

export interface QualityImprovements {
  errorReduction: number;
  customerSatisfactionIncrease: number;
  reworkReduction: number;
}

export interface OtherBenefits {
  opportunityLossReduction: number;
  scalabilityImprovement: number;
  competitiveAdvantage: number;
}

export interface ROIInputs {
  basicInfo: BasicInfo;
  humanResources: HumanResources;
  businessMetrics: BusinessMetrics;
  additionalCosts: AdditionalCosts;
  initialInvestment: InitialInvestment;
  operationalCosts: OperationalCosts;
  efficiencyGains: EfficiencyGains;
  qualityImprovements: QualityImprovements;
  otherBenefits: OtherBenefits;
}

export interface ROIResults {
  initialInvestmentTotal: number;
  annualOperationalCost: number;
  annualSavings: number;
  netAnnualBenefit: number;
  paybackPeriodMonths: number;
  roi3Year: number;
  roi5Year: number;
  npv: number;
  irr: number;
  cumulativeSavings: number[];
  monthlySavings: number[];
  costComparison: {
    current: number;
    withSolution: number;
    savings: number;
  };
}

export interface ExecutiveSummary {
  proposal: string;
  keyMetrics: {
    initialInvestment: number;
    annualSavings: number;
    paybackPeriod: number;
    roi3Year: number;
  };
  strategicValue: {
    competitiveAdvantage: string;
    scalability: string;
    riskReduction: string;
  };
  recommendedAction: string;
  fullReport: string;
}

export interface Scenario {
  id: string;
  name: string;
  inputs: ROIInputs;
  results: ROIResults;
  createdAt: Date;
}