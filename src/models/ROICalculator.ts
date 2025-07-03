import { ROIInputs, ROIResults } from './DataTypes';

export class ROICalculator {
  private static readonly DISCOUNT_RATE = 0.08; // 8% discount rate for NPV calculations
  private static readonly MONTHS_PER_YEAR = 12;

  static calculate(inputs: ROIInputs): ROIResults {
    const {
      humanResources,
      businessMetrics,
      additionalCosts,
      initialInvestment,
      operationalCosts,
      efficiencyGains,
      qualityImprovements,
      otherBenefits,
      basicInfo
    } = inputs;

    // Calculate total initial investment
    const initialInvestmentTotal = 
      initialInvestment.systemCost +
      initialInvestment.customizationCost +
      initialInvestment.migrationCost +
      initialInvestment.setupCost;

    // Calculate annual operational costs
    const annualOperationalCost = 
      (operationalCosts.monthlySubscription * this.MONTHS_PER_YEAR) +
      operationalCosts.maintenanceCost +
      operationalCosts.supportCost +
      operationalCosts.additionalFeatureCost;

    // Calculate current annual costs
    const currentAnnualLaborCost = 
      humanResources.employeeCount * 
      humanResources.averageHourlyWage * 
      humanResources.annualHours;

    const currentAnnualAdditionalCosts = 
      additionalCosts.recruitmentCost +
      additionalCosts.trainingCost +
      additionalCosts.managementCost +
      additionalCosts.otherIndirectCosts;

    const currentTotalAnnualCost = currentAnnualLaborCost + currentAnnualAdditionalCosts;

    // Calculate savings from efficiency gains
    const laborSavings = 
      (efficiencyGains.personnelReduction / 100) * currentAnnualLaborCost +
      (efficiencyGains.workHourReduction / 100) * currentAnnualLaborCost +
      (efficiencyGains.automationPercentage / 100) * currentAnnualLaborCost;

    // Calculate savings from quality improvements
    const errorCostReduction = 
      (qualityImprovements.errorReduction / 100) * 
      (businessMetrics.errorRate / 100) * 
      currentAnnualLaborCost;

    const reworkCostReduction = 
      (qualityImprovements.reworkReduction / 100) * 
      (businessMetrics.reworkRate / 100) * 
      currentAnnualLaborCost;

    // Calculate other benefits
    const opportunityLossSavings = otherBenefits.opportunityLossReduction;
    const scalabilitySavings = otherBenefits.scalabilityImprovement;

    // Total annual savings
    const annualSavings = 
      laborSavings + 
      errorCostReduction + 
      reworkCostReduction + 
      opportunityLossSavings + 
      scalabilitySavings;

    // Net annual benefit (savings minus operational costs)
    const netAnnualBenefit = annualSavings - annualOperationalCost;

    // Payback period calculation
    const paybackPeriodMonths = initialInvestmentTotal / (netAnnualBenefit / this.MONTHS_PER_YEAR);

    // ROI calculations
    const roi3Year = this.calculateROIPercentage(initialInvestmentTotal, netAnnualBenefit, 3);
    const roi5Year = this.calculateROIPercentage(initialInvestmentTotal, netAnnualBenefit, 5);

    // NPV calculation
    const npv = this.calculateNPV(initialInvestmentTotal, netAnnualBenefit, basicInfo.analysisYears);

    // IRR calculation
    const irr = this.calculateIRR(initialInvestmentTotal, netAnnualBenefit, basicInfo.analysisYears);

    // Cumulative savings over time
    const cumulativeSavings = this.calculateCumulativeSavings(
      initialInvestmentTotal,
      netAnnualBenefit,
      basicInfo.analysisYears
    );

    // Monthly savings
    const monthlySavings = this.calculateMonthlySavings(
      netAnnualBenefit,
      basicInfo.analysisYears
    );

    // Cost comparison
    const costComparison = {
      current: currentTotalAnnualCost,
      withSolution: currentTotalAnnualCost - annualSavings + annualOperationalCost,
      savings: annualSavings - annualOperationalCost
    };

    return {
      initialInvestmentTotal,
      annualOperationalCost,
      annualSavings,
      netAnnualBenefit,
      paybackPeriodMonths,
      roi3Year,
      roi5Year,
      npv,
      irr,
      cumulativeSavings,
      monthlySavings,
      costComparison
    };
  }

  private static calculateROIPercentage(initialInvestment: number, annualBenefit: number, years: number): number {
    const totalBenefit = annualBenefit * years;
    const totalCost = initialInvestment;
    return ((totalBenefit - totalCost) / totalCost) * 100;
  }

  private static calculateNPV(initialInvestment: number, annualBenefit: number, years: number): number {
    let npv = -initialInvestment;
    
    for (let year = 1; year <= years; year++) {
      npv += annualBenefit / Math.pow(1 + this.DISCOUNT_RATE, year);
    }
    
    return npv;
  }

  private static calculateIRR(initialInvestment: number, annualBenefit: number, years: number): number {
    // Simple IRR calculation using Newton-Raphson method
    let irr = 0.1; // Initial guess
    let tolerance = 0.0001;
    let maxIterations = 100;
    
    for (let i = 0; i < maxIterations; i++) {
      let f = -initialInvestment;
      let df = 0;
      
      for (let year = 1; year <= years; year++) {
        f += annualBenefit / Math.pow(1 + irr, year);
        df -= year * annualBenefit / Math.pow(1 + irr, year + 1);
      }
      
      if (Math.abs(f) < tolerance) {
        break;
      }
      
      irr = irr - f / df;
    }
    
    return irr * 100;
  }

  private static calculateCumulativeSavings(
    initialInvestment: number,
    annualBenefit: number,
    years: number
  ): number[] {
    const cumulative = [];
    let total = -initialInvestment;
    
    for (let year = 1; year <= years; year++) {
      total += annualBenefit;
      cumulative.push(total);
    }
    
    return cumulative;
  }

  private static calculateMonthlySavings(annualBenefit: number, years: number): number[] {
    const monthlyBenefit = annualBenefit / this.MONTHS_PER_YEAR;
    const monthlySavings = [];
    
    for (let month = 1; month <= years * this.MONTHS_PER_YEAR; month++) {
      monthlySavings.push(monthlyBenefit);
    }
    
    return monthlySavings;
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  static formatNumber(value: number): string {
    return new Intl.NumberFormat('ja-JP').format(value);
  }
}