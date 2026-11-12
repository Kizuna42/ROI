import { describe, expect, it } from 'vitest';
import { ROICalculator } from '../ROICalculator';
import { createInputs } from '../../test/fixtures';

describe('ROICalculator.calculate', () => {
  it('computes the core metrics for the default scenario', () => {
    const results = ROICalculator.calculate(createInputs());

    expect(results.initialInvestmentTotal).toBe(3_000_000);
    expect(results.annualOperationalCost).toBe(50_000 * 12 + 100_000 + 50_000);

    const labor = 10 * 3000 * 1920;
    const expectedSavings =
      labor * (1 - 0.8 * 0.7 * 0.5) + 0.7 * 0.05 * labor + 0.8 * 0.03 * labor + 500_000 + 300_000;
    expect(results.annualSavings).toBeCloseTo(expectedSavings);

    const net = expectedSavings - results.annualOperationalCost;
    expect(results.netAnnualBenefit).toBeCloseTo(net);
    expect(results.paybackPeriodMonths).toBeCloseTo(3_000_000 / (net / 12));
    expect(results.roi3Year).toBeCloseTo(((net * 3 - 3_000_000) / 3_000_000) * 100);
    expect(results.roi5Year).toBeCloseTo(((net * 5 - 3_000_000) / 3_000_000) * 100);
    expect(results.cumulativeSavings).toHaveLength(3);
    expect(results.monthlySavings).toHaveLength(36);
  });

  it('discounts NPV at 8% per year', () => {
    const results = ROICalculator.calculate(createInputs());
    const net = results.netAnnualBenefit;
    const expected = -3_000_000 + net / 1.08 + net / 1.08 ** 2 + net / 1.08 ** 3;
    expect(results.npv).toBeCloseTo(expected, 4);
  });

  it('finds an IRR at which the NPV of the cash flows is zero', () => {
    // Keep the benefit modest so that IRR is a realistic value
    const inputs = createInputs({
      efficiencyGains: { personnelReduction: 0, workHourReduction: 0, automationPercentage: 3 },
      qualityImprovements: { errorReduction: 0, reworkReduction: 0 },
      otherBenefits: { opportunityLossReduction: 0, scalabilityImprovement: 0 },
      operationalCosts: { monthlySubscription: 0, maintenanceCost: 0, supportCost: 0 },
    });
    const results = ROICalculator.calculate(inputs);
    const rate = results.irr / 100;
    const net = results.netAnnualBenefit;
    const npvAtIrr = -3_000_000 + net / (1 + rate) + net / (1 + rate) ** 2 + net / (1 + rate) ** 3;

    expect(Number.isFinite(results.irr)).toBe(true);
    expect(Math.abs(npvAtIrr)).toBeLessThan(1);
  });

  // Net annual benefit comes only from opportunityLossReduction; initial investment stays at 3,000,000
  const withNetBenefit = (netAnnualBenefit: number, analysisYears: number) =>
    createInputs({
      basicInfo: { analysisYears },
      efficiencyGains: { personnelReduction: 0, workHourReduction: 0, automationPercentage: 0 },
      qualityImprovements: { errorReduction: 0, reworkReduction: 0 },
      otherBenefits: { opportunityLossReduction: netAnnualBenefit, scalabilityImprovement: 0 },
      operationalCosts: { monthlySubscription: 0, maintenanceCost: 0, supportCost: 0 },
    });

  it('finds a negative IRR when the benefit does not recover the investment within one year', () => {
    const results = ROICalculator.calculate(withNetBenefit(1_500_000, 1));

    expect(results.netAnnualBenefit).toBe(1_500_000);
    expect(results.irr).toBeCloseTo(-50, 4);
  });

  it('finds a negative IRR where the first Newton step overshoots below -100%', () => {
    const results = ROICalculator.calculate(withNetBenefit(520_000, 2));
    const rate = results.irr / 100;
    const npvAtIrr = -3_000_000 + 520_000 / (1 + rate) + 520_000 / (1 + rate) ** 2;

    expect(results.irr).toBeCloseTo(-48.8, 1);
    expect(Math.abs(npvAtIrr)).toBeLessThan(1);
  });

  it('finds an IRR at which NPV is zero across a wide range of inputs', () => {
    for (const years of [1, 2, 3, 5, 10]) {
      for (const benefit of [1_000, 100_000, 504_000, 1_500_000, 3_000_000, 30_000_000]) {
        const { irr } = ROICalculator.calculate(withNetBenefit(benefit, years));
        const rate = irr / 100;
        let npv = -3_000_000;
        for (let year = 1; year <= years; year++) npv += benefit / (1 + rate) ** year;

        expect(Number.isFinite(irr), `years=${years} benefit=${benefit}`).toBe(true);
        expect(Math.abs(npv), `years=${years} benefit=${benefit}`).toBeLessThan(1);
      }
    }
  });

  it('reports payback as never reached when the net benefit is not positive', () => {
    const inputs = createInputs({
      efficiencyGains: { personnelReduction: 0, workHourReduction: 0, automationPercentage: 0 },
      qualityImprovements: { errorReduction: 0, reworkReduction: 0 },
      otherBenefits: { opportunityLossReduction: 0, scalabilityImprovement: 0 },
    });
    const results = ROICalculator.calculate(inputs);

    expect(results.netAnnualBenefit).toBeLessThan(0);
    expect(results.paybackPeriodMonths).toBe(Infinity);
    expect(Number.isNaN(results.irr)).toBe(true);
    expect(results.npv).toBeLessThan(0);
  });

  it('does not divide by zero without an initial investment', () => {
    const results = ROICalculator.calculate(
      createInputs({ initialInvestment: { systemCost: 0, customizationCost: 0, migrationCost: 0, setupCost: 0 } }),
    );

    expect(results.paybackPeriodMonths).toBe(0);
    expect(Number.isNaN(results.roi3Year)).toBe(true);
    expect(Number.isNaN(results.irr)).toBe(true);
  });
});

