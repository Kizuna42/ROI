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
      labor * (0.2 + 0.3 + 0.5) + 0.7 * 0.05 * labor + 0.8 * 0.03 * labor + 500_000 + 300_000;
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
