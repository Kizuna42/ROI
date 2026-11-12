import { ROIInputs, ROIResults } from './DataTypes';
import { FormattingUtils } from '../utils/formatting';

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
    // 各削減率は残りの人件費に順に効くものとして乗算で合成する（単純合算すると 100% を超えうるため）
    const laborReductionRate = this.combineReductionRates([
      efficiencyGains.personnelReduction,
      efficiencyGains.workHourReduction,
      efficiencyGains.automationPercentage
    ]);
    const laborSavings = laborReductionRate * currentAnnualLaborCost;

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

    // Payback period calculation (never recovered when the net benefit is not positive)
    const paybackPeriodMonths = this.calculatePaybackMonths(initialInvestmentTotal, netAnnualBenefit);

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

  /**
   * 複数の削減率（%）を 1 − Π(1 − r_i) で合成し、0〜1 の割合で返す。
   * 各率は 0〜100% に丸めるため、合成結果が 100% を超えることはない。
   */
  static combineReductionRates(ratesPercent: Array<number | undefined>): number {
    const remaining = ratesPercent.reduce<number>((acc, rate) => {
      const r = typeof rate === 'number' && Number.isFinite(rate) ? Math.min(Math.max(rate, 0), 100) / 100 : 0;
      return acc * (1 - r);
    }, 1);
    return 1 - remaining;
  }

  private static calculatePaybackMonths(initialInvestment: number, annualBenefit: number): number {
    if (initialInvestment <= 0) {
      return 0;
    }
    if (annualBenefit <= 0) {
      return Infinity;
    }
    return initialInvestment / (annualBenefit / this.MONTHS_PER_YEAR);
  }

  private static calculateROIPercentage(initialInvestment: number, annualBenefit: number, years: number): number {
    const totalBenefit = annualBenefit * years;
    const totalCost = initialInvestment;
    if (totalCost <= 0) {
      // ROI is undefined without an investment
      return NaN;
    }
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
    // IRR only exists for a conventional cash flow (investment first, positive returns after)
    if (initialInvestment <= 0 || annualBenefit <= 0 || years < 1) {
      return NaN;
    }

    // NPV(r) = -I + Σ B/(1+r)^t is strictly decreasing on r > -1, tends to +∞ as r → -1
    // and to -I < 0 as r → ∞, so exactly one root exists. Bracket it and use
    // Newton-Raphson, falling back to bisection whenever a step leaves the bracket.
    const npvAndDerivative = (rate: number): [number, number] => {
      let f = -initialInvestment;
      let df = 0;
      for (let year = 1; year <= years; year++) {
        const discounted = annualBenefit / Math.pow(1 + rate, year);
        f += discounted;
        df -= (year * discounted) / (1 + rate);
      }
      return [f, df];
    };

    let lo = -0.9999999999;
    let hi = 1;
    while (npvAndDerivative(hi)[0] > 0) {
      hi *= 2;
      if (hi > 1e12) return NaN;
    }
    if (!(npvAndDerivative(lo)[0] > 0)) {
      // No sign change within a representable range
      return NaN;
    }

    let irr = Math.min(Math.max(0.1, lo), hi); // Initial guess
    const maxIterations = 200;

    for (let i = 0; i < maxIterations; i++) {
      const [f, df] = npvAndDerivative(irr);
      if (f === 0) {
        return irr * 100;
      }
      if (f > 0) {
        lo = irr;
      } else {
        hi = irr;
      }

      let next = irr - f / df;
      if (!Number.isFinite(next) || next <= lo || next >= hi) {
        next = (lo + hi) / 2;
      }
      if (Math.abs(next - irr) <= 1e-15 * Math.max(1, Math.abs(next)) || hi - lo <= 1e-15) {
        return next * 100;
      }
      irr = next;
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
    return FormattingUtils.formatPercentage(value, decimals);
  }

  static formatNumber(value: number): string {
    return new Intl.NumberFormat('ja-JP').format(value);
  }
}