describe('ROICalculator labor reduction rates', () => {
  const labor = 10 * 3000 * 1920;
  const laborOnly = (personnelReduction: number, workHourReduction: number, automationPercentage: number) =>
    ROICalculator.calculate(
      createInputs({
        efficiencyGains: { personnelReduction, workHourReduction, automationPercentage },
        qualityImprovements: { errorReduction: 0, reworkReduction: 0 },
        otherBenefits: { opportunityLossReduction: 0, scalabilityImprovement: 0 },
      }),
    ).annualSavings;

  it('combines rates multiplicatively instead of summing them', () => {
    expect(ROICalculator.combineReductionRates([20, 30, 50])).toBeCloseTo(1 - 0.8 * 0.7 * 0.5);
  });

  it('never exceeds the current labor cost when the simple sum is over 100%', () => {
    // 60 + 50 + 40 = 150% when summed
    const savings = laborOnly(60, 50, 40);
    expect(savings).toBeCloseTo(labor * (1 - 0.4 * 0.5 * 0.6));
    expect(savings).toBeLessThan(labor);
  });

  it('yields no labor savings when every rate is 0%', () => {
    expect(ROICalculator.combineReductionRates([0, 0, 0])).toBe(0);
    expect(laborOnly(0, 0, 0)).toBe(0);
  });

  it('caps labor savings at the full labor cost when every rate is 100%', () => {
    expect(ROICalculator.combineReductionRates([100, 100, 100])).toBe(1);
    expect(laborOnly(100, 100, 100)).toBeCloseTo(labor);
  });

  it('caps labor savings at the full labor cost when any single rate is 100%', () => {
    expect(laborOnly(100, 0, 0)).toBeCloseTo(labor);
    expect(laborOnly(0, 0, 100)).toBeCloseTo(labor);
  });

  it('clamps out-of-range and missing rates', () => {
    expect(ROICalculator.combineReductionRates([150, -20])).toBe(1);
    expect(ROICalculator.combineReductionRates([-20, Number.NaN, undefined])).toBe(0);
  });
});
